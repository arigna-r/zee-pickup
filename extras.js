/* Zee 的下班接送站 — extras: pet the cat, heart bursts, stamp card, daily cat moods, Alex's notes */
(function () {
  'use strict';
  var Z = window.__zee, K = window.__zeeLink;
  if (!Z) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var INK = '#4A3A3F';
  function today(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  /* ---------- storage ---------- */
  var XK = 'zee-pickup:extras:v1';
  function loadX() { try { return JSON.parse(localStorage.getItem(XK)) || {}; } catch (e) { return {}; } }
  var X = Object.assign({ stamps: [], next: [], cards: 0, rewards: [], pats: 0 }, loadX());
  function saveX() { try { localStorage.setItem(XK, JSON.stringify(X)); } catch (e) {} }

  /* ---------- styles ---------- */
  var st = document.createElement('style');
  st.textContent = [
    '.hero{cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;border-radius:24px}',
    '.hero.pat svg,.hero.pat img,.mascot.pat svg{animation:zpat .45s var(--ease)}',
    '@keyframes zpat{0%{transform:scale(1)}40%{transform:scale(1.045,.95)}100%{transform:scale(1)}}',
    '.mascot{position:relative;cursor:pointer;-webkit-user-select:none;user-select:none}',
    '.fh{position:absolute;pointer-events:none;font-size:22px;line-height:1;color:#E58A9E;z-index:3;animation:zfh 1.15s ease-out forwards}',
    '@keyframes zfh{0%{opacity:0;transform:translate(0,0) scale(.5)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),-74px) scale(1.15)}}',
    '.purr{position:absolute;left:50%;top:-6px;transform:translateX(-50%);white-space:nowrap;background:var(--card);padding:4px 12px;border-radius:999px;box-shadow:var(--shadow);font-size:14px;color:var(--ink-soft);pointer-events:none;z-index:4}',
    '.zburst{position:fixed;pointer-events:none;z-index:70;font-size:18px;line-height:1;color:#E58A9E;animation:zburst .95s ease-out forwards}',
    '@keyframes zburst{0%{opacity:1;transform:translate(0,0) scale(.5)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.2)}}',
    '.stamp-pill{cursor:pointer;font-weight:700;color:#8E3E52;background:var(--blush-soft);border-color:transparent;min-height:44px;padding:6px 14px}',
    '.note-card{margin:14px 0 0}',
    '.note-btn{width:100%;display:flex;align-items:center;gap:12px;min-height:60px;padding:12px 16px;border-radius:var(--r-md);border:1.5px dashed var(--blush-deep);background:#FFFDF7;font-size:16px;font-weight:700;text-align:left;color:var(--ink)}',
    '.note-btn .ne{font-size:26px}.note-btn small{display:block;font-weight:500;color:var(--ink-soft);font-size:13px}',
    '.note-paper{margin-top:10px;padding:14px 18px 12px;border-radius:14px;background:repeating-linear-gradient(#FFFDF7 0 27px,#F3E6DD 27px 28px);font-size:17px;line-height:28px;white-space:pre-wrap;word-break:break-word;transform:rotate(-1deg);box-shadow:var(--shadow);animation:zunfold .45s var(--ease) both}',
    '.note-paper + .note-paper{transform:rotate(1deg)}',
    '@keyframes zunfold{from{opacity:0;transform:rotate(-1deg) scaleY(.5)}to{opacity:1}}',
    '.note-paper small{display:block;text-align:right;color:var(--ink-soft);font-size:13px;line-height:1.5;margin-top:4px}',
    '.stamps{display:grid;grid-template-columns:repeat(5,1fr);gap:24px 10px;margin:16px 0 28px}',
    '.slot{aspect-ratio:1;border-radius:50%;border:2px dashed #E9D4D9;display:grid;place-items:center;position:relative;background:#fff}',
    '.slot.on{border:2px solid var(--blush);background:var(--blush-soft)}',
    '.slot svg{width:66%;height:66%;transform:rotate(-14deg)}',
    '.slot small{position:absolute;bottom:-19px;left:50%;transform:translateX(-50%);font-size:11px;color:var(--ink-soft);white-space:nowrap;font-family:var(--font-round)}',
    '.slot.new{animation:zstamp .55s var(--ease)}',
    '@keyframes zstamp{0%{transform:scale(1.7);opacity:0}60%{transform:scale(.9);opacity:1}100%{transform:scale(1)}}',
    '.rewards{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}',
    '.sheet .chip[aria-pressed="true"]{background:var(--blush-soft);border-color:var(--blush-deep);color:#8E3E52}',
    '.xstatus{min-height:1.4em;margin:10px 0 0;font-size:14.5px;color:#4E3F86}',
    '.forgot{margin:2px 0 18px;padding:14px 14px 12px;border-radius:16px;background:#FFF5F7;border:1.5px dashed #F1C9D2}',
    '.forgot p{margin:0 0 10px;font-size:14.5px;line-height:1.5}',
    '.days{display:flex;flex-wrap:wrap;gap:8px}',
    '.days .chip{min-height:40px}'
  ].join('\n');
  document.head.appendChild(st);

  /* ---------- hearts ---------- */
  function floatHearts(box, n, xPct, yPct) {
    var r = box.getBoundingClientRect();
    for (var i = 0; i < n; i++) {
      var h = document.createElement('span');
      h.className = 'fh'; h.textContent = i % 3 === 2 ? '✦' : '♡';
      h.style.left = (r.width * xPct + (Math.random() * 60 - 30)) + 'px';
      h.style.top = (r.height * yPct + (Math.random() * 16 - 8)) + 'px';
      h.style.setProperty('--dx', (Math.random() * 50 - 25) + 'px');
      h.style.animationDelay = (i * 0.08) + 's';
      box.appendChild(h);
      (function (el) { setTimeout(function () { el.remove(); }, 1500); })(h);
    }
  }
  function burst(el) {
    if (!el) return;
    var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var i = 0; i < 12; i++) {
      var h = document.createElement('span'), a = (Math.PI * 2 * i) / 12, d = 60 + Math.random() * 40;
      h.className = 'zburst'; h.textContent = i % 2 ? '♡' : '♥';
      h.style.left = cx + 'px'; h.style.top = cy + 'px';
      h.style.setProperty('--dx', Math.cos(a) * d + 'px'); h.style.setProperty('--dy', Math.sin(a) * d - 20 + 'px');
      document.body.appendChild(h);
      (function (x) { setTimeout(function () { x.remove(); }, 1100); })(h);
    }
  }

  /* ---------- pet the cat ---------- */
  var PURR = ['抱緊一點喔 ♡', '出發囉～ 🛵', '再戳一下下', '今天也載妳回家', '最喜歡妳了'];
  function pat(box, xPct, yPct) {
    box.classList.remove('pat'); void box.offsetWidth; box.classList.add('pat');
    floatHearts(box, 4, xPct, yPct);
    X.pats++; saveX();
    if (X.pats % 4 === 0) {
      var b = document.createElement('span'); b.className = 'purr';
      b.textContent = PURR[(X.pats / 4) % PURR.length];
      box.appendChild(b); setTimeout(function () { b.remove(); }, 1400);
    }
  }
  function makePettable(box, xPct, yPct) {
    if (!box || box.dataset.pet) return;
    box.dataset.pet = '1';
    box.removeAttribute('aria-hidden');
    box.setAttribute('role', 'button'); box.setAttribute('tabindex', '0'); box.setAttribute('aria-label', '戳一下，送妳愛心');
    box.addEventListener('click', function () { pat(box, xPct, yPct); });
    box.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pat(box, xPct, yPct); } });
  }

  /* ---------- daily cat moods ---------- */
  function moodFor(d) {
    var md = pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    if (md === '12-24' || md === '12-25') return { k: 'xmas', hello: 'Zee，聖誕快樂 🎄' };
    if (md === '12-31') return { k: 'party', hello: 'Zee，今年也辛苦啦 ✨' };
    if (md === '01-01') return { k: 'party', hello: 'Zee，新年快樂 🎊' };
    if (md === '02-14') return { k: 'hearts', hello: 'Zee，情人節快樂 ♡' };
    if (md === '05-20') return { k: 'hearts', hello: 'Zee，520 快樂 ♡' };
    return [
      { k: 'moon', hello: 'Zee，星期天慢慢來 🌙' },
      { k: 'coffee', hello: 'Zee，週一也辛苦啦 ☕' },
      { k: 'flowers', hello: 'Zee，今天也辛苦啦 ♡' },
      { k: 'boba', hello: 'Zee，週三了，撐過一半囉 🧋' },
      { k: 'star', hello: 'Zee，明天就週五了 ✨' },
      { k: 'balloon', hello: 'Zee，週五快樂！🎉' },
      { k: 'shades', hello: 'Zee，週末也要好好休息 ☀️' }
    ][d.getDay()];
  }
  function s(a) { return a.join(''); }
  var CONFETTI = s(['<g opacity=".9"><rect x="30" y="20" width="7" height="4" rx="1.5" fill="#F4B6C2" transform="rotate(25 33 22)"/>',
    '<rect x="236" y="14" width="7" height="4" rx="1.5" fill="#CDBDEB" transform="rotate(-20 239 16)"/>',
    '<rect x="60" y="56" width="6" height="4" rx="1.5" fill="#FBE7B5" transform="rotate(40 63 58)"/>',
    '<rect x="196" y="22" width="6" height="4" rx="1.5" fill="#F4B6C2" transform="rotate(-35 199 24)"/>',
    '<circle cx="164" cy="8" r="3" fill="#CDBDEB"/><circle cx="48" cy="36" r="2.5" fill="#E58A9E"/></g>']);
  var BASKET = {
    coffee: s(['<rect x="211" y="58" width="17" height="17" rx="3.5" fill="#FFFDF8" stroke="', INK, '" stroke-width="2.4"/>',
      '<rect x="213" y="61" width="13" height="4" rx="1" fill="#B98B6E"/>',
      '<path d="M228 62 q7 0 7 5.5 q0 5.5 -7 5.5" fill="none" stroke="', INK, '" stroke-width="2.2"/>',
      '<path d="M216 54 q-3 -4 0 -8 M223 54 q-3 -4 0 -8" stroke="#C9B8E8" stroke-width="2.2" fill="none" stroke-linecap="round"/>']),
    flowers: s(['<path d="M214 76 L214 64 M221 76 L221 58 M228 76 L228 64" stroke="#7FB38F" stroke-width="2.4" stroke-linecap="round"/>',
      '<circle cx="214" cy="63" r="5.5" fill="#F4B6C2" stroke="', INK, '" stroke-width="1.8"/><circle cx="221" cy="56" r="5.5" fill="#CDBDEB" stroke="', INK, '" stroke-width="1.8"/>',
      '<circle cx="228" cy="63" r="5.5" fill="#FBE7B5" stroke="', INK, '" stroke-width="1.8"/>',
      '<circle cx="214" cy="63" r="1.8" fill="#fff"/><circle cx="221" cy="56" r="1.8" fill="#fff"/><circle cx="228" cy="63" r="1.8" fill="#fff"/>']),
    boba: s(['<path d="M226 58 L232 44" stroke="#E58A9E" stroke-width="3" stroke-linecap="round"/>',
      '<path d="M211 58 L231 58 L228 78 L214 78 Z" fill="#F6D2B8" stroke="', INK, '" stroke-width="2.4" stroke-linejoin="round"/>',
      '<path d="M210 58 L232 58" stroke="', INK, '" stroke-width="3" stroke-linecap="round"/>',
      '<circle cx="217" cy="73" r="1.8" fill="', INK, '"/><circle cx="222" cy="74" r="1.8" fill="', INK, '"/><circle cx="226" cy="72" r="1.8" fill="', INK, '"/>']),
    star: s(['<path d="M221 50 l4.2 8.6 9.4 1.4 -6.8 6.6 1.6 9.4 -8.4 -4.4 -8.4 4.4 1.6 -9.4 -6.8 -6.6 9.4 -1.4z" fill="#FBE7B5" stroke="', INK, '" stroke-width="2.2" stroke-linejoin="round"/>'])
  };
  function decoSVG(k) {
    if (k === 'balloon') return s(['<path d="M224 74 C232 60 238 52 244 40" fill="none" stroke="', INK, '" stroke-width="1.6"/>',
      '<ellipse cx="247" cy="27" rx="12" ry="14" fill="#F4B6C2" stroke="', INK, '" stroke-width="2.4"/><path d="M244 41 l3 -2 3 2z" fill="', INK, '"/>',
      '<path d="M242 20 q2 -4 6 -4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>', CONFETTI]);
    if (k === 'shades') return s(['<rect x="96" y="50" width="16" height="10" rx="4" fill="', INK, '"/><rect x="118" y="50" width="16" height="10" rx="4" fill="', INK, '"/>',
      '<path d="M112 54 h6" stroke="', INK, '" stroke-width="2.4"/><path d="M99 52 l5 0" stroke="#fff" stroke-width="1.6" opacity=".7"/>']);
    if (k === 'xmas') return s(['<path d="M84 38 C88 6 136 0 146 30 C150 22 158 18 166 22" fill="#E2585B" stroke="', INK, '" stroke-width="2.6" stroke-linejoin="round"/>',
      '<circle cx="167" cy="23" r="6" fill="#fff" stroke="', INK, '" stroke-width="2.2"/>',
      '<rect x="80" y="32" width="70" height="11" rx="5.5" fill="#fff" stroke="', INK, '" stroke-width="2.4"/>']);
    if (k === 'party') return s(['<path d="M104 24 L114 -4 L126 24 Z" fill="#FBE7B5" stroke="', INK, '" stroke-width="2.4" stroke-linejoin="round"/>',
      '<path d="M108 14 L120 12 M106 20 L123 18" stroke="#E58A9E" stroke-width="2.4"/><circle cx="114" cy="-5" r="4" fill="#E58A9E" stroke="', INK, '" stroke-width="2"/>', CONFETTI]);
    if (k === 'hearts') return s(['<g fill="#F4B6C2" stroke="', INK, '" stroke-width="1.6">',
      '<path d="M40 30 c0 -5 7 -5 7 0 c0 -5 7 -5 7 0 c0 6 -7 10 -7 10 c0 0 -7 -4 -7 -10z"/>',
      '<path d="M170 10 c0 -4 6 -4 6 0 c0 -4 6 -4 6 0 c0 5 -6 8 -6 8 c0 0 -6 -3 -6 -8z"/>',
      '<path d="M236 30 c0 -4 5 -4 5 0 c0 -4 5 -4 5 0 c0 4 -5 7 -5 7 c0 0 -5 -3 -5 -7z"/></g>']);
    if (k === 'moon') return s(['<path d="M44 14 a16 16 0 1 0 16 22 a12 12 0 1 1 -16 -22z" fill="#FBE7B5" stroke="', INK, '" stroke-width="2.2" stroke-linejoin="round"/>',
      '<path d="M76 18 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z M22 52 l1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 3 -1.5z" fill="#CDBDEB"/>',
      '<text x="150" y="20" font-size="14" font-weight="700" fill="#9A88D2" font-family="ui-rounded,system-ui">z</text><text x="160" y="8" font-size="10" font-weight="700" fill="#C9B8E8" font-family="ui-rounded,system-ui">z</text>']);
    return '';
  }
  function applyMood() {
    var m = moodFor(new Date());
    var hello = $('.hello'); if (hello) hello.textContent = m.hello;
    var svg = $('#hero svg'); if (!svg) return;
    var old = svg.querySelector('#zdeco'); if (old) old.remove();
    var oldB = svg.querySelector('#zbasket'); if (oldB) oldB.remove();
    var heart = svg.querySelector('path[d^="M214 72"]');
    var bob = svg.querySelector('.bob') || svg.lastElementChild;
    var ns = 'http://www.w3.org/2000/svg';
    if (heart) heart.style.display = BASKET[m.k] ? 'none' : '';
    if (BASKET[m.k]) {
      var gb = document.createElementNS(ns, 'g'); gb.id = 'zbasket'; gb.innerHTML = BASKET[m.k];
      var basketPath = svg.querySelector('path[d^="M203 76"]');
      if (basketPath && basketPath.parentNode) basketPath.parentNode.insertBefore(gb, basketPath); else bob.appendChild(gb);
    }
    var deco = decoSVG(m.k);
    if (deco) { var g = document.createElementNS(ns, 'g'); g.id = 'zdeco'; g.innerHTML = deco; bob.appendChild(g); }
    svg.setAttribute('data-mood', m.k);
  }

  /* ---------- stamp card ---------- */
  var REWARDS = ['🧋 一杯手搖', '🍰 一個小甜點', '🍜 一頓宵夜', '💆 按摩 10 分鐘', '🎬 一起看電影'];
  var PAW = '<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="26" rx="9" ry="8" fill="#DC7F94"/><ellipse cx="8.5" cy="16" rx="4" ry="5" fill="#DC7F94"/><ellipse cx="15.5" cy="8.5" rx="4" ry="5" fill="#DC7F94"/><ellipse cx="24.5" cy="8.5" rx="4" ry="5" fill="#DC7F94"/><ellipse cx="31.5" cy="16" rx="4" ry="5" fill="#DC7F94"/></svg>';
  function renderPill() {
    var p = $('#stampPill'); if (!p) return;
    p.hidden = false;
    p.textContent = '🐾 ' + X.stamps.length + '/10';
    p.setAttribute('aria-label', '接送集點卡，已經集了 ' + X.stamps.length + ' 點');
  }
  var sheet = document.createElement('div');
  sheet.className = 'overlay'; sheet.id = 'stampSheet'; sheet.hidden = true;
  document.body.appendChild(sheet);
  sheet.addEventListener('click', function (e) { if (e.target === sheet || e.target.closest('[data-close]')) Z.closeOverlay(sheet); });
  var picked = null, newIdx = -1;
  function renderSheet() {
    var full = X.stamps.length >= 10;
    var slots = '';
    for (var i = 0; i < 10; i++) {
      var d = X.stamps[i];
      slots += '<div class="slot' + (d ? ' on' : '') + (i === newIdx ? ' new' : '') + '">' + (d ? PAW + '<small>' + (+d.slice(5, 7)) + '/' + (+d.slice(8)) + '</small>' : '') + '</div>';
    }
    var body = '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="stamp-title"><div class="grabber" aria-hidden="true"></div>' +
      '<h2 id="stamp-title">接送集點卡 🐾</h2>' +
      '<p>每次請 Alex 來接，就幫妳蓋一個章～集滿 10 個，可以跟他換一個小獎勵 ♡</p>' +
      '<div class="stamps" aria-label="已經集了 ' + X.stamps.length + ' 點">' + slots + '</div>';
    if (full) {
      body += '<p><b>集滿了！🎉 想換什麼？</b></p><div class="rewards" role="group" aria-label="選一個獎勵">' +
        REWARDS.map(function (r, j) { return '<button class="chip small" type="button" data-rw="' + j + '" aria-pressed="' + (picked === j) + '">' + r + '</button>'; }).join('') +
        '</div><button class="btn primary" type="button" id="redeemBtn"' + (picked == null ? ' disabled' : '') + '>跟 Alex 換這個 ♡</button>' +
        '<p class="xstatus" id="redeemStatus" role="status" aria-live="polite"></p>';
    } else {
      body += '<p style="text-align:center">還差 ' + (10 - X.stamps.length) + ' 個章就集滿囉～</p>';
    }
    if (X.cards) body += '<p style="text-align:center;font-size:13px">已經集滿過 ' + X.cards + ' 張卡了 ✨</p>';
    body += forgotHTML();
    body += '<button class="btn ghost" type="button" data-close>關起來</button></div>';
    sheet.innerHTML = body;
    newIdx = -1;
  }
  sheet.addEventListener('click', function (e) {
    var b = e.target.closest('[data-rw]');
    if (b) { picked = +b.dataset.rw; renderSheet(); return; }
    if (e.target.closest('#redeemBtn')) redeem();
  });
  /* forgot to stamp: tap a recent day to add (or remove) its stamp */
  var WD = '日一二三四五六';
  function hasStamp(d) { return X.stamps.indexOf(d) >= 0 || X.next.indexOf(d) >= 0; }
  function forgotHTML() {
    var now = new Date(), chips = '';
    for (var i = 0; i < 7; i++) {
      var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), d = today(dt), on = hasStamp(d);
      var label = i === 0 ? '今天' : i === 1 ? '昨天' : (dt.getMonth() + 1) + '/' + dt.getDate() + '（' + WD[dt.getDay()] + '）';
      chips += '<button class="chip small" type="button" data-fd="' + d + '" aria-pressed="' + on + '">' + (on ? '🐾 ' : '') + label + '</button>';
    }
    return '<div class="forgot"><p><b>忘記蓋章了嗎？</b><br>那天有請 Alex 接，點一下就能補蓋～點錯了再點一次就取消。</p><div class="days" role="group" aria-label="補蓋最近 7 天的章">' + chips + '</div></div>';
  }
  function toggleDay(d) {
    var i = X.stamps.indexOf(d), j = X.next.indexOf(d), added = false;
    if (i >= 0) { X.stamps.splice(i, 1); if (X.next.length) X.stamps.push(X.next.shift()); }
    else if (j >= 0) X.next.splice(j, 1);
    else { added = true; if (X.stamps.length < 10) X.stamps.push(d); else X.next.push(d); }
    X.stamps.sort(); X.next.sort();
    if (added) newIdx = X.stamps.indexOf(d);
    saveX(); renderPill(); renderSheet();
    Z.toast(added ? '🐾 補蓋好了！集點卡 ' + X.stamps.length + '/10' : '已經把那天的章拿掉了');
    syncStamps();
  }
  var syncT = null;
  function syncStamps() {
    clearTimeout(syncT);
    syncT = setTimeout(async function () {
      var L = window.__zeeLink;
      if (!L || !L.paired() || navigator.onLine === false) return;
      try {
        var t = await L.topics();
        await fetch(L.NTFY + '/', { method: 'POST', body: JSON.stringify({ topic: t.ans, title: 'Zee 的集點卡 🐾',
          message: '集點卡更新：現在 ' + X.stamps.length + '/10', tags: ['paw_prints', 'stamps-' + X.stamps.length], priority: 1 }) });
      } catch (e) {}
    }, 2500);
  }
  sheet.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fd]');
    if (b) toggleDay(b.dataset.fd);
  });
  function openSheet() { renderSheet(); Z.openOverlay('stampSheet'); }
  async function redeem() {
    var stEl = $('#redeemStatus'), btn = $('#redeemBtn');
    if (picked == null) return;
    var reward = REWARDS[picked];
    if (!K || !K.paired()) { stEl.textContent = '要先連結 Alex 的收件匣：在小卡頁按一次「直接傳給 Alex」就好～'; return; }
    if (navigator.onLine === false) { stEl.textContent = '兌換需要網路，連上之後再按一次喔。'; return; }
    btn.disabled = true; stEl.textContent = '傳送中…';
    try {
      var t = await K.topics();
      var r = await fetch(K.NTFY + '/', { method: 'POST', body: JSON.stringify({
        topic: t.ans, title: 'Zee 集滿點數了！🎁', message: '接送集點卡集滿 10 點了～想跟你換：' + reward + ' ♡',
        tags: ['gift', 'stamps-' + Math.min(X.next.length, 10)], priority: 4, click: new URL('alex.html', location.href).href }) });
      if (!r.ok) throw new Error('http ' + r.status);
      X.rewards.push({ date: today(), reward: reward }); X.cards++;
      X.stamps = X.next.slice(0, 10); X.next = []; picked = null; saveX();
      renderSheet(); renderPill();
      var s2 = $('#stampSheet .sheet p'); if (s2) s2.insertAdjacentHTML('afterend', '<p class="xstatus">已經傳給 Alex 了：' + esc(reward) + ' ♡ 他打開收件匣就看得到～</p>');
      burst($('#stampSheet h2'));
    } catch (e) {
      stEl.textContent = '沒送出去，網路好像不太穩，等一下再試試看～'; btn.disabled = false;
    }
  }
  function stampCount(choice) {
    var d = today(), n = X.stamps.length;
    if (choice === 'pickup' && n < 10 && X.stamps.indexOf(d) < 0 && X.next.indexOf(d) < 0) n++;
    return n;
  }
  function delivered(fromSend) {
    var S = Z.state();
    if (fromSend) burst($('#sendBtn'));
    if (S.choice !== 'pickup') return;
    var d = today();
    if (X.stamps.indexOf(d) >= 0 || X.next.indexOf(d) >= 0) return;
    if (X.stamps.length < 10) { X.stamps.push(d); newIdx = X.stamps.length - 1; } else X.next.push(d);
    saveX(); renderPill();
    var n = X.stamps.length;
    setTimeout(function () { Z.toast(n >= 10 ? '🐾 集點卡集滿了！點右上角的 🐾 換獎勵 ♡' : '🐾 蓋章！集點卡 ' + n + '/10'); }, fromSend ? 1500 : 900);
  }

  /* ---------- Alex's notes ---------- */
  function renderNotes() {
    var box = $('#noteCard'); if (!box) return;
    var S = Z.state(), notes = S.notes || [];
    if (!notes.length) { box.hidden = true; box.innerHTML = ''; return; }
    box.hidden = false;
    var head = '<button class="note-btn" type="button" id="noteToggle" aria-expanded="' + !!S.notesOpen + '"><span class="ne" aria-hidden="true">💌</span><span>' +
      'Alex 留了' + (notes.length > 1 ? ' ' + notes.length + ' 張' : '一張') + '小紙條給妳<small>' + (S.notesOpen ? '點一下收起來' : '點開看看～') + '</small></span></button>';
    var papers = S.notesOpen ? notes.map(function (n) {
      var d = new Date(n.time);
      return '<div class="note-paper">' + esc(n.text) + '<small>— Alex・' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + '</small></div>';
    }).join('') : '';
    box.innerHTML = head + papers;
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#noteToggle')) {
      var S = Z.state(); S.notesOpen = !S.notesOpen; Z.save(); renderNotes();
      if (S.notesOpen) floatHearts($('#noteCard'), 3, 0.15, 0.2);
    }
    if (e.target.closest && e.target.closest('#stampPill')) openSheet();
  });
  var notePolling = false;
  async function pollNotes() {
    if (!K || !K.paired() || notePolling || navigator.onLine === false) return;
    notePolling = true;
    try {
      var t = await K.topics(), S = Z.state();
      var mid = new Date(); mid.setHours(0, 0, 0, 0);
      var r = await fetch(K.NTFY + '/' + t.nts + '/json?poll=1&since=' + Math.floor(mid.getTime() / 1000));
      var seen = {}, list = [];
      (await r.text()).split('\n').forEach(function (line) {
        try { var o = JSON.parse(line); if (o.event === 'message' && o.message && !seen[o.message]) { seen[o.message] = 1; list.push({ text: o.message, time: o.time * 1000 }); } } catch (e) {}
      });
      list.sort(function (a, b) { return b.time - a.time; });
      if (Z.state() === S) {
        var before = (S.notes || []).map(function (n) { return n.text; }).join('|');
        var after = list.map(function (n) { return n.text; }).join('|');
        if (list.length && after !== before) { S.notes = list.slice(0, 3); Z.save(); renderNotes(); }
      }
    } catch (e) {}
    notePolling = false;
  }

  /* ---------- wiring ---------- */
  function welcome() { applyMood(); renderPill(); renderNotes(); makePettable($('#hero'), 0.42, 0.18); }
  makePettable($('#energyCat'), 0.5, 0.25);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) pollNotes(); });
  window.addEventListener('online', pollNotes);
  setInterval(function () { if (!document.hidden && Z.state().screen === 'welcome') pollNotes(); }, 60000);

  window.__zeeExtras = { stampCount: stampCount, welcome: welcome, delivered: delivered, pollNotes: pollNotes, burst: burst, state: function () { return X; }, moodFor: moodFor };
  welcome(); pollNotes();
})();
