/* Visor del cliente · Guillermo Badenheuer Inmobiliaria
   Se usa en las páginas publicadas (c/<id>/) y en los links temporales. Sin dependencias. */
(function () {
  'use strict';
  var AG = { name: 'Guillermo Badenheuer Inmobiliaria', short: 'Guillermo Badenheuer', wa: '5492915122322', phone: '291 512-2322' };
  var DIRECT = /[?&]raw\b/.test(location.search);

  // ------------------------------------------------------------------ utilidades
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function plain(s) {
    return String(s == null ? '' : s).replace(/⟦[^⟧]*⟧/g, '').replace(/\(\s*(?:tel\.?|cel\.?|llam\w*|whats\w*|contact\w*|consult\w*)?[\s:.\-]*\)/gi, '').replace(/\s{2,}/g, ' ').trim();
  }
  function masked(s) {
    return esc(String(s == null ? '' : s).replace(/[⟦⟧]/g, function (c) { return c === '⟦' ? '\u0001' : '\u0002'; }))
      .replace(/\u0001([^\u0002]*)\u0002/g, '<s class="omitido" title="Dato de contacto omitido">$1</s>').replace(/[\u0001\u0002]/g, '');
  }
  function nf(n) { var p = String(Math.round(n * 100) / 100).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); return p.join(','); }
  function money(p) { return p.price == null ? '' : (p.cur === 'ARS' ? '$ ' : 'USD ') + nf(p.price) + (p.op === 'Alquiler' ? ' / mes' : ''); }
  function area(n) { return nf(Math.round(n * 10) / 10) + ' m²'; }
  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var ICON = {
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
    bath: '<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.7 3 4 3.7 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><path d="M10 5 8 7"/><path d="M2 12h20"/><path d="M7 19v2"/><path d="M17 19v2"/>',
    area: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    rooms: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
    car: '<path d="M19 17h2a1 1 0 0 0 1-1v-3a2 2 0 0 0-1.5-1.9L18 10l-2.4-3.4A2 2 0 0 0 14 6H8a2 2 0 0 0-1.7 1L5 10l-2.5 1.1A2 2 0 0 0 1 13v3a1 1 0 0 0 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    expand: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    photo: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>'
  };
  function ic(n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>'; }

  // Fotos: se piden ya achicadas (rápido en el celular) y, si algo falla, se usa la original.
  function opt(u, w, h) {
    if (DIRECT || !/^https?:/i.test(u) || /^https?:\/\/(?:images\.)?wsrv\.nl\//i.test(u)) return u;
    return 'https://wsrv.nl/?url=' + encodeURIComponent(u) + '&w=' + w + (h ? '&h=' + h + '&fit=cover&a=attention' : '') + '&output=jpg&q=80&we';
  }
  function imgTag(u, w, alt, eager, sizes) {
    var o = esc(u);
    var attrs = 'src="' + esc(opt(u, w)) + '"';
    if (!DIRECT && sizes) attrs += ' srcset="' + esc(opt(u, Math.round(w * 0.6))) + ' ' + Math.round(w * 0.6) + 'w, ' + esc(opt(u, w)) + ' ' + w + 'w, ' + esc(opt(u, Math.round(w * 1.6))) + ' ' + Math.round(w * 1.6) + 'w" sizes="' + sizes + '"';
    return '<img ' + attrs + ' data-o="' + o + '" alt="' + esc(alt) + '" referrerpolicy="no-referrer" decoding="async"' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' onload="BDV.ok(this)" onerror="BDV.err(this)">';
  }

  // ------------------------------------------------------------------ datos
  function unpack(o) {
    o = o || {};
    return {
      title: o.t || '', op: o.o ? 'Alquiler' : 'Venta', type: o.ty || '', cur: o.cu ? 'ARS' : 'USD', price: o.p == null ? null : o.p,
      exp: o.ex || '', age: o.an || '', at: o.at == null ? null : o.at, ac: o.ac == null ? null : o.ac, amb: o.am == null ? null : o.am,
      dorm: o.d == null ? null : o.d, ban: o.b == null ? null : o.b, coch: o.co == null ? null : o.co, zone: o.z || '',
      feats: Array.isArray(o.f) ? o.f : [], desc: o.de || '', pub: o.pu || '', photos: Array.isArray(o.ph) ? o.ph : [],
      src: o.so || '', note: o.no || '', showOrig: !!o.sh
    };
  }
  function normalize(d) {
    if (d && Array.isArray(d.ps)) return { id: d.id || '', h: d.h || '', g: d.g || '', wa: d.wa || AG.wa, ps: d.ps.map(unpack) };
    return { id: '', h: '', g: '', wa: AG.wa, ps: [unpack(d)] };
  }

  // ------------------------------------------------------------------ estado
  var S = { d: null, i: -1, favs: {}, root: null, opts: {}, multi: false, start: -1, lb: null };
  var BDV = window.BDV = {};
  BDV.ok = function (im) { var p = im.parentNode; if (p && p.classList) p.classList.remove('sk'); };
  BDV.err = function (im) {
    if (!im.getAttribute('data-t')) { im.setAttribute('data-t', '1'); im.removeAttribute('srcset'); im.src = im.getAttribute('data-o'); return; }
    var p = im.parentNode;
    if (p && p.classList.contains('slide')) { var i = qa('.slide', p.parentNode).indexOf(p); p.remove(); var t = qa('.thumb')[i]; if (t) t.remove(); galUpdate(); }
    else if (p && p.classList.contains('thumb')) p.remove();
    else if (p && p.classList.contains('ph')) { im.remove(); p.classList.remove('sk'); p.insertAdjacentHTML('afterbegin', '<img class="logo-ph" src="' + esc(S.opts.logo) + '" alt="" style="width:64px;height:64px;border-radius:50%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);object-fit:cover">'); }
  };

  function favKey() { return 'bdf:' + (S.d.id || 'tmp'); }
  function favLoad() { try { S.favs = JSON.parse(localStorage.getItem(favKey()) || '{}') || {}; } catch (e) { S.favs = {}; } }
  function favSave() { try { localStorage.setItem(favKey(), JSON.stringify(S.favs)); } catch (e) { /* nada */ } }
  function favCount() { return Object.keys(S.favs).length; }

  function pageUrl(i) {
    if (!S.opts.pageUrl) return '';
    return S.opts.pageUrl + (S.multi && i != null && i >= 0 ? '#' + (i + 1) : '');
  }
  function waLink(text) { return 'https://wa.me/' + (S.d.wa || AG.wa) + '?text=' + encodeURIComponent(text); }
  function msgOne(i) {
    var p = S.d.ps[i], u = pageUrl(i);
    return 'Hola! Me gustó la propiedad "' + (plain(p.title).slice(0, 90) || 'que me enviaron') + '" y quiero reservar una visita para poder verla.' + (u ? '\n' + u : '');
  }
  function msgMany(idx) {
    var lines = idx.map(function (i, k) { var p = S.d.ps[i]; var m = money(p); return (k + 1) + '. ' + plain(p.title).slice(0, 80) + (m ? ' (' + m + ')' : ''); });
    var u = pageUrl();
    return 'Hola! Estuve viendo las propiedades que me enviaron y me interesan estas:\n' + lines.join('\n') + '\nQuiero coordinar una visita.' + (u ? '\n' + u : '');
  }
  function msgGeneral() {
    var u = pageUrl();
    return 'Hola! Estuve viendo las propiedades que me enviaron y quisiera coordinar una visita.' + (u ? '\n' + u : '');
  }

  // ------------------------------------------------------------------ piezas
  function header() {
    return '<header class="bar" id="bar"><div class="in"><img class="logo" src="' + esc(S.opts.logo) + '" alt=""><div class="nm">' + esc(AG.short) + '<small>INMOBILIARIA</small></div>' +
      '<a class="pill" data-act="wa-general" href="' + esc(waLink(msgGeneral())) + '" target="_blank" rel="noopener">' + ic('chat') + '<span class="t">Escribinos por WhatsApp</span><span class="s">WhatsApp</span></a></div></header>';
  }
  function specsLine(p) {
    var s = [];
    var a = p.at != null ? p.at : p.ac;
    if (a != null) s.push('<span>' + ic('area') + area(a) + '</span>');
    if (p.dorm != null) s.push('<span>' + ic('bed') + p.dorm + ' dorm.</span>');
    if (p.ban != null) s.push('<span>' + ic('bath') + p.ban + (p.ban === 1 ? ' baño' : ' baños') + '</span>');
    if (p.amb != null && p.dorm == null) s.push('<span>' + ic('rooms') + p.amb + ' amb.</span>');
    if (p.coch) s.push('<span>' + ic('car') + p.coch + '</span>');
    return s.join('');
  }
  function card(p, i) {
    var cover = p.photos[0];
    var ph = cover ? imgTag(cover, 800, plain(p.title), i < 2, '(min-width:1060px) 380px, (min-width:700px) 50vw, 100vw') : '<img class="logo-ph" src="' + esc(S.opts.logo) + '" alt="" style="width:80px;height:80px;border-radius:50%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">';
    var m = money(p);
    return '<article class="pc" data-act="open" data-i="' + i + '" tabindex="0" role="link" aria-label="' + esc(plain(p.title)) + '">' +
      '<div class="ph' + (cover ? ' sk' : '') + '">' + ph + '<span class="badge">' + esc(p.op) + '</span>' +
      '<button class="fav' + (S.favs[i] ? ' on' : '') + '" data-act="fav" data-i="' + i + '" aria-label="Me interesa" title="Me interesa">' + ic('heart') + '</button>' +
      '<div class="price">' + esc(m || 'Consultar') + (p.exp ? '<small>Expensas ' + esc(p.exp) + '</small>' : '') + '</div>' +
      (p.photos.length > 1 ? '<span class="cnt">' + ic('photo') + p.photos.length + '</span>' : '') + '</div>' +
      '<div class="bd"><div class="kind">' + esc(p.type || 'Propiedad') + '</div><h3>' + esc(plain(p.title) || 'Propiedad') + '</h3>' +
      (p.zone ? '<div class="zn">' + ic('pin') + '<span>' + esc(plain(p.zone)) + '</span></div>' : '') +
      '<div class="specs">' + specsLine(p) + '</div>' +
      (p.pub ? '<div class="by">Publicada por <b>' + esc(p.pub) + '</b></div>' : '') + '</div></article>';
  }
  function listView() {
    var n = S.d.ps.length;
    var h = S.d.h || 'Propiedades para vos';
    var g = S.d.g || ('Seleccionamos ' + (n === 1 ? 'esta opción' : 'estas ' + n + ' opciones') + ' pensando en lo que estás buscando. Tocá cada una para ver todas las fotos y los detalles, y marcá con el corazón las que más te gusten.');
    return '<section class="hero"><div class="in"><span class="eyebrow">Selección personalizada</span><h1>' + esc(h) + '</h1><p>' + esc(g) + '</p>' +
      '<div class="meta"><span>' + ic('home') + n + (n === 1 ? ' propiedad' : ' propiedades') + '</span><span>' + ic('users') + 'Visitas coordinadas con nosotros</span><span>' + ic('shield') + 'Sin doble honorario</span></div></div></section>' +
      '<div class="wrap"><div class="cards">' + S.d.ps.map(card).join('') + '</div></div>';
  }
  function facts(p) {
    var f = [];
    if (p.at != null) f.push(['area', area(p.at), 'Sup. total']);
    if (p.ac != null) f.push(['home', area(p.ac), 'Sup. cubierta']);
    if (p.amb != null) f.push(['rooms', p.amb, 'Ambientes']);
    if (p.dorm != null) f.push(['bed', p.dorm, 'Dormitorios']);
    if (p.ban != null) f.push(['bath', p.ban, p.ban === 1 ? 'Baño' : 'Baños']);
    if (p.coch != null) f.push(['car', p.coch, p.coch === 1 ? 'Cochera' : 'Cocheras']);
    if (p.age) f.push(['cal', String(p.age).slice(0, 24), 'Antigüedad']);
    return f.length ? '<div class="facts">' + f.map(function (x) { return '<div class="fact">' + ic(x[0]) + '<span class="v">' + esc(x[1]) + '</span><span class="k">' + esc(x[2]) + '</span></div>'; }).join('') + '</div>' : '';
  }
  function gallery(p) {
    var ph = p.photos;
    var tags = '<div class="gtag"><span class="b">' + esc(p.op) + '</span>' + (p.type ? '<span class="b" style="background:rgba(10,16,48,.72);color:#fff">' + esc(p.type) + '</span>' : '') + '</div>';
    if (!ph.length) return '<div class="gal">' + tags + '<div class="nophoto"><img src="' + esc(S.opts.logo) + '" alt=""></div></div>';
    var slides = ph.map(function (u, k) { return '<div class="slide sk" data-act="zoom" data-k="' + k + '">' + imgTag(u, 1400, plain(p.title) + ' - foto ' + (k + 1), k === 0, '(min-width:960px) 780px, 100vw') + '</div>'; }).join('');
    var thumbs = ph.length > 1 ? '<div class="thumbs" id="thumbs">' + ph.map(function (u, k) { return '<button class="thumb' + (k === 0 ? ' on' : '') + '" data-act="thumb" data-k="' + k + '" aria-label="Foto ' + (k + 1) + '"><img src="' + esc(opt(u, 200, 150)) + '" data-o="' + esc(u) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="BDV.err(this)"></button>'; }).join('') + '</div>' : '';
    return '<div class="gal" id="gal">' + tags + '<div class="track" id="track" tabindex="0" aria-label="Fotos">' + slides + '</div>' +
      (ph.length > 1 ? '<button class="gbtn prev" data-act="gprev" aria-label="Anterior">' + ic('left') + '</button><button class="gbtn next" data-act="gnext" aria-label="Siguiente">' + ic('right') + '</button>' : '') +
      '<div class="gbar"><span class="n"><span id="gcur">1</span> / <span id="gtot">' + ph.length + '</span></span><button data-act="zoom" data-k="0" aria-label="Pantalla completa">' + ic('expand') + '</button></div>' + thumbs + '</div>';
  }
  function detailView(i) {
    var p = S.d.ps[i], multi = S.multi;
    var cleanTitle = plain(p.title) || 'Propiedad';
    var m = money(p);
    var a = p.at != null ? p.at : p.ac;
    var perM2 = (p.op === 'Venta' && p.price && a) ? Math.round(p.price / a) : 0;
    var chips = multi ? '<div class="chips" id="chips">' + S.d.ps.map(function (x, k) { return '<button class="chip' + (k === i ? ' on' : '') + '" data-act="open" data-i="' + k + '" aria-label="Propiedad ' + (k + 1) + '">' + (k + 1) + '</button>'; }).join('') + '</div>' : '';
    var nav = '<div class="topnav">' + (multi ? '<button class="back" data-act="list">' + ic('left') + 'Todas</button>' : '') + chips + '</div>';
    var desc = (p.desc || '').trim(), long = desc.length > 620;
    var main = gallery(p) +
      '<div class="head"><div class="tags"><span class="tag">' + esc(p.op) + '</span>' + (p.type ? '<span class="tag alt">' + esc(p.type) + '</span>' : '') + '</div><h1 class="t1">' + masked(cleanTitle) + '</h1>' +
      (p.zone ? '<div class="zone">' + ic('pin') + '<span>' + masked(p.zone) + '<a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(plain(p.zone)) + '" target="_blank" rel="noopener">Ver en el mapa ' + ic('ext') + '</a></span></div>' : '') + '</div>' +
      facts(p) +
      (p.note && p.note.trim() ? '<section class="card note"><h2>Nuestra opinión</h2><p>' + masked(p.note.trim()).replace(/\n/g, '<br>') + '</p></section>' : '') +
      (desc ? '<section class="card"><h2>Descripción</h2><div class="desc' + (long ? ' clamp' : '') + '" id="desc">' + masked(desc).replace(/\n/g, '<br>') + '</div>' + (long ? '<button class="more" id="more" data-act="more">Ver descripción completa ' + ic('down') + '</button>' : '') + '</section>' : '') +
      (p.feats.length ? '<section class="card"><h2>Características</h2><ul class="feat">' + p.feats.filter(Boolean).slice(0, 30).map(function (x) { return '<li>' + masked(x) + '</li>'; }).join('') + '</ul></section>' : '') +
      '<section class="card pubc"><h2>¿Cómo seguimos?</h2>' + (p.pub ? '<div class="by">Publicada originalmente por</div><div class="who">' + esc(p.pub) + '</div>' : '') +
      '<p>Trabajamos en conjunto con inmobiliarias colegas, y esto <b>no implica un doble pago de honorarios</b>. Coordinamos las visitas y la operación entre ambas partes, para que todo sea más ágil y profesional.</p>' +
      '<p><b>Para consultas, reservas y visitas, escribinos a ' + esc(AG.name) + '</b>: así toda la comunicación queda en un solo lugar.</p>' +
      (p.showOrig && p.src ? '<a class="orig" href="' + esc(p.src) + '" target="_blank" rel="noopener noreferrer nofollow">Ver el aviso original ' + ic('ext') + '</a>' : '') + '</section>';
    if (multi) {
      var prev = i > 0 ? S.d.ps[i - 1] : null, next = i < S.d.ps.length - 1 ? S.d.ps[i + 1] : null;
      main += '<div class="nextp"><button data-act="open" data-i="' + (i - 1) + '"' + (prev ? '' : ' disabled') + '><small>← Anterior</small><b>' + esc(prev ? plain(prev.title) : '—') + '</b></button>' +
        '<button data-act="open" data-i="' + (i + 1) + '"' + (next ? '' : ' disabled') + '><small>Siguiente →</small><b>' + esc(next ? plain(next.title) : '—') + '</b></button></div>';
    }
    var side = '<aside class="side"><div class="sc"><div class="pr"><div class="k">' + (p.op === 'Alquiler' ? 'Alquiler mensual' : 'Precio') + '</div><div class="v">' + esc(m || 'Consultar') + '</div>' +
      '<div class="s">' + (p.exp ? 'Expensas: ' + esc(p.exp) : '') + (p.exp && perM2 ? ' · ' : '') + (perM2 ? '≈ ' + (p.cur === 'ARS' ? '$ ' : 'USD ') + nf(perM2) + ' / m²' : '') + '</div></div>' +
      '<div class="bd"><a class="wa" data-act="wa-one" href="' + esc(waLink(msgOne(i))) + '" target="_blank" rel="noopener">' + ic('chat') + 'Reservar una visita</a>' +
      '<button class="ghost' + (S.favs[i] ? ' on' : '') + '" data-act="fav" data-i="' + i + '">' + ic('heart') + '<span>' + (S.favs[i] ? 'Guardada' : 'Me interesa') + '</span></button>' +
      '<button class="ghost" data-act="share">' + ic('share') + 'Compartir</button>' +
      '<div class="ag"><img src="' + esc(S.opts.logo) + '" alt=""><div><b>' + esc(AG.name) + '</b><span>Respondemos por WhatsApp · ' + esc(AG.phone) + '</span></div></div></div></div></aside>';
    var cta = '<div class="cta detail"><div class="in"><div class="p">' + esc(m || 'Consultar') + '<small>' + esc(p.op) + '</small></div><a class="wa" data-act="wa-one" href="' + esc(waLink(msgOne(i))) + '" target="_blank" rel="noopener">' + ic('chat') + '<span>Reservar visita</span></a>' +
      '<button class="fbtn' + (S.favs[i] ? ' on' : '') + '" data-act="fav" data-i="' + i + '" aria-label="Me interesa">' + ic('heart') + '</button></div></div>';
    return '<div class="wrap view">' + nav + '<div class="grid2"><div>' + main + '</div>' + side + '</div></div>' + cta;
  }
  function listCta() {
    var idx = Object.keys(S.favs).map(Number).sort(function (a, b) { return a - b; });
    var n = idx.length;
    var href = n ? waLink(msgMany(idx)) : waLink(msgGeneral());
    return '<div class="cta multi" id="lcta"><div class="in">' + (n ? '<span class="cn">' + n + (n === 1 ? ' favorita' : ' favoritas') + '</span>' : '') +
      '<a class="wa" data-act="wa-many" href="' + esc(href) + '" target="_blank" rel="noopener">' + ic('chat') + '<span>' + (n ? 'Consultar por ' + (n === 1 ? 'la que me gustó' : 'las ' + n + ' que me gustaron') : 'Consultar por WhatsApp') + '</span></a></div></div>';
  }
  function footer() {
    return '<div class="foot">Información tomada de las publicaciones originales. Precios, medidas y disponibilidad sujetos a confirmación.<br>' + esc(AG.name) + ' · <a href="tel:+' + esc(S.d.wa || AG.wa) + '">' + esc(AG.phone) + '</a></div>';
  }

  // ------------------------------------------------------------------ render
  function render() {
    var v = S.i < 0 ? listView() : detailView(S.i);
    S.root.innerHTML = header() + '<main>' + v + '</main>' + footer() + (S.i < 0 ? listCta() : '') + '<div class="toast" id="toast"></div>';
    var t = document.title;
    if (S.i >= 0 && S.multi) document.title = plain(S.d.ps[S.i].title) + ' · ' + AG.short; else if (S.i >= 0) document.title = plain(S.d.ps[S.i].title) + ' · ' + AG.short; else document.title = (S.d.h || 'Propiedades para vos') + ' · ' + AG.short;
    if (S.i >= 0) galBind();
  }
  function toast(msg) { var t = q('#toast'); if (!t) return; t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 2200); }

  function go(i, push) {
    if (i >= S.d.ps.length) return;
    S.i = i;
    if (push !== false) {
      var url;
      if (S.opts.hosted) url = i < 0 ? location.pathname + location.search : '#' + (i + 1);
      try { history.pushState({ i: i }, '', url); } catch (e) { /* nada */ }
    }
    render();
    window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------------ galería
  function galIdx() { var tr = q('#track'); return tr ? Math.round(tr.scrollLeft / Math.max(1, tr.clientWidth)) : 0; }
  function galUpdate() {
    var tr = q('#track'); if (!tr) return;
    var n = qa('.slide', tr).length, i = Math.min(n - 1, Math.max(0, galIdx()));
    var c = q('#gcur'), t = q('#gtot'); if (c) c.textContent = n ? i + 1 : 0; if (t) t.textContent = n;
    qa('.thumb').forEach(function (th, k) { th.classList.toggle('on', k === i); });
    var on = q('.thumb.on'), box = q('#thumbs'); if (on && box) box.scrollTo({ left: on.offsetLeft - box.clientWidth / 2 + on.clientWidth / 2, behavior: 'smooth' });
    var pv = q('.gbtn.prev'), nx = q('.gbtn.next'); if (pv) pv.disabled = i <= 0; if (nx) nx.disabled = i >= n - 1;
  }
  function galTo(k) { var tr = q('#track'); if (!tr) return; var n = qa('.slide', tr).length; k = Math.max(0, Math.min(n - 1, k)); tr.scrollTo({ left: k * tr.clientWidth, behavior: 'smooth' }); }
  var galTimer;
  function galBind() {
    var tr = q('#track'); if (!tr) return;
    tr.addEventListener('scroll', function () { clearTimeout(galTimer); galTimer = setTimeout(galUpdate, 40); }, { passive: true });
    galUpdate();
  }

  // ------------------------------------------------------------------ pantalla completa
  function lbOpen(k) {
    var p = S.d.ps[S.i]; if (!p || !p.photos.length) return;
    var el = document.createElement('div'); el.className = 'lb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="top"><span><span id="lcur">' + (k + 1) + '</span> / ' + p.photos.length + '</span><button data-lb="close" aria-label="Cerrar">' + ic('x') + '</button></div><div class="lt" id="lt">' +
      p.photos.map(function (u, j) { return '<div class="ls" data-lb="zoom">' + imgTag(u, 2000, plain(p.title) + ' - foto ' + (j + 1), j === k) + '</div>'; }).join('') + '</div>' +
      (p.photos.length > 1 ? '<button class="lbtn prev" data-lb="prev" aria-label="Anterior">' + ic('left') + '</button><button class="lbtn next" data-lb="next" aria-label="Siguiente">' + ic('right') + '</button>' : '');
    document.body.appendChild(el); document.body.style.overflow = 'hidden'; S.lb = el;
    var lt = q('#lt', el); lt.scrollLeft = k * lt.clientWidth;
    lt.addEventListener('scroll', function () { var c = q('#lcur', el); if (c) c.textContent = Math.round(lt.scrollLeft / Math.max(1, lt.clientWidth)) + 1; }, { passive: true });
    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-lb]'); if (!t) return; var a = t.getAttribute('data-lb');
      if (a === 'close') lbClose(); else if (a === 'prev') lt.scrollBy({ left: -lt.clientWidth, behavior: 'smooth' }); else if (a === 'next') lt.scrollBy({ left: lt.clientWidth, behavior: 'smooth' });
      else if (a === 'zoom' && e.target.tagName === 'IMG') t.classList.toggle('z');
    });
  }
  function lbClose() {
    if (!S.lb) return;
    var lt = q('#lt', S.lb), k = lt ? Math.round(lt.scrollLeft / Math.max(1, lt.clientWidth)) : 0;
    S.lb.remove(); S.lb = null; document.body.style.overflow = '';
    var tr = q('#track'); if (tr) tr.scrollTo({ left: k * tr.clientWidth });
  }

  // ------------------------------------------------------------------ eventos
  function favToggle(i) {
    if (S.favs[i]) delete S.favs[i]; else S.favs[i] = 1;
    favSave();
    qa('[data-act=fav][data-i="' + i + '"]').forEach(function (b) {
      var on = !!S.favs[i]; b.classList.toggle('on', on);
      var s = q('span', b); if (s && b.classList.contains('ghost')) s.textContent = on ? 'Guardada' : 'Me interesa';
    });
    var lc = q('#lcta'); if (lc) lc.outerHTML = listCta();
    if (S.favs[i]) toast('Guardada en tus favoritas');
  }
  function onClick(e) {
    var t = e.target.closest('[data-act]'); if (!t || !S.root.contains(t)) return;
    var a = t.getAttribute('data-act'), i = +t.getAttribute('data-i');
    if (a === 'fav') { e.preventDefault(); e.stopPropagation(); favToggle(i); return; }
    if (a === 'open') { if (t.hasAttribute('disabled') || isNaN(i) || i < 0) return; go(i); return; }
    if (a === 'list') { go(-1); return; }
    if (a === 'thumb') { galTo(+t.getAttribute('data-k')); return; }
    if (a === 'gprev') { galTo(galIdx() - 1); return; }
    if (a === 'gnext') { galTo(galIdx() + 1); return; }
    if (a === 'zoom') { lbOpen(+t.getAttribute('data-k') || galIdx()); return; }
    if (a === 'more') { var d = q('#desc'); var c = d.classList.toggle('clamp'); t.classList.toggle('open', !c); t.firstChild.nodeValue = c ? 'Ver descripción completa ' : 'Ver menos '; return; }
    if (a === 'share') {
      var url = S.opts.pageUrl ? pageUrl(S.i) : location.href.split('#')[0], title = plain(S.d.ps[S.i].title);
      if (navigator.share) navigator.share({ title: title, text: title + ' — ' + AG.short, url: url }).catch(function () { /* cancelado */ });
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('Link copiado'); }, function () { toast('No se pudo copiar'); });
      return;
    }
  }
  function onKey(e) {
    if (S.lb) {
      var lt = q('#lt', S.lb);
      if (e.key === 'Escape') lbClose(); else if (e.key === 'ArrowRight') lt.scrollBy({ left: lt.clientWidth, behavior: 'smooth' }); else if (e.key === 'ArrowLeft') lt.scrollBy({ left: -lt.clientWidth, behavior: 'smooth' });
      return;
    }
    if (e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('pc')) { go(+document.activeElement.getAttribute('data-i')); return; }
    if (S.i >= 0 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !/INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '')) galTo(galIdx() + (e.key === 'ArrowRight' ? 1 : -1));
  }

  // ------------------------------------------------------------------ arranque
  function mount(root, raw, opts) {
    S.root = root; S.opts = opts || {}; S.opts.logo = S.opts.logo || 'logo.png';
    S.d = normalize(raw); S.multi = S.d.ps.length > 1;
    favLoad();
    var start = S.multi ? -1 : 0;
    if (S.multi && S.opts.hosted) { var m = /^#(\d+)$/.exec(location.hash); if (m && +m[1] >= 1 && +m[1] <= S.d.ps.length) start = +m[1] - 1; }
    S.i = start; S.start = S.multi ? -1 : 0;
    try { history.replaceState({ i: start }, '', undefined); } catch (e) { /* nada */ }
    render();
    root.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('popstate', function (e) {
      if (S.lb) lbClose();
      var i = e.state && typeof e.state.i === 'number' ? e.state.i : S.start;
      if (S.opts.hosted && !e.state) { var m2 = /^#(\d+)$/.exec(location.hash); i = m2 ? +m2[1] - 1 : S.start; }
      if (i >= S.d.ps.length) i = S.start;
      go(i, false);
    });
    window.addEventListener('scroll', function () { var b = q('#bar'); if (b) b.classList.toggle('raised', window.scrollY > 6); }, { passive: true });
  }
  function bad(root, logo) {
    root.innerHTML = '<div class="bad"><div><img src="' + esc(logo) + '" alt=""><h1>Este link no está disponible</h1><p>Puede haberse cortado al copiarlo. Pedile a tu asesor que te lo envíe de nuevo.</p><a href="https://wa.me/' + AG.wa + '">Escribinos por WhatsApp</a></div></div>';
  }
  // Página publicada: los datos vienen en <script id="ficha-data"> y el logo está junto a este archivo
  function boot() {
    var root = document.getElementById('app'); if (!root) return;
    var cs = document.currentScript, base = cs && cs.src ? cs.src.replace(/[^\/]*$/, '') : 'assets/';
    var logo = base + 'logo.png';
    try {
      var data = JSON.parse(document.getElementById('ficha-data').textContent);
      mount(root, data, { hosted: true, pageUrl: location.href.split('#')[0].split('?')[0], logo: logo });
    } catch (e) { bad(root, logo); }
  }
  window.BDViewer = { mount: mount, bad: bad, boot: boot, AG: AG };
  if (document.currentScript && /viewer\.js/.test(document.currentScript.src || '')) boot();
})();
