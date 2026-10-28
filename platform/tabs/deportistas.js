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
/* Pestaña Deportistas (plataforma): derivada de los podios y colombianos del modelo; búsqueda, filtro por deporte y paginación. */
(function () {
  var N = window.NWS, esc = N.esc;
  window.Tabs = window.Tabs || {};

  /* Una fila por deportista + país + deporte; se calcula una vez por evento (miles de filas). */
  function derivar(data) {
    var norm = (window.OLC_REAL && window.OLC_REAL.normalizarNombre) || function (s) { return s; };
    var mapa = {}, out = [];
    function ver(nombre, pais, p) {
      if (!nombre) return;
      var nm = norm(nombre), k = nm + '|' + (pais || '') + '|' + p.deporte, a = mapa[k];
      if (!a) { a = mapa[k] = { nombre: nm, pais: pais || '', deporte: p.deporte, deporteNombre: p.deporteNombre, prueba: p, n: 0, busca: N.norm(nm).replace(/[^a-z0-9]+/g, ' ') }; out.push(a); }
      a.n++;
    }
    data.pruebas.forEach(function (p) {
      (p.filas || []).forEach(function (f) { ver(f.deportista, f.pais, p); });
      (p.colombianos || []).forEach(function (c) { ver(c.deportista, 'CO', p); });
    });
    var col = new Intl.Collator('es', { sensitivity: 'base', numeric: true });
    return out.sort(function (a, b) { return col.compare(a.nombre, b.nombre) || a.nombre.localeCompare(b.nombre, 'es'); });
  }

  function render(el, ctx) {
    var data = ctx.data, pr = ctx.params, ui = ctx.ui.dt = ctx.ui.dt || { q: '', page: 1, size: 10, cache: {} };
    var all = ui.cache[data.evento.code] || (ui.cache[data.evento.code] = derivar(data));
    var q = N.norm(ui.q.trim()), dep = pr.deporte || '';
    /* Búsqueda por palabras: sin orden, tildes ni mayúsculas («oliveira samuel» = «samuel de oliveira»). */
    var toks = q.split(/[^a-z0-9]+/).filter(Boolean);
    var vis = all.filter(function (a) { return (!dep || a.deporte === dep) && toks.every(function (t) { return a.busca.indexOf(t) >= 0; }); });
    var pages = Math.max(1, Math.ceil(vis.length / ui.size)); if (ui.page > pages) ui.page = pages;
    var rows = vis.slice((ui.page - 1) * ui.size, ui.page * ui.size);
    var filtrado = q || dep;

    var h = '<section class="nwtab-tab nwtab-dt" aria-label="Deportistas"><div class="nwtab-bar"><div class="nwtab-bar__r2"><label class="nwtab-search nwtab-search--w"><span class="nwtab-sr">Buscar deportista por nombre</span>' + N.ico('search') + '<input type="search" class="nwtab-in" data-k="q-dt" data-in="1" placeholder="Buscar por nombre" value="' + esc(ui.q) + '" autocomplete="off"></label>' +
      '<label class="nwtab-fld"><span class="nwtab-lbl">Deporte</span><select class="nwtab-sel" data-k="dt-dep" data-sel="1"><option value="">Todos los deportes</option>' + data.deportes.map(function (d) { return '<option value="' + d.codigo + '"' + (d.codigo === dep ? ' selected' : '') + '>' + esc(d.nombre) + '</option>'; }).join('') + '</select></label>' +
      '<p class="nwtab-count" aria-live="polite"><b>' + N.num(vis.length) + '</b> deportistas' + (filtrado ? ' de ' + N.num(all.length) : '') + '</p></div></div>';
    if (!vis.length) {
      h += '<div class="nwtab-emptyb"><b>' + (all.length ? 'Ningún deportista coincide con la búsqueda.' : 'Aún no hay deportistas con resultados en este evento.') + '</b>' + (filtrado ? '<button type="button" class="nwtab-btn" data-k="dt-clr" data-clr="1">Limpiar filtros</button>' : '') + '</div>';
    } else {
      h += '<table class="nwtab-pt nwtab-pt--dt"><thead><tr><th scope="col">Deportista</th><th scope="col">País</th><th scope="col">Deporte</th><th scope="col">Prueba</th></tr></thead><tbody>';
      rows.forEach(function (a) {
        h += '<tr><td class="nwtab-c-nm"><b>' + esc(a.nombre) + '</b></td><td class="nwtab-c-del">' + (a.pais ? N.cc(a.pais) : '') + '</td><td class="nwtab-c-dep">' + esc(a.deporteNombre) + '</td><td class="nwtab-c-pru"><span class="nwtab-pn"><span>' + esc(a.prueba.nombre) + '</span>' + N.sexTag(a.prueba.sexo) + (a.n > 1 ? '<span class="nwtab-chip">+' + (a.n - 1) + (a.n === 2 ? ' fase' : ' fases') + '</span>' : '') + '</span></td></tr>';
      });
      h += '</tbody></table>';
      if (pages > 1) h += '<nav class="nwtab-pg" aria-label="Paginación">' + /* DC-141/142: tamaño fijo 10, sin paginar si cabe en una página */
        '<div class="nwtab-pg__b"><button type="button" class="nwtab-btn nwtab-btn--i" data-k="pg-prev" data-pg="' + (ui.page - 1) + '" aria-label="Página anterior"' + (ui.page <= 1 ? ' disabled' : '') + '>' + N.ico('left') + '</button><span class="nwtab-pg__n">Página <b>' + ui.page + '</b> de ' + N.num(pages) + '</span><button type="button" class="nwtab-btn nwtab-btn--i" data-k="pg-next" data-pg="' + (ui.page + 1) + '" aria-label="Página siguiente"' + (ui.page >= pages ? ' disabled' : '') + '>' + N.ico('right') + '</button></div></nav>';
    }
    h += '</section>';
    el.innerHTML = h;

    var again = function (k, c) { window.Tabs['deportistas'].render(el, ctx); N.refocus(k, c); };
    var inp = el.querySelector('[data-in]'); inp.addEventListener('input', function () { var c = inp.selectionStart; ui.q = inp.value; ui.page = 1; again('q-dt', c); });
    el.querySelector('[data-sel]').addEventListener('change', function (e) { ui.page = 1; N.go(ctx, { deporte: e.target.value }, 'dt-dep'); });
    el.querySelectorAll('[data-pg]').forEach(function (b) { b.addEventListener('click', function () { ui.page = +b.getAttribute('data-pg'); again(b.getAttribute('data-k')); }); });
    var c = el.querySelector('[data-clr]'); if (c) c.addEventListener('click', function () { ui.q = ''; ui.page = 1; if (dep) N.go(ctx, { deporte: '' }, 'q-dt'); else again('q-dt'); });
  }

  window.Tabs['deportistas'] = { render: render };
})();
