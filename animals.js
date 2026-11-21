/* Zee 的下班接送站 — the daily riding buddies.
   One original couple per day: Alex drives (dark gray helmet ♡), Zee rides behind (blue helmet + flower).
   Used by index.html (scooter + mood buddy) and alex.html (inbox buddy). */
(function () {
  var INK = '#4A3A3F';

  /* ---------- species ---------- */
  // B body/head · L arms/legs · T tummy & muzzle · E ears · I inner ear
  var SPECIES = {
    cat:     { name: '小貓',   B: '#FFF8EE', L: '#FFF8EE', T: '#FFFFFF', E: '#FFF8EE', I: '#F7B8C6', ear: 'tri',   nose: 'pink', whisk: true },
    penguin: { name: '小企鵝', penguin: true },
    bear:    { name: '小熊',   B: '#A97B5B', L: '#A97B5B', T: '#F3DCC5', E: '#A97B5B', I: '#F4B6C2', ear: 'round', nose: 'dark' },
    polar:   { name: '小北極熊', B: '#EEE9E2', L: '#EEE9E2', T: '#FFFFFF', E: '#EEE9E2', I: '#F4B6C2', ear: 'round', nose: 'dark' },
    koala:   { name: '小無尾熊', B: '#A9AFBA', L: '#A9AFBA', T: '#EEF0F3', E: '#A9AFBA', I: '#F7F4F1', ear: 'big',   nose: 'koala' },
    bunny:   { name: '小兔子', B: '#F6F1EC', L: '#F6F1EC', T: '#FFFFFF', E: '#F6F1EC', I: '#F7B8C6', ear: 'long',  nose: 'pink' },
    panda:   { name: '小貓熊', B: '#FBFAF7', L: '#3F3B3E', T: '#FFFFFF', E: '#3F3B3E', I: '#5A5458', ear: 'round', nose: 'dark', patch: true },
    puppy:   { name: '小狗狗', B: '#E2AC72', L: '#E2AC72', T: '#FFF4E6', E: '#A9733F', I: '#A9733F', ear: 'flop',  nose: 'dark' },
    hamster: { name: '小倉鼠', B: '#EDB984', L: '#EDB984', T: '#FFF7EC', E: '#EDB984', I: '#F7B8C6', ear: 'small', nose: 'pink', cheeks: true }
  };
  var ORDER = ['cat', 'penguin', 'bear', 'polar', 'koala', 'bunny', 'panda', 'puppy', 'hamster'];

  /* Same buddy all day on both phones; never the same two days in a row. */
  function dayKey(d) { return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
  function pick(d) {
    var x = dayKey(d) * 2654435761 % 4294967296;
    x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x ^= x >>> 13;
    return (x >>> 0) % ORDER.length;
  }
  var FIXED = 'polar'; // one buddy every day (set to '' to rotate daily again)
  function today(d) {
    if (FIXED) return FIXED;
    d = d || new Date();
    var y = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
    var i = pick(d), j = pick(y);
    if (i === j) i = (i + 1 + (dayKey(d) % (ORDER.length - 1))) % ORDER.length;
    return ORDER[i];
  }

  var FLOWER_S = '<g transform="translate(101 31)"><circle r="3.4" cx="0" cy="-3.8" fill="#F7B8C6"/><circle r="3.4" cx="3.6" cy="-1" fill="#F7B8C6"/><circle r="3.4" cx="2.2" cy="3.2" fill="#F7B8C6"/><circle r="3.4" cx="-2.2" cy="3.2" fill="#F7B8C6"/><circle r="3.4" cx="-3.6" cy="-1" fill="#F7B8C6"/><circle r="2" fill="#FBE7B5"/></g>';
  var ZEE_HELMET = '<path d="M58 51 C54 15 111 13 108 47 C92 40 73 41 58 51 Z" fill="#4F78C4" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M84.5 26.5 C87.5 31 89 36.5 89 41.5" fill="none" stroke="#F3F6FF" stroke-width="5.5" stroke-linecap="round"/>' +
    '<path d="M66 27 C70 22 76 20 80 20" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" opacity=".45"/>' + FLOWER_S;
  var ALEX_HELMET = '<path d="M105 43 C102 9 163 7 161 39 C144 32 124 33 105 43 Z" fill="#5B565A" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M116 20 C124 15 138 14 146 17" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".4"/>' +
    '<path d="M141 26 c0 -3.2 4.6 -3.2 4.6 0 c0 -3.2 4.6 -3.2 4.6 0 c0 4 -4.6 6.4 -4.6 6.4 c0 0 -4.6 -2.4 -4.6 -6.4z" fill="#F4B6C2"/>';
  var HANDLEBAR = '<path d="M178 60 L214 52" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
    '<path d="M205 54 L215 51.8" stroke="#E58A9E" stroke-width="7" stroke-linecap="round"/>';
  var HEARTS = '<path d="M104 8 c0 -3.6 5 -3.6 5 0 c0 -3.6 5 -3.6 5 0 c0 4.4 -5 7 -5 7 c0 0 -5 -2.6 -5 -7z" fill="#E58A9E" stroke="' + INK + '" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M93 13 c0 -2.4 3.4 -2.4 3.4 0 c0 -2.4 3.4 -2.4 3.4 0 c0 3 -3.4 4.7 -3.4 4.7 c0 0 -3.4 -1.7 -3.4 -4.7z" fill="#F4B6C2"/>';
  function limb(d, c, w) { return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="' + (w + 5) + '" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
  function circ(cx, cy, r, f, sw) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"' + (sw ? ' stroke="' + INK + '" stroke-width="' + sw + '"' : '') + '/>'; }
  function ell(cx, cy, rx, ry, f, sw, rot) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (sw ? ' stroke="' + INK + '" stroke-width="' + sw + '"' : '') + (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '') + '/>'; }

  /* ---------- ears (scooter) ---------- */
  // each spec: [left ear, right ear] around head center (hx,hy); k = size factor
  function earsHero(s, who) {
    var z = who === 'zee', E = s.E, I = s.I;
    switch (s.ear) {
      case 'round': return z
        ? circ(61, 33, 8, E, 2.6) + circ(61, 33, 4, I) + circ(105, 31, 8, E, 2.6) + circ(105, 31, 4, I)
        : circ(109, 25, 8.5, E, 2.6) + circ(109, 25, 4.2, I) + circ(158, 22, 8.5, E, 2.6) + circ(158, 22, 4.2, I);
      case 'small': return z
        ? circ(62, 35, 6.5, E, 2.4) + circ(62, 35, 3.2, I) + circ(104, 33, 6.5, E, 2.4) + circ(104, 33, 3.2, I)
        : circ(110, 27, 7, E, 2.4) + circ(110, 27, 3.4, I) + circ(157, 24, 7, E, 2.4) + circ(157, 24, 3.4, I);
      case 'big': return z
        ? circ(56, 37, 11.5, E, 2.6) + circ(55, 38, 6.5, I) + circ(110, 35, 11.5, E, 2.6) + circ(111, 36, 6.5, I)
        : circ(104, 28, 12.5, E, 2.6) + circ(103, 29, 7, I) + circ(163, 25, 12.5, E, 2.6) + circ(164, 26, 7, I);
      case 'tri': return z
        ? '<path d="M54 44 L57 22 L72 33 Z M98 31 L111 20 L113 43 Z" fill="' + E + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/><path d="M58 38 L59.5 27 L67 33 Z M102 31 L109 25 L110 37 Z" fill="' + I + '"/>'
        : '<path d="M103 36 L106 12 L121 24 Z M147 19 L163 9 L163 33 Z" fill="' + E + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/><path d="M107 30 L108.5 18 L116 24 Z M151 20 L160 14 L160 28 Z" fill="' + I + '"/>';
      case 'long': return z
        ? ell(57, 30, 5.5, 15, E, 2.6, -58) + ell(57, 30, 2.6, 10, I, 0, -58) + ell(64, 22, 5.5, 15, E, 2.6, -42) + ell(64, 22, 2.6, 10, I, 0, -42)
        : ell(108, 22, 6, 16, E, 2.6, -60) + ell(108, 22, 2.8, 11, I, 0, -60) + ell(116, 14, 6, 16, E, 2.6, -44) + ell(116, 14, 2.8, 11, I, 0, -44);
      case 'flop': return '';
    }
    return '';
  }
  function flopHero(s, who) {
    if (s.ear !== 'flop') return '';
    return who === 'zee'
      ? ell(63, 56, 6, 11.5, s.E, 2.6, 22) + ell(103, 55, 6, 11.5, s.E, 2.6, -22)
      : ell(111, 50, 6.5, 12.5, s.E, 2.6, 22) + ell(156, 48, 6.5, 12.5, s.E, 2.6, -22);
  }

  /* ---------- muzzle / nose / mouth (scooter) ---------- */
  function faceHero(s, who) {
    var z = who === 'zee', mx = z ? 84 : 139, my = z ? 64.5 : 61, ny = z ? 62 : 58.4, out = '';
    var mrx = z ? 9.5 : 10.5, mry = z ? 7 : 7.5;
    if (s.nose !== 'pink' || s.cheeks) out += ell(mx, my, mrx, mry, s.T);
    var mouthY = ny + 3.6;
    if (s.nose === 'koala') { out += ell(mx, ny - 0.5, z ? 4.6 : 5, z ? 5.4 : 5.8, INK) + ell(mx - 1.5, ny - 2.6, 1.2, 1.6, '#fff') ; mouthY = ny + 6.4; }
    else if (s.nose === 'pink') { out += ell(mx, ny + 0.6, z ? 2.4 : 2.7, z ? 1.8 : 2, '#E58A9E', 1.4); mouthY = ny + 3.2; }
    else out += ell(mx, ny, z ? 3.4 : 3.6, z ? 2.4 : 2.6, INK);
    out += '<path d="M' + (mx - 3.2) + ' ' + mouthY + ' q1.6 1.8 3.2 0 q1.6 1.8 3.2 0" fill="none" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round"/>';
    if (s.whisk) out += '<path d="M' + (mx - 7) + ' ' + (ny + 1) + ' l-9 -2 M' + (mx - 7) + ' ' + (ny + 4) + ' l-9 1.5 M' + (mx + 7) + ' ' + (ny + 1) + ' l9 -2 M' + (mx + 7) + ' ' + (ny + 4) + ' l9 1.5" stroke="' + INK + '" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>';
    return out;
  }
  function eyesHero(s, who) {
    if (who === 'zee') {
      var lines = '<path d="M71 57 q4 -4.6 8 0 M88 57 q4 -4.6 8 0" fill="none" stroke="' + (s.patch ? '#FFFDF8' : INK) + '" stroke-width="2.5" stroke-linecap="round"/>';
      return (s.patch ? ell(75, 56.5, 6.8, 5.6, s.L, 0, -12) + ell(92, 56.5, 6.8, 5.6, s.L, 0, 12) : '') + lines;
    }
    var e = '';
    if (s.patch) e += ell(128.5, 53, 7.6, 8.6, s.L, 0, -18) + ell(147.5, 52, 7.4, 8.4, s.L, 0, 18) + circ(129, 53, 5.4, '#FFFDF8') + circ(147, 52, 5.2, '#FFFDF8');
    return e + '<ellipse cx="129" cy="53" rx="' + (s.patch ? 3.6 : 4.6) + '" ry="' + (s.patch ? 4.4 : 5.6) + '" fill="' + INK + '"/><ellipse cx="147" cy="52" rx="' + (s.patch ? 3.4 : 4.4) + '" ry="' + (s.patch ? 4.2 : 5.4) + '" fill="' + INK + '"/>' +
      '<circle cx="130.6" cy="50.8" r="1.9" fill="#fff"/><circle cx="148.4" cy="49.8" r="1.8" fill="#fff"/><circle cx="127.9" cy="55.8" r=".9" fill="#fff"/><circle cx="145.9" cy="54.8" r=".9" fill="#fff"/>';
  }
  function blushHero(s, who) {
    var k = s.cheeks ? 1.35 : 1;
    return who === 'zee'
      ? ell(70, 64, 4.6 * k, 3 * k, '#F7A8B8') + ell(97, 64, 4.6 * k, 3 * k, '#F7A8B8')
      : ell(121, 60, 4.8 * k, 3.1 * k, '#F7A8B8') + ell(155, 59, 4.4 * k, 2.9 * k, '#F7A8B8');
  }

  function ridersMammal(s) {
    var B = s.B, L = s.L, T = s.T;
    return '' +
      // Zee leg + foot
      limb('M95 92 C98 99 100 104 104 108', L, 5) +
      '<path d="M99 109 C100 104 112 104 114 109 C110 112 103 112 99 109 Z" fill="' + L + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' + ell(106.5, 108.8, 3, 1.6, '#F4B6C2') +
      // Zee body + tummy
      ell(88, 80, 18, 15.5, B, 3) + ell(93, 83, 10.5, 11, T) +
      // Alex leg + foot
      limb('M128 90 C140 98 152 112 162 124', L, 8) +
      '<path d="M155 127 C155 119 172 118 177 126 C171 130 161 130 155 127 Z" fill="' + L + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      // Alex body + tummy
      ell(124, 78, 20, 17, B, 3) + ell(131, 82, 11, 12, T) +
      // Zee hugging arm, Alex arm to handlebar
      limb('M99 75 C108 83 117 86 125 84', L, 6) +
      '<path d="M134 72 L183 61" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/><path d="M134 72 L183 61" stroke="' + L + '" stroke-width="6.5" stroke-linecap="round"/>' +
      HANDLEBAR + ell(187, 59, 7.5, 6, L, 2.6, -14) +
      // Zee head
      ell(83, 54, 23, 21, B, 3) + earsHero(s, 'zee') + flopHero(s, 'zee') + ZEE_HELMET +
      eyesHero(s, 'zee') + blushHero(s, 'zee') + faceHero(s, 'zee') +
      // Alex head
      ell(133, 47, 26, 23, B, 3) + earsHero(s, 'alex') + flopHero(s, 'alex') + ALEX_HELMET +
      eyesHero(s, 'alex') + blushHero(s, 'alex') + faceHero(s, 'alex') +
      HEARTS;
  }

  function ridersPenguin() {
    var PD = '#465A7A', OR = '#F5A65B', W = '#FFFDF8';
    return '' +
      limb('M95 92 C98 99 100 104 104 108', PD, 5) +
      '<path d="M99 109 C100 104 112 104 114 109 C110 112 103 112 99 109 Z" fill="' + OR + '" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>' +
      ell(88, 80, 18, 15.5, PD, 3) + ell(93, 83, 10.5, 11, W) +
      limb('M128 90 C140 98 152 112 162 124', PD, 8) +
      '<path d="M155 127 C155 119 172 118 177 126 C171 130 161 130 155 127 Z" fill="' + OR + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      ell(124, 78, 20, 17, PD, 3) + ell(131, 82, 11, 12, W) +
      limb('M99 75 C108 83 117 86 125 84', PD, 6) +
      '<path d="M134 72 L183 61" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/><path d="M134 72 L183 61" stroke="' + PD + '" stroke-width="6.5" stroke-linecap="round"/>' +
      HANDLEBAR + ell(187, 59, 7.5, 6, PD, 2.6, -14) +
      ell(83, 54, 23, 21, PD, 3) +
      '<path d="M65 58 C64 47 75 44 83 49 C91 44 103 47 102 58 C101 70 92 74 83 74 C74 74 66 70 65 58 Z" fill="' + W + '"/>' + ZEE_HELMET +
      '<path d="M71 57 q4 -4.6 8 0 M88 57 q4 -4.6 8 0" fill="none" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>' +
      ell(70, 64, 4.6, 3, '#F7A8B8') + ell(97, 64, 4.6, 3, '#F7A8B8') +
      '<path d="M78.5 62.5 C80.5 59.5 87.5 59.5 89.5 62.5 C87.5 66.5 80.5 66.5 78.5 62.5 Z" fill="' + OR + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>' +
      ell(133, 47, 26, 23, PD, 3) +
      '<path d="M118 53 C117 42 129 39 138 44 C146 39 159 42 158 53 C157 65 148 69 138 69 C127 69 119 65 118 53 Z" fill="' + W + '"/>' + ALEX_HELMET +
      eyesHero({}, 'alex') + ell(121, 60, 4.8, 3.1, '#F7A8B8') + ell(155, 59, 4.4, 2.9, '#F7A8B8') +
      '<path d="M132 60.5 C134.5 57 143.5 57 146 60.5 C143.5 65 134.5 65 132 60.5 Z" fill="' + OR + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M133.5 60.7 h11" stroke="' + INK + '" stroke-width="1.3" stroke-linecap="round" opacity=".6"/>' +
      HEARTS;
  }

  function riders(id) {
    var s = SPECIES[id] || SPECIES.cat;
    return s.penguin ? ridersPenguin() : ridersMammal(s);
  }

  /* ---------- standing buddy (moods) ---------- */
  function helmetStand(zee, tired) {
    var h = zee
      ? '<path d="M23 60 C16 8 122 8 115 60 C96 48 42 48 23 60 Z" fill="#4F78C4" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M69 22 C72 30 73 40 72.5 49" fill="none" stroke="#F3F6FF" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M38 34 C44 26 52 23 58 22" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".45"/>' +
        '<g transform="translate(101 36)"><circle r="4.4" cx="0" cy="-5" fill="#F7B8C6"/><circle r="4.4" cx="4.8" cy="-1.4" fill="#F7B8C6"/><circle r="4.4" cx="3" cy="4.2" fill="#F7B8C6"/><circle r="4.4" cx="-3" cy="4.2" fill="#F7B8C6"/><circle r="4.4" cx="-4.8" cy="-1.4" fill="#F7B8C6"/><circle r="2.8" fill="#FBE7B5"/></g>'
      : '<path d="M23 60 C16 8 122 8 115 60 C96 48 42 48 23 60 Z" fill="#5B565A" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M38 34 C44 26 52 23 58 22" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".4"/>' +
        '<path d="M90 30 c0 -4.4 6.4 -4.4 6.4 0 c0 -4.4 6.4 -4.4 6.4 0 c0 5.4 -6.4 8.8 -6.4 8.8 c0 0 -6.4 -3.4 -6.4 -8.8z" fill="#F4B6C2"/>';
    return tired ? '<g transform="rotate(-7 69 40)">' + h + '</g>' : h;
  }
  function moodBits(mood, s) {
    var r = { eyes: '', mouth: '', brows: '', extra: '', open: false };
    var lineCol = s.patch ? '#FFFDF8' : INK;
    if (mood === 'low') {
      r.eyes = '<path d="M45 63 Q53 68 61 63 M77 63 Q85 68 93 63" fill="none" stroke="' + lineCol + '" stroke-width="3.2" stroke-linecap="round"/>';
      r.mouth = 'wavy';
      r.extra = '<path d="M118 42 C118 42 112 50 112 54 a6 6 0 0 0 12 0 C124 50 118 42 118 42Z" fill="#CFE6F5" stroke="' + INK + '" stroke-width="2"/>' +
        '<text x="120" y="22" font-size="15" font-weight="700" fill="#9A88D2" font-family="ui-rounded,system-ui">z</text><text x="130" y="10" font-size="11" font-weight="700" fill="#C9B8E8" font-family="ui-rounded,system-ui">z</text>';
    } else if (mood === 'high' || mood === 'happy') {
      r.eyes = '<path d="M45 65 Q53 55 61 65 M77 65 Q85 55 93 65" fill="none" stroke="' + lineCol + '" stroke-width="3.4" stroke-linecap="round"/>';
      r.mouth = 'open';
      if (mood === 'high') r.extra = '<path d="M12 34 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#FBE7B5" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M124 24 l2.4 5.6 5.6 2.4 -5.6 2.4 -2.4 5.6 -2.4 -5.6 -5.6 -2.4 5.6 -2.4z" fill="#CDBDEB" stroke="' + INK + '" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M122 60 c0 -4 6 -4 6 0 c0 -4 6 -4 6 0 c0 5 -6 8 -6 8 c0 0 -6 -3 -6 -8z" fill="#F4B6C2" stroke="' + INK + '" stroke-width="1.5"/>';
    } else {
      r.open = true;
      r.eyes = (s.patch ? circ(53, 63, 7.6, '#FFFDF8') + circ(85, 63, 7.6, '#FFFDF8') : '') +
        '<ellipse cx="53" cy="63" rx="' + (s.patch ? 4.4 : 5.6) + '" ry="' + (s.patch ? 5.4 : 6.8) + '" fill="' + INK + '"/><ellipse cx="85" cy="63" rx="' + (s.patch ? 4.4 : 5.6) + '" ry="' + (s.patch ? 5.4 : 6.8) + '" fill="' + INK + '"/>' +
        '<circle cx="55" cy="60.4" r="2.2" fill="#fff"/><circle cx="87" cy="60.4" r="2.2" fill="#fff"/><circle cx="51.4" cy="66" r="1" fill="#fff"/><circle cx="83.4" cy="66" r="1" fill="#fff"/>';
      r.mouth = 'w';
      if (mood === 'mid') {
        r.brows = '<path d="M46 53 L58 55.5 M92 53 L80 55.5" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>';
        r.extra = '<g transform="translate(118 76)"><circle r="9" fill="#FFFDF8" stroke="' + INK + '" stroke-width="2.6"/><path d="M-3 -2 v4 M0 -3 v5 M3 -2 v4" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round"/></g>';
      }
    }
    return r;
  }
  function earsStand(s) {
    var E = s.E, I = s.I;
    switch (s.ear) {
      case 'round': return circ(28, 38, 13, E, 3) + circ(28, 38, 6.5, I) + circ(110, 38, 13, E, 3) + circ(110, 38, 6.5, I);
      case 'small': return circ(31, 36, 10, E, 3) + circ(31, 36, 5, I) + circ(107, 36, 10, E, 3) + circ(107, 36, 5, I);
      case 'big': return circ(23, 44, 19, E, 3) + circ(21, 46, 11, I) + circ(115, 44, 19, E, 3) + circ(117, 46, 11, I);
      case 'tri': return '<path d="M20 52 L24 10 L54 30 Z M118 52 L114 10 L84 30 Z" fill="' + E + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><path d="M27 42 L29 21 L45 32 Z M111 42 L109 21 L93 32 Z" fill="' + I + '"/>';
      case 'long': return ell(26, 24, 9, 22, E, 3, -38) + ell(26, 24, 4.4, 15, I, 0, -38) + ell(112, 24, 9, 22, E, 3, 38) + ell(112, 24, 4.4, 15, I, 0, 38);
    }
    return '';
  }
  function stand(mood, who, id) {
    var s = SPECIES[id] || SPECIES.cat;
    mood = mood || 'default';
    var zee = who !== 'alex', tired = mood === 'low', m = moodBits(mood, s);
    var bodyRy = tired ? 20 : 23, bodyCy = tired ? 104 : 101;
    var P = s.penguin, B = P ? '#465A7A' : s.B, L = P ? '#465A7A' : s.L, T = P ? '#FFFDF8' : s.T;
    var feet = P ? '#F5A65B' : L;
    var out = '<svg viewBox="0 0 140 132" xmlns="http://www.w3.org/2000/svg" role="img">' +
      '<ellipse cx="69" cy="127" rx="42" ry="5" fill="' + INK + '" opacity=".08"/>';
    if (!P) out += earsStand(s);
    out += ell(33, bodyCy - 2, 7.5, 15, L, 2.6, 24) + ell(105, bodyCy - 2, 7.5, 15, L, 2.6, -24) +
      ell(69, bodyCy, 33, bodyRy, B, 3) + ell(69, bodyCy + 3, 22, bodyRy - 4, T) +
      '<path d="M44 121 C45 114 62 113 64 120 C58 125 50 125 44 121 Z" fill="' + feet + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M74 120 C76 113 93 114 94 121 C88 125 80 125 74 120 Z" fill="' + feet + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      ell(69, 64, 45, 36, B, 3);
    if (P) out += '<path d="M34 70 C32 54 50 48 69 56 C88 48 106 54 104 70 C102 88 86 96 69 96 C52 96 36 88 34 70 Z" fill="#FFFDF8"/>';
    if (s.ear === 'flop') out += ell(28, 72, 10, 19, s.E, 3, 16) + ell(110, 72, 10, 19, s.E, 3, -16);
    if (s.patch) out += ell(52, 64, 11, 13, s.L, 0, -20) + ell(86, 64, 11, 13, s.L, 0, 20);
    out += helmetStand(zee, tired);
    var k = s.cheeks ? 1.3 : 1;
    out += ell(40, 76, 7.5 * k, 4.8 * k, '#F7A8B8') + ell(98, 76, 7.5 * k, 4.8 * k, '#F7A8B8');
    out += m.brows + m.eyes;
    // muzzle, nose, mouth
    if (P) {
      var OR = '#F5A65B';
      if (m.mouth === 'open') out += '<path d="M58 75 C61 70 77 70 80 75 Z" fill="' + OR + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/><path d="M61 79 L77 79 C75 86 63 86 61 79 Z" fill="' + OR + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/><path d="M61 76.4 L77 76.4 L77 79.2 L61 79.2 Z" fill="#E77E92"/>';
      else {
        out += '<path d="M58 77 C61 71 77 71 80 77 C77 84 61 84 58 77 Z" fill="' + OR + '" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/><path d="M62 74.6 q4 -1.6 8 -.8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>';
        out += m.mouth === 'wavy' ? '<path d="M62 89 Q65.5 86.5 69 89 Q72.5 91.5 76 89" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>' : '<path d="M61 77.2 h16" stroke="' + INK + '" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>';
      }
    } else {
      var koala = s.nose === 'koala', pink = s.nose === 'pink', dy = koala ? 4 : 0;
      out += ell(69, 80 + (koala ? 3 : 0), 17, koala ? 12 : 12.5, T);
      if (koala) out += ell(69, 75, 8.5, 10, INK) + ell(66.2, 70.5, 2.2, 3, '#fff');
      else if (pink) out += ell(69, 75.5, 4.6, 3.4, '#E58A9E', 2);
      else out += ell(69, 75, 6, 4.4, INK) + ell(67, 73.8, 1.8, 1.1, '#fff');
      if (s.whisk) out += '<path d="M48 76 l-14 -3 M48 81 l-14 2 M90 76 l14 -3 M90 81 l14 2" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round" opacity=".5"/>';
      if (m.mouth === 'open') out += '<path d="M62 ' + (82 + dy) + ' Q69 ' + (92 + dy) + ' 76 ' + (82 + dy) + ' Z" fill="#E77E92" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round"/>';
      else if (m.mouth === 'wavy') out += '<path d="M63 ' + (85 + dy) + ' Q66 ' + (83 + dy) + ' 69 ' + (85 + dy) + ' Q72 ' + (87 + dy) + ' 75 ' + (85 + dy) + '" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>';
      else out += '<path d="M65 ' + (82.5 + dy) + ' q2 2.4 4 0 q2 2.4 4 0" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>';
    }
    return out + m.extra + '</svg>';
  }

  window.__zeeBuddies = { SPECIES: SPECIES, ORDER: ORDER, today: today, riders: riders, stand: stand };
})();
