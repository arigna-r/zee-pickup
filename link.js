/* Zee 的下班接送站 — send answers to Alex's inbox (via ntfy.sh) */
(function () {
  'use strict';
  var Z = window.__zee;
  if (!Z) return;

  var NTFY = 'https://ntfy.sh';
  var LKEY = 'zee-pickup:link:v1';
  var ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var hhmm = function (t) { var d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

  function norm(c) {
    c = String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (c.length !== 8) return null;
    for (var i = 0; i < 8; i++) if (ALPH.indexOf(c[i]) < 0) return null;
    return c;
  }
  function loadL() { try { return JSON.parse(localStorage.getItem(LKEY)) || {}; } catch (e) { return {}; } }
  function saveL() { try { localStorage.setItem(LKEY, JSON.stringify(L)); } catch (e) {} }
  var L = loadL();

  // Pair automatically when opened from Alex's link: …/#pair=XXXX-XXXX
  var m = location.hash.match(/pair=([A-Za-z0-9-]+)/);
  if (m) { var c0 = norm(m[1]); if (c0 && L.code !== c0) { L.code = c0; saveL(); } }

  var topicCache = {};
  async function topics(code) {
    if (topicCache[code]) return topicCache[code];
    var d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('zee-pickup|' + code));
    var h = Array.prototype.map.call(new Uint8Array(d), function (x) { return x.toString(16).padStart(2, '0'); }).join('');
    return (topicCache[code] = { ans: 'zp_' + h.slice(0, 28), rep: 'zp_' + h.slice(28, 56), nts: 'zp_' + h.slice(56) + h.slice(0, 20) });
  }

  var HEADS = {
    pickup: ['scooter', '今天想請你來接我 ♡'],
    self: ['house', '今天自己回家～'],
    later: ['thought_balloon', '晚點再跟你說']
  };
  function payload(S, msg, isUpdate) {
    var h = HEADS[S.choice] || ['heart', '今天的下班小卡'];
    var cls = S.choice === 'pickup' && S.from === 'cls';
    return {
      title: (isUpdate ? 'Zee 更新了：' : 'Zee：') + (cls ? '下課後想請你來接我 ♡' : h[1]),
      message: msg,
      tags: (cls ? [h[0], 'books'] : [h[0]]).concat(window.__zeeExtras && window.__zeeExtras.stampCount ? ['stamps-' + window.__zeeExtras.stampCount(S.choice)] : []),
      priority: S.choice === 'pickup' ? 4 : 3,
      click: new URL('alex.html', location.href).href
    };
  }

  /* ---------- UI ---------- */
  function render() {
    var card = $('#sendCard'), btn = $('#sendBtn'), rc = $('#replyCard');
    if (!card || !btn) return;
    var S = Z.state(), k = S.link, msg = Z.currentMsg();
    var changed = k && k.status === 'sent' && k.msg !== msg;
    btn.disabled = !!(k && k.status === 'sending');
    btn.textContent = !k ? '💌 直接傳給 Alex'
      : k.status === 'sending' ? '傳送中…'
      : k.status === 'sent' ? (changed ? '💌 把新的內容傳給 Alex' : '💌 再傳一次')
      : '💌 直接傳給 Alex';
    var html = '', cls = '';
    if (k) {
      if (k.status === 'sent') {
        cls = 'ok';
        html = '<b>已送出 ✓ ' + hhmm(k.sentAt) + '</b>Alex 收到通知或打開收件匣就看得到。' +
          (changed ? '<br>妳剛剛改過內容，記得再傳一次新的喔。' : '');
      } else if (k.status === 'sending') {
        cls = 'wait'; html = '<b>傳送中…</b>';
      } else if (k.status === 'queued') {
        cls = 'wait';
        html = '<b>還沒送出：現在沒有網路</b>連上網路後會自動幫妳送出～' +
          '<br><button class="link-btn" type="button" data-link="cancel">先不要送</button>';
      } else if (k.status === 'failed') {
        cls = 'bad';
        html = '<b>沒送出去 😿</b>' + (k.err === 'busy' ? '傳送太頻繁了，等一下再試試看。' : '連線好像不太穩，可以再按一次，或先用「複製」傳給他。') +
          '<br><button class="link-btn" type="button" data-link="retry">再試一次</button>';
      }
    }
    card.className = 'send-card ' + cls;
    card.innerHTML = html;
    card.hidden = !html;
    if (S.reply && S.reply.text) {
      rc.innerHTML = '<small>Alex 回覆・' + hhmm(S.reply.time) + '</small>' + esc(S.reply.text);
      rc.hidden = false;
    } else { rc.hidden = true; rc.innerHTML = ''; }
  }

  /* ---------- sending ---------- */
  function send() {
    if (!L.code) { openPair(); return; }
    var S = Z.state(), msg = Z.currentMsg();
    var prev = S.link, isUpdate = !!(prev && prev.sentAt);
    S.link = { status: 'queued', msg: msg, payload: payload(S, msg, isUpdate),
      sentAt: prev && prev.sentAt, prevMsg: prev ? (prev.status === 'sent' ? prev.msg : prev.prevMsg) : undefined };
    Z.save();
    if (navigator.onLine === false) { render(); return; }
    flush();
  }

  var flushing = false;
  async function flush() {
    var S = Z.state(), k = S.link;
    if (!k || k.status !== 'queued' || flushing || !L.code) { render(); return; }
    if (navigator.onLine === false) { render(); return; }
    flushing = true;
    k.status = 'sending'; Z.save(); render();
    try {
      var t = await topics(L.code);
      var body = Object.assign({ topic: t.ans }, k.payload);
      var r = await fetch(NTFY + '/', { method: 'POST', body: JSON.stringify(body) });
      if (!r.ok) { var er = new Error('http ' + r.status); er.code = r.status; throw er; }
      var j = {}; try { j = await r.json(); } catch (e) {}
      k.status = 'sent'; k.id = j.id || ''; k.sentAt = Date.now();
    } catch (e) {
      if (navigator.onLine === false) { k.status = 'queued'; }
      else { k.status = 'failed'; k.err = e.code === 429 ? 'busy' : 'net'; }
    }
    flushing = false;
    if (Z.state() === S) { Z.save(); render(); }
    if (k.status === 'sent') { Z.toast('已送給 Alex ✓'); pollReply(); if (window.__zeeExtras) window.__zeeExtras.delivered(true); }
  }

  /* ---------- Alex's reply ---------- */
  var polling = false;
  async function pollReply() {
    var S = Z.state();
    if (!L.code || polling || navigator.onLine === false || !S.link || S.link.status !== 'sent') return;
    polling = true;
    try {
      var t = await topics(L.code);
      var midnight = new Date(); midnight.setHours(0, 0, 0, 0);
      var r = await fetch(NTFY + '/' + t.rep + '/json?poll=1&since=' + Math.floor(midnight.getTime() / 1000));
      var last = null;
      (await r.text()).split('\n').forEach(function (line) {
        try { var o = JSON.parse(line); if (o.event === 'message' && (!last || o.time >= last.time)) last = o; } catch (e) {}
      });
      var cur = Z.state();
      if (last && cur === S && (!cur.reply || cur.reply.id !== last.id)) {
        cur.reply = { id: last.id, text: last.message || '', time: last.time * 1000 };
        Z.save(); render();
        if (cur.screen === 'summary') Z.toast('Alex 回覆了 ♡');
      }
    } catch (e) {}
    polling = false;
  }

  /* ---------- pairing sheet ---------- */
  var sheet = document.createElement('div');
  sheet.className = 'overlay'; sheet.id = 'pairSheet'; sheet.hidden = true;
  sheet.innerHTML =
    '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="pair-title">' +
    '<div class="grabber" aria-hidden="true"></div>' +
    '<h2 id="pair-title">連結 Alex 的收件匣 🔗</h2>' +
    '<p>第一次傳送前，輸入 Alex 給妳的配對碼就好（只要輸入一次）。</p>' +
    '<label class="field"><span class="sr-only">配對碼</span><input id="pairInput" type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12" placeholder="XXXX-XXXX"></label>' +
    '<p class="pair-err" id="pairErr" role="alert"></p>' +
    '<button class="btn primary" type="button" id="pairOk">連結並傳送 💌</button>' +
    '<button class="btn ghost" type="button" data-close>先不要</button>' +
    '</div>';
  document.body.appendChild(sheet);
  sheet.addEventListener('click', function (e) { if (e.target === sheet || e.target.closest('[data-close]')) Z.closeOverlay(sheet); });
  function openPair() { $('#pairErr').textContent = ''; $('#pairInput').value = ''; Z.openOverlay('pairSheet'); }
  function confirmPair() {
    var c = norm($('#pairInput').value);
    if (!c) { $('#pairErr').textContent = '配對碼好像不太對，再看一下 Alex 傳的訊息～（8 個英文和數字）'; return; }
    L.code = c; saveL(); Z.closeOverlay(sheet); send();
  }
  $('#pairOk').addEventListener('click', confirmPair);
  $('#pairInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); confirmPair(); } });

  /* ---------- wiring ---------- */
  $('#sendBtn').addEventListener('click', send);
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-link]');
    if (!b) return;
    var S = Z.state();
    if (b.dataset.link === 'cancel' && S.link) {
      S.link = S.link.sentAt ? { status: 'sent', msg: S.link.prevMsg, sentAt: S.link.sentAt } : null;
      Z.save(); render();
    }
    if (b.dataset.link === 'retry' && S.link) { S.link.status = 'queued'; Z.save(); flush(); }
  });
  ['#msgEdit', '#msgReset'].forEach(function (s) { var el = $(s); if (el) el.addEventListener(s === '#msgEdit' ? 'input' : 'click', function () { setTimeout(render, 0); }); });
  window.addEventListener('online', function () { flush(); });
  window.addEventListener('offline', render);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { flush(); pollReply(); } });
  setInterval(function () { if (!document.hidden) { flush(); if (Z.state().screen === 'summary') pollReply(); } }, 20000);

  // A send left "sending" by a closed app goes back to the queue.
  (function () { var S = Z.state(); if (S.link && S.link.status === 'sending') { S.link.status = 'queued'; Z.save(); } })();

  window.__zeeLink = { render: render, send: send, flush: flush, pollReply: pollReply, paired: function () { return !!L.code; },
    topics: function () { return L.code ? topics(L.code) : Promise.resolve(null); }, NTFY: NTFY };
  render(); flush(); pollReply();
})();
