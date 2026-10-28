/* Utilidades compartidas de las pestañas de la plataforma (se antepone a cada tab; idempotente). */
(function () {
  if (window.NWS) return;
  var SX = { F: 'Femenino', M: 'Masculino', X: 'Mixto' };
  var N = {};
  N.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  N.norm = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  N.num = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  N.hash = function (s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  /* Símbolos ♂/♀; Mixto superpone ambos. Color heredado del texto (currentColor). */
  N.sexIco = function (sx) {
    var p = { M: '<circle cx="8" cy="12" r="4.5"/><path d="M11.5 8.5L17 3m-4.5 0H17v4.5"/>', F: '<circle cx="10" cy="7.5" r="4.5"/><path d="M10 12v6m-3-3h6"/>', X: '<circle cx="8" cy="12" r="4"/><path d="M11 9l5.5-5.5m-4 0h4v4M8 16v3m-2-1.5h4"/>' };
    return '<svg class="nwtab-sx__g" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p[sx] + '</svg>';
  };
  N.sexTag = function (sx) { return '<span class="nwtab-sx nwtab-sx--' + sx + '">' + N.sexIco(sx) + SX[sx] + '</span>'; };
  N.badge = function (est) {
    var k = est === 'Finalizado' ? 'done' : est === 'En vivo' ? 'live' : 'prog';
    return '<span class="nwtab-st nwtab-st--' + k + '">' + N.esc(est) + '</span>';
  };
  N.cc = function (iso, nombre) {
    if (!iso) return '';
    var b = OLC.bandera(iso, 20);
    return '<span class="nwtab-cc" title="' + N.esc(nombre || OLC.paisNombre(iso)) + '">' +
      (b ? '<img class="nwtab-cc__f" src="' + N.esc(b.src) + '" srcset="' + N.esc(b.srcset) + '" width="20" height="15" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : '') +
      '<span>' + N.esc(String(iso).toUpperCase()) + '</span></span>';
  };
  /* Bandera sola para filas de resultado; sin imagen (país null o error de carga) queda el ISO en texto pequeño. */
  N.flag = function (iso, nombre) {
    if (!iso) return '';
    var b = OLC.bandera(iso, 20), c = N.esc(String(iso).toUpperCase());
    return '<span class="nwtab-fl' + (b ? '' : ' is-x') + '" title="' + N.esc(nombre || OLC.paisNombre(iso)) + '">' +
      (b ? '<img src="' + N.esc(b.src) + '" srcset="' + N.esc(b.srcset) + '" width="20" height="15" alt="" loading="lazy" decoding="async" onerror="this.parentNode.className+=\' is-x\';this.remove()">' : '') +
      '<span class="nwtab-fl__c">' + c + '</span></span>';
  };
  N.ico = function (name) {
    var p = {
      chev: '<path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      arrow: '<path d="M4 10h11m-4-4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      search: '<circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      left: '<path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      right: '<path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      podium: '<path d="M2.5 17.5h15M7 17.5V9h6v8.5M2.5 17.5v-5H7M13 17.5v-3h4.5v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 2.5l1.1 2.2 2.4.3-1.7 1.7.4 2.3L10 8l-2.2 1 .4-2.3-1.7-1.7 2.4-.3z" fill="currentColor"/>',
      medal: '<circle cx="10" cy="12" r="5" fill="currentColor"/><path d="M6.5 2.5L9 7m4.5-4.5L11 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      /* deportes */
      ball: '<circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M2.8 8.5c4 1.5 10.4 1.5 14.4 0M10 2.5c-2.5 3.3-2.5 11.7 0 15M10 2.5c2.5 3.3 2.5 11.7 0 15" fill="none" stroke="currentColor" stroke-width="1.4"/>',
      waves: '<path d="M2 7c2-2 4 2 6 0s4 2 6 0 3 0 4 0M2 12c2-2 4 2 6 0s4 2 6 0 3 0 4 0M2 17c2-2 4 2 6 0s4 2 6 0 3 0 4 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      run: '<circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M10 8l-3 3 3 2-1 5M10 8l4 1 2 3M7 11l-3 1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
      bike: '<circle cx="5" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="15" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5 13l3-6h5l2 6M8 7L10 13h5M12 5h2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
      bell: '<path d="M2 8v4m3-6v8m10-8v8m3-6v4M5 10h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      fight: '<circle cx="7" cy="5" r="2" fill="currentColor"/><circle cx="14" cy="6" r="2" fill="currentColor"/><path d="M4 17l1-6 3-2 3 2 1 6M12 17l1-5 3-1 1 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
      star: '<path d="M10 2.5l2.3 4.8 5.2.7-3.8 3.6.9 5.2L10 14.3l-4.6 2.5.9-5.2L2.5 8l5.2-.7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      gym: '<circle cx="6" cy="5" r="2.6" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="14" cy="5" r="2.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 7.6V11m8-3.4V11M10 11v6.5M6 11h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      glove: '<path d="M6 9V5.5a2.5 2.5 0 015 0V9h3.5a1.5 1.5 0 011.5 1.5v2A5 5 0 0111.5 17.5H9A4 4 0 015 13.5V9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M6 14h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      paddle: '<circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M11.5 11.5L17 17" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'
    };
    return '<svg class="nwtab-i" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">' + (p[name] || p.star) + '</svg>';
  };
  var DEP_ICO = { atletismo: 'run', natacion: 'waves', judo: 'fight', boxeo: 'glove', lucha: 'fight', ciclismo: 'bike', gimnasia: 'gym', pesas: 'bell', taekwondo: 'fight', 'tenis-mesa': 'paddle', voleibol: 'ball', baloncesto: 'ball', balonmano: 'ball', 'futbol-sala': 'ball' };
  N.depIco = function (code) { return OLC.iconoDeporte(code, 'nwtab-i', 20); };
  N.ord = function (n) { return n + '.º'; };
  N.medalName = function (pos) { return pos === 1 ? 'Oro' : pos === 2 ? 'Plata' : pos === 3 ? 'Bronce' : ''; };
  N.medalDot = function (k) { return '<i class="nwtab-md nwtab-md--' + k + '" aria-hidden="true"></i>'; };
  /* Cambia un parámetro global y devuelve el foco al control que lo disparó (el shell re-renderiza todo). */
  N.go = function (ctx, patch, key) {
    ctx.go(patch);
    N.refocus(key);
  };
  N.refocus = function (key, caret) {
    if (!key) return;
    var f = function () {
      var t = document.querySelector('[data-k="' + key + '"]');
      if (!t) return false;
      if (document.activeElement !== t) { t.focus({ preventScroll: true }); if (caret != null && t.setSelectionRange) { try { t.setSelectionRange(caret, caret); } catch (e) { } } }
      return true;
    };
    if (!f()) requestAnimationFrame(f);
  };
  /* Filtro de sexo (segmentado). */
  N.sexBar = function (params, extra) {
    var cur = params.sexo || '';
    var opts = [['', 'Todos', ''], ['F', 'Femenino', 'F'], ['M', 'Masculino', 'M'], ['X', 'Mixto', 'X']];
    return '<div class="nwtab-sxbar__seg" role="group" aria-label="Filtrar por género"><span class="nwtab-lbl" aria-hidden="true">Género</span><div class="nwtab-seg">' +
      opts.map(function (o) {
        return '<button type="button" class="nwtab-seg__b" data-k="sx-' + (o[0] || 'T') + '" data-sx="' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + (o[2] ? N.sexIco(o[2]) : '') + o[1] + '</button>';
      }).join('') + '</div></div>' + (extra || '');
  };
  /* Colombia es filtro solo si participa en alguna prueba del evento (data.colombia.participa = n.º de pruebas). */
  N.hayColombia = function (data) { return !!(data.colombia && data.colombia.participa > 0); };
  N.colOn = function (params, data) { return N.hayColombia(data) && String(params.colombia) !== '0'; };
  N.colSwitch = function (params, data) {
    return ''; /* sin interruptor: solo se registran pruebas con Colombia */
    var on = N.colOn(params, data); /* ausente = encendido; 0 = apagado */
    return '<button type="button" class="nwtab-sw" role="switch" aria-checked="' + on + '" data-k="col" data-col="' + (on ? '0' : '') + '"><span class="nwtab-sw__t" aria-hidden="true"><i></i></span><span class="nwtab-sw__l"><span>Solo pruebas</span> <span>con Colombianos</span></span></button>';
  };
  N.bindBar = function (el, ctx) {
    el.querySelectorAll('[data-sx]').forEach(function (b) {
      b.addEventListener('click', function () { N.go(ctx, { sexo: b.getAttribute('data-sx') }, b.getAttribute('data-k')); });
    });
    var c = el.querySelector('[data-col]');
    if (c) c.addEventListener('click', function () { N.go(ctx, { colombia: c.getAttribute('data-col') }, 'col'); });
  };
  /* Enlaces internos: el clic navega por ctx.go sin recargar. */
  N.bindLinks = function (el, ctx) {
    el.querySelectorAll('a[data-patch]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        var patch = JSON.parse(a.getAttribute('data-patch'));
        N.go(ctx, patch, a.getAttribute('data-k'));
      });
    });
  };
  N.sexOk = function (p, params) { return !params.sexo || p.sexo === params.sexo; };
  /* Estado respecto al tiempo: SIEMPRE derivado de las fechas contra OLC.HOY. */
  N.dif = function (a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000); };
  N.tiempoDia = function (iso) { return iso < OLC.HOY ? 'Pasada' : iso === OLC.HOY ? 'Hoy' : 'Próxima'; };
  N.estadoPrueba = function (p) {
    if (p.estado === 'En vivo') return 'En vivo';
    if (p.fecha < OLC.HOY) return 'Finalizado';
    if (p.fecha > OLC.HOY) return 'Programado';
    return p.estado;
  };
  N.faltan = function (iso) { var n = N.dif(OLC.HOY, iso); return n === 1 ? 'Falta 1 día' : 'Faltan ' + n + ' días'; };
  N.tiempoBadge = function (t) { return '<span class="nwtab-tm nwtab-tm--' + (t === 'Pasada' ? 'pas' : t === 'Hoy' ? 'hoy' : 'fut') + '">' + t + '</span>'; };
  N.corta = function (iso) { var s = OLC.fechaCorta(iso); return s.replace(/ \d{4}$/, ''); };
  window.NWS = N;
})();
/* Pestaña Deportes (plataforma): maestro-detalle; la tabla agrupa las fases por prueba (nombre + género) y pagina. */
(function () {
  var N = window.NWS, esc = N.esc;
  window.Tabs = window.Tabs || {};
  var ORD = { F: 0, M: 1, X: 2 };
  var UMBRAL_BUSCADOR = 8; /* DC-027: el buscador de pruebas solo aplica con MÁS de 8 pruebas en el deporte */
  var ICO_CAL = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4m8-4v4"/></svg>';

  function inscritos(g) { return 6 + (N.hash(g.clave) % 43); }
  function resaltar(txt, q) {
    if (!q) return esc(txt);
    var i = N.norm(txt).indexOf(N.norm(q));
    if (i < 0) return esc(txt);
    return esc(txt.slice(0, i)) + '<mark class="nwtab-mark">' + esc(txt.slice(i, i + q.length)) + '</mark>' + esc(txt.slice(i + q.length));
  }
  /* Una prueba = nombre + género; sus fases (rondas) se cuentan, no se listan. Se calcula una vez por evento. */
  function indexar(data) {
    var mapa = {}, lista = [];
    data.pruebas.forEach(function (p) {
      var k = p.deporte + '|' + p.nombre + '|' + p.sexo, g = mapa[k];
      if (!g) { g = mapa[k] = { clave: k, deporte: p.deporte, deporteNombre: p.deporteNombre, nombre: p.nombre, sexo: p.sexo, fases: 0, vivo: false, pend: null, ult: '' }; lista.push(g); }
      g.fases++;
      var st = N.estadoPrueba(p);
      if (st === 'En vivo') g.vivo = true;
      if (st !== 'Finalizado' && (!g.pend || p.fecha < g.pend)) g.pend = p.fecha;
      if (p.fecha > g.ult) g.ult = p.fecha;
    });
    var porDep = {}, fases = {};
    lista.forEach(function (g) { (porDep[g.deporte] = porDep[g.deporte] || []).push(g); fases[g.deporte] = (fases[g.deporte] || 0) + g.fases; });
    return { lista: lista, porDep: porDep, fases: fases };
  }
  function estadoG(g) { return g.vivo ? 'En vivo' : g.pend ? 'Programado' : 'Finalizado'; }
  /* DC-046: programada = texto + ícono de calendario, como en Calendario */
  var ICO_PROG = '<svg class="nwtab-st__ic" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false"><rect x="3" y="4.5" width="14" height="12.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 8.5h14M7 2.5v3.5M13 2.5v3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  function estBadge(g) { var e = estadoG(g); return e === 'Programado' ? '<span class="nwtab-st nwtab-st--prog">' + e + ICO_PROG + '</span>' : N.badge(e); }
  function celdaDia(g) {
    if (!g.pend) return '<span class="is-dim">Finalizó el ' + esc(N.corta(g.ult)) + '</span>';
    if (g.pend === OLC.HOY) return '<b class="nwtab-hoyt">Hoy</b>';
    return esc(OLC.diaCorto(g.pend));
  }
  function ordenar(a, b) { return a.nombre.localeCompare(b.nombre, 'es', { numeric: true }) || ORD[a.sexo] - ORD[b.sexo]; }
  function nPruebas(n) { return n + (n === 1 ? ' prueba' : ' pruebas'); }
  function nFases(n) { return n + (n === 1 ? ' fase' : ' fases'); }
  /* Mismo corte que @container nws (max-width:720px): ancho útil de .nws-main, que cambia con el sidebar. */
  function esCompacto(el) {
    var m = el.closest('.nws-main') || el, cs = getComputedStyle(m), w = m.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    return w > 0 && w <= 720;
  }
  var ICO_X = '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function render(el, ctx) {
    var data = ctx.data, pr = ctx.params, ui = ctx.ui.dp = ctx.ui.dp || { q: '', page: 1, size: 10, idx: {} };
    var ix = ui.idx[data.evento.code] || (ui.idx[data.evento.code] = indexar(data));
    var bq = N.norm(ui.q.trim());
    var sexOk = function (g) { return N.sexOk(g, pr); };
    var lista = data.deportes.filter(function (d) { return !bq || N.norm(d.nombre).indexOf(bq) >= 0; });
    var sel = data.deportes.filter(function (d) { return d.codigo === pr.deporte; })[0] || data.deportes[0];
    /* DC-059: en compacto la lista nunca marca deporte (sin aria-current); el modal lleva el contexto. */
    /* Contenedor ≤720px: lista de deportes + modal con las pruebas; el estado vive en la URL (modal=1). */
    var compact = esCompacto(el), abierto = compact && pr.modal === '1', fresh = ui.fresh; ui.fresh = false;
    var anillo = lista.some(function (d) { return d.codigo === sel.codigo; }) ? lista : data.deportes;
    var ai = anillo.map(function (d) { return d.codigo; }).indexOf(sel.codigo);
    var vecino = function (k) { return anillo[(ai + k + anillo.length) % anillo.length]; };

    var propias = ix.porDep[sel.codigo] || [];
    var conBuscador = propias.length > UMBRAL_BUSCADOR;
    var q = conBuscador ? (pr.q || '').trim() : ''; /* sin buscador, un ?q= heredado no filtra */
    var universo = q ? ix.lista : propias;
    var nq = N.norm(q);
    var vis = universo.filter(function (g) { return sexOk(g) && (!q || N.norm(g.nombre + ' ' + g.deporteNombre).indexOf(nq) >= 0); }).sort(function (a, b) { return q ? a.deporteNombre.localeCompare(b.deporteNombre, 'es') || ordenar(a, b) : ordenar(a, b); });
    var sig = sel.codigo + '|' + q + '|' + (pr.sexo || '');
    if (ui.sig !== sig) { ui.sig = sig; ui.page = 1; }
    var pages = Math.max(1, Math.ceil(vis.length / ui.size)); if (ui.page > pages) ui.page = pages;
    var rows = vis.slice((ui.page - 1) * ui.size, ui.page * ui.size);
    var conIns = vis.length > 0;

    var h = '<section class="nwtab-tab nwtab-dps" aria-label="Deportes"><div class="nwtab-dp' + (compact ? ' nwtab-dp--c' : '') + '">';
    h += '<aside class="nwtab-dp__l" aria-label="Lista de deportes"><label class="nwtab-search"><span class="nwtab-sr">Buscar deporte</span>' + N.ico('search') + '<input type="search" class="nwtab-in" data-k="q-dep" data-in="dep" placeholder="Buscar deporte" value="' + esc(ui.q) + '" autocomplete="off"></label><ul class="nwtab-dp__list">';
    if (!lista.length) h += '<li class="nwtab-dp__none">Ningún deporte coincide.</li>';
    lista.forEach(function (d) {
      var act = d.codigo === sel.codigo, patch = { tab: 'deportes', deporte: d.codigo };
      var n = (ix.porDep[d.codigo] || []).filter(sexOk).length;
      if (compact) { h += '<li><button type="button" class="nwtab-dp__it nwtab-dp__card" data-dep="' + esc(d.codigo) + '" aria-haspopup="dialog"><span class="nwtab-dp__ic">' + N.depIco(d.codigo) + '</span><span class="nwtab-dp__ct"><span class="nwtab-dp__nm">' + esc(d.nombre) + '</span><span class="nwtab-dp__n">' + nPruebas(n) + '</span></span><span class="nwtab-dp__chev" aria-hidden="true">' + N.ico('right') + '</span></button></li>'; return; }
      h += '<li><a class="nwtab-dp__it" data-k="dp-' + d.codigo + '" href="' + esc(ctx.href(patch)) + '" data-patch=\'' + esc(JSON.stringify(patch)) + '\'' + (act ? ' aria-current="true"' : '') + '><span class="nwtab-dp__ic">' + N.depIco(d.codigo) + '</span><span class="nwtab-dp__nm">' + esc(d.nombre) + '</span><span class="nwtab-dp__n">' + n + '<span class="nwtab-sr"> pruebas</span></span></a></li>';
    });
    var fSel = ix.fases[sel.codigo] || 0;
    h += '</ul></aside>';
    var hp = '<div class="nwtab-dp__p"><header class="nwtab-dp__ph"><span class="nwtab-dp__ic nwtab-dp__ic--lg">' + N.depIco(sel.codigo) + '</span><div class="nwtab-dp__t"><h2 class="nwtab-h nwtab-h--lg" id="nwtab-dpm-h">' + esc(sel.nombre) + '</h2><span class="nwtab-tag nwtab-tag--n">' + nPruebas(propias.length) + (fSel > propias.length ? ' · ' + nFases(fSel) : '') + '</span></div>' +
      '<a class="nwtab-btn nwtab-btn--cal" data-k="lk-cal" aria-label="Ver en Calendario y resultados" title="Ver en Calendario y resultados" href="' + esc(ctx.href({ tab: 'calendario-resultados', deporte: sel.codigo, sexo: pr.sexo || '', modal: '' })) + '" data-patch=\'' + esc(JSON.stringify({ tab: 'calendario-resultados', deporte: sel.codigo, sexo: pr.sexo || '', modal: '' })) + '\'><span>Calendario y resultados</span>' + ICO_CAL + '</a>' + (abierto ? '<button type="button" class="nwtab-dpm__x" data-mclose data-k="dpm-x" autofocus aria-label="Cerrar">' + ICO_X + '</button>' : '') + '</header>' + (abierto ? '<div class="nwtab-dpm__body">' : '');
    /* DC-095: la palabra del filtro es «Género». */
    hp += '<div class="nwtab-dp__sb">' + (conBuscador ? '<label class="nwtab-search nwtab-search--w"><span class="nwtab-sr">Buscar prueba</span>' + N.ico('search') + '<input type="search" class="nwtab-in" data-k="q-pru" data-in="pru" placeholder="Buscar prueba" value="' + esc(q) + '" autocomplete="off"></label>' : '') + N.sexBar(pr) + '</div>';
    if (!vis.length) {
      hp += '<div class="nwtab-emptyb">' + (q ? '<b>Ninguna prueba coincide con «' + esc(q) + '».</b><button type="button" class="nwtab-btn" data-k="clr" data-clr="1">Limpiar búsqueda</button>' : '<b>Ninguna prueba con este filtro.</b><span>Pruebe con otro género.</span>') + '</div>';
    } else {
      hp += '<table class="nwtab-pt"><thead><tr><th scope="col">Prueba</th><th scope="col">Próxima competencia</th><th scope="col">Estado</th>' + (conIns ? '<th scope="col" class="nwtab-r">Inscritos</th>' : '') + '</tr></thead><tbody>';
      rows.forEach(function (g, z) {
        var sec = (q ? g.deporteNombre + ' · ' : '') + nFases(g.fases);
        hp += '<tr><td class="nwtab-c-pr"><div class="nwtab-pi"><b class="nwtab-pi__n">' + resaltar(g.nombre, q) + '</b><span class="nwtab-pi__m">' + N.sexTag(g.sexo) + '<span class="nwtab-pi__s" title="' + esc(sec) + '">' + (q ? resaltar(g.deporteNombre, q) + ' · ' : '') + nFases(g.fases) + '</span></span></div></td><td class="nwtab-c-dia">' + celdaDia(g) + '</td><td class="nwtab-c-st">' + estBadge(g) + '</td>' + (conIns ? '<td class="nwtab-c-ins nwtab-r">' + inscritos(g) + '</td>' : '') + '</tr>';
      });
      hp += '</tbody></table>';
      if (pages > 1) hp += '<nav class="nwtab-pg" aria-label="Paginación">' + /* DC-141/142: tamaño fijo 10, sin paginar si cabe en una página */
        '<div class="nwtab-pg__b"><button type="button" class="nwtab-btn nwtab-btn--i" data-k="pg-prev" data-pg="' + (ui.page - 1) + '" aria-label="Página anterior"' + (ui.page <= 1 ? ' disabled' : '') + '>' + N.ico('left') + '</button><span class="nwtab-pg__n">Página <b>' + ui.page + '</b> de ' + pages + '</span><button type="button" class="nwtab-btn nwtab-btn--i" data-k="pg-next" data-pg="' + (ui.page + 1) + '" aria-label="Página siguiente"' + (ui.page >= pages ? ' disabled' : '') + '>' + N.ico('right') + '</button></div></nav>';
    }
    /* Pie fijo con los deportes vecinos, cíclicos (el anillo respeta el buscador de deportes). */
    if (!abierto) hp += '</div>';
    else {
      var vp = vecino(-1), vn = vecino(1);
      hp += '</div>' + (anillo.length > 1 ? '<nav class="nwtab-dpm__mn" aria-label="Cambiar de deporte"><button type="button" class="nwtab-dpm__mb" data-vec="' + esc(vp.codigo) + '" data-k="dpm-p" aria-label="Deporte anterior: ' + esc(vp.nombre) + '">' + N.ico('left') + '<span><small>Anterior</small><b>' + esc(vp.nombre) + '</b></span></button><button type="button" class="nwtab-dpm__mb" data-vec="' + esc(vn.codigo) + '" data-k="dpm-n" aria-label="Deporte siguiente: ' + esc(vn.nombre) + '"><span><small>Siguiente</small><b>' + esc(vn.nombre) + '</b></span>' + N.ico('right') + '</button></nav>' : '') + '</div>';
    }
    h += abierto ? '<dialog class="nwtab-dpm' + (fresh ? ' nwtab-dpm--in' : '') + '" aria-modal="true" aria-labelledby="nwtab-dpm-h">' + hp + '</dialog>' : compact ? '' : hp;
    h += '</div></section>';
    el.innerHTML = h;
    N.bindBar(el, ctx); N.bindLinks(el, ctx);

    var inD = el.querySelector('[data-in="dep"]'), inP = el.querySelector('[data-in="pru"]');
    inD.addEventListener('input', function () { var c = inD.selectionStart; ui.q = inD.value; render(el, ctx); N.refocus('q-dep', c); });
    if (inP) inP.addEventListener('input', function () { var c = inP.selectionStart; ctx.go({ q: inP.value }); N.refocus('q-pru', c); });
    var clr = el.querySelector('[data-clr]'); if (clr) clr.addEventListener('click', function () { N.go(ctx, { q: '' }, 'q-pru'); });
    el.querySelectorAll('[data-pg]').forEach(function (b) { b.addEventListener('click', function () { ui.page = +b.getAttribute('data-pg'); render(el, ctx); N.refocus(b.getAttribute('data-k')); }); });

    /* Modal de pruebas: abrir/cambiar/cerrar viven en la URL; el foco vuelve a la tarjeta que lo abrió. */
    var cambiar = function (patch) { history.replaceState(null, '', ctx.href(patch)); ctx.go({}); };
    el.querySelectorAll('[data-dep]').forEach(function (b) { b.addEventListener('click', function () { ui.fresh = true; ctx.go({ tab: 'deportes', deporte: b.getAttribute('data-dep'), modal: '1' }); }); });
    el.querySelectorAll('[data-vec]').forEach(function (b) { b.addEventListener('click', function () { ui.foc = '[data-k="' + b.getAttribute('data-k') + '"]'; cambiar({ deporte: b.getAttribute('data-vec'), modal: '1' }); }); });
    var dlg = el.querySelector('dialog.nwtab-dpm');
    if (dlg) {
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      dlg.addEventListener('close', function () { ui.foc = '[data-dep="' + sel.codigo + '"]'; cambiar({ modal: '' }); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var f = [].filter.call(dlg.querySelectorAll('a[href],button:not(:disabled),input'), function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      });
      dlg.querySelector('[data-mclose]').addEventListener('click', function () { dlg.close(); });
    }
    if (ui.foc) { var fo = el.querySelector(ui.foc); ui.foc = ''; if (fo) fo.focus({ preventScroll: true }); }
    el.__dpCtx = ctx; el.__dpC = compact;
    var main = el.closest('.nws-main') || el;
    if (window.ResizeObserver && !el.__dpRO) {
      el.__dpRO = new ResizeObserver(function () {
        var c = el.__dpCtx;
        if (!el.isConnected || !el.querySelector('.nwtab-dps')) { el.__dpRO.disconnect(); el.__dpRO = null; return; }
        var ahora = esCompacto(el);
        if (ahora === el.__dpC) return;
        if (!ahora && c.params.modal === '1') { history.replaceState(null, '', c.href({ modal: '' })); c.go({}); } else render(el, c);
      });
      el.__dpRO.observe(main);
    }
  }

  window.Tabs['deportes'] = { render: render };
})();
