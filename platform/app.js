/* Shell de la plataforma (Naowee Suite): router hash, listado, detalle y ctx de las tabs. */
(function () {
  'use strict';
  var OLC = window.OLC;
  var $main = document.getElementById('nws-main');
  var $top = document.getElementById('nws-topbar');

  var TABS = [
    { id: 'informacion', label: 'Información' },
    { id: 'cargas', label: 'Cargas' },
    { id: 'deportes', label: 'Deportes' },
    { id: 'organizaciones', label: 'Organizaciones' },
    { id: 'inscripciones', label: 'Nominal' },
    { id: 'calendario-resultados', label: 'Calendario y resultados' },
    { id: 'medalleria', label: 'Medallería' },
    { id: 'boletines', label: 'Boletines técnicos' },
    { id: 'metodologos', label: 'Metodólogos' },
    { id: 'analitica', label: 'Analítica' }
  ];
  var PARAMS = ['sexo', 'colombia', 'dia', 'deporte', 'q', 'tab', 'prueba', 'modal', 'vista'];
  /* El módulo gira en torno a eventos: un solo punto de entrada. Dashboards y demás cuelgan del evento como pestañas. */
  var ROL = window.ROLES.rol;
  var ITEMS = {
    eventos: { id: 'events', label: 'Eventos', route: '#/eventos?vista=tarjetas', icon: 'categories', section: 'EVENTOS' },
    calendario: { id: 'calendar', label: 'Calendario', route: '#/eventos?vista=calendario', icon: 'calendar' }, // sin section: queda bajo EVENTOS
    deportistas: { id: 'athletes', label: 'Consulta deportistas', route: '#/deportistas', icon: 'avatar', section: 'CONSULTA' },
    usuarios: { id: 'users', label: 'Usuarios', route: '#/usuarios', icon: 'user', section: 'ADMINISTRACIÓN' }
  };
  var MENU = (ROL.menu || []).map(function (k) { return ITEMS[k]; });
  var YO = ROL.persona; // «Mis eventos» = eventos que el rol gestiona

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(name, cls) {
    return '<span class="nwt-icon ' + (cls || '') + '" aria-hidden="true"><i class="naotech-icon-' + name + '"></i></span>';
  }
  var ESTADO_TEMA = { 'En curso': 'informative', 'Próximo': 'neutral', 'Finalizado': 'positive' };
  function badge(texto, tema, extra) {
    return '<span class="nwt-badge nwt-badge--vignette nws-badge ' + (extra || '') + '" nwt-variant="quiet" nwt-theme="' + tema +
      '"><span class="nwt-badge__content"><span class="nwt-badge__label">' + esc(texto) + '</span></span></span>';
  }
  function badgeEstado(est, sinPunto) {
    var b = badge(est, ESTADO_TEMA[est] || 'neutral', sinPunto ? 'nws-badge--nodot' : '');
    return sinPunto ? b.replace(' nwt-badge--vignette', '') : b;
  }
  function badgeCiclo() {
    return '<span class="nwt-badge nws-badge nws-badge--ciclo" nwt-variant="quiet" nwt-theme="secondary"><span class="nwt-badge__content"><span class="nwt-badge__label">Ciclo Olímpico</span></span></span>';
  }
  /* DC-102/103: estado, alcance y ciclo como badges con texto (mismo badge que el detalle) */
  function chip(svg, txt, cls) {
    return '<span class="nwt-badge nws-badge nws-badge--chip ' + cls + '" nwt-variant="quiet" nwt-theme="neutral"><span class="nwt-badge__content">' + svg +
      '<span class="nwt-badge__label">' + esc(txt) + '</span></span></span>';
  }
  function dotEstado(est) { return badgeEstado(est, true).replace('nws-badge ', 'nws-badge nws-st '); }
  function icoCiclo() {
    return chip('<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="6.5" cy="9" r="4"/><circle cx="12" cy="9" r="4"/><circle cx="17.5" cy="9" r="4"/><circle cx="9.25" cy="15" r="4"/><circle cx="14.75" cy="15" r="4"/></svg>', 'Ciclo Olímpico', 'nws-chip--ciclo');
  }
  function icoAlcance(e) {
    return chip('<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>', e.alcance === 'NACIONAL' ? 'Nacional' : 'Internacional', 'nws-chip--alc');
  }
  /* Tiempo del evento, siempre derivado de las fechas contra OLC.HOY. */
  function dif(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000); }
  function corta(iso) { return OLC.fechaCorta(iso).replace(/ \d{4}$/, ''); }
  function tiempoEvento(e) {
    var est = e.estado || OLC.estado(e); e = Object.assign({}, e, { estado: est });
    if (e.estado === 'Finalizado') return 'Finalizó el ' + corta(e.fin);
    if (e.estado === 'Próximo') { var n = dif(OLC.HOY, e.inicio); return n === 1 ? 'Falta 1 día' : 'Faltan ' + n + ' días'; }
    return 'Día ' + (dif(e.inicio, OLC.HOY) + 1) + ' de ' + (dif(e.inicio, e.fin) + 1);
  }
  function ciudad(lugar) { return String(lugar || '').split(',')[0]; }
  function alcanceTxt(e) { if (e.alcance === 'NACIONAL') return 'Nacional'; var n = e.paises; return 'Internacional' + (n > 0 ? ' · ' + n + (n === 1 ? ' país' : ' países') : ''); }
  /* Un evento es de un deporte o multideportivo: la misma tarjeta lo dice con un chip, no con otra pantalla. */
  var DEP_NOMBRE = { atletismo: 'Atletismo', natacion: 'Natación', judo: 'Judo', pesas: 'Levantamiento de pesas', ciclismo: 'Ciclismo', voleibol: 'Voleibol' };
  function deporteTxt(e) { return e.deportes && e.deportes.length === 1 ? (DEP_NOMBRE[e.deportes[0]] || e.deportes[0]) : 'Multideportivo'; }
  function icoDeporte(e) {
    return chip('<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/></svg>', deporteTxt(e), 'nws-chip--dep');
  }
  function iniciales(n) { return String(n).split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase(); }
  function whenDefined(tag, fn) { if (window.customElements) customElements.whenDefined(tag).then(fn); }

  /* ---------- hash ---------- */
  function parseHash() {
    var h = location.hash.replace(/^#/, '') || '/eventos';
    var q = h.indexOf('?');
    var path = q < 0 ? h : h.slice(0, q);
    var params = {};
    if (q >= 0) {
      h.slice(q + 1).split('&').forEach(function (kv) {
        if (!kv) return;
        var i = kv.indexOf('=');
        var k = decodeURIComponent(i < 0 ? kv : kv.slice(0, i));
        var v = i < 0 ? '' : decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' '));
        if (PARAMS.indexOf(k) >= 0 && v !== '') params[k] = v;
      });
    }
    var m = path.match(/^\/eventos\/([^/]+)\/?$/);
    var s = path.replace(/\/$/, '');
    if (s === '/eventos/nuevo') return { view: 'nuevo', code: 'nuevo', params: params };
    if (s === '/deportistas') return { view: 'deportistas', code: s, params: params };
    if (s === '/usuarios') return { view: 'usuarios', code: s, params: params };
    var md = s.match(/^\/deportistas\/(.+)$/);
    if (md) return { view: 'perfil', code: decodeURIComponent(md[1]), params: params };
    var me = s.match(/^\/eventos\/([^/]+)\/editar$/);
    if (me) return { view: 'editar', code: decodeURIComponent(me[1]), params: params };
    return { view: m ? 'detalle' : 'listado', code: m ? decodeURIComponent(m[1]) : null, params: params };
  }
  function buildHash(code, params) {
    var base = code ? '#/eventos/' + encodeURIComponent(code) : '#/eventos';
    var parts = [];
    PARAMS.forEach(function (k) {
      if (params[k] != null && params[k] !== '') parts.push(k + '=' + encodeURIComponent(params[k]));
    });
    return base + (parts.length ? '?' + parts.join('&') : '');
  }
  function merge(params, patch) {
    var o = {};
    Object.keys(params).forEach(function (k) { o[k] = params[k]; });
    Object.keys(patch || {}).forEach(function (k) {
      if (patch[k] == null || patch[k] === '') delete o[k]; else o[k] = patch[k];
    });
    return o;
  }

  /* ---------- foco: se conserva al re-renderizar una tab ---------- */
  function pathOf(root, el) {
    var p = [];
    while (el && el !== root) { var par = el.parentNode; if (!par) return null; p.unshift(Array.prototype.indexOf.call(par.children, el)); el = par; }
    return el === root ? p : null;
  }
  function resolve(root, p) {
    var el = root;
    for (var i = 0; i < p.length; i++) { el = el && el.children[p[i]]; }
    return el;
  }

  /* ---------- estado del shell ---------- */
  var state = { code: null, view: null };
  var listUi = { scope: window.ROLES.actual === 'gestor' ? 'mine' : 'all', estado: 'todos', q: '', page: 1, vista: 'tarjetas', mes: '2026-10' };
  var tabUi = {}; // ctx.ui por evento: sobrevive a los re-render
  var PAGE_SIZE = 12; // cabe todo el catálogo (11): «Todos» no esconde en pág. 2 los de «Mis eventos»

  function setTop(partes) {
    var h = '<div class="nws-topbar__in">';
    partes.forEach(function (p, i) {
      if (i) h += '<span class="nws-topbar__sep" aria-hidden="true">/</span>';
      h += p.href ? '<a href="' + p.href + '">' + esc(p.t) + '</a>' : '<span aria-current="page">' + esc(p.t) + '</span>';
    });
    $top.innerHTML = '<nav aria-label="Miga de pan">' + h + '</div></nav>';
  }

  /* ---------- side panel (nwt-sidebar) ---------- */
  var $side = document.getElementById('nws-sidebar');
  var $menuBtn = document.getElementById('nws-menubtn');
  var viaMenu = false; // el drawer se cerró por navegar: el foco va al contenido, no al botón
  function menuActivo(route) {
    if (route.view === 'deportistas' || route.view === 'perfil') return 'athletes';
    if (route.view === 'usuarios') return 'users';
    return route.view === 'listado' && (route.params.vista || listUi.vista) === 'calendario' ? 'calendar' : 'events';
  }
  function syncMenu(route) {
    var act = menuActivo(route);
    $side.menus = MENU.map(function (m) { return Object.assign({}, m, { active: m.id === act }); });
  }
  function drawerMode() { return window.matchMedia('(max-width:960px)').matches; }
  function syncInert(open) { if (drawerMode() && !open) $side.setAttribute('inert', ''); else $side.removeAttribute('inert'); }
  function marcarActivo() {
    $side.querySelectorAll('.nwt-sidebar__menu__link[aria-current]').forEach(function (a) { a.removeAttribute('aria-current'); });
    var a = $side.querySelector('.nwt-sidebar__menu__item--active > .nwt-sidebar__menu__link');
    if (a) a.setAttribute('aria-current', 'page');
    var o = $side.querySelector('.nwt-sidebar__footer__logout'); // sin sesión: inerte, no oculto
    if (o && !o.hasAttribute('aria-disabled')) { o.setAttribute('aria-disabled', 'true'); o.title = 'No incluido en este prototipo'; }
  }
  new MutationObserver(marcarActivo).observe($side, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  $side.addEventListener('nwtMenuClick', function (e) {
    var r = e.detail && e.detail.route;
    if (!r) return;
    viaMenu = true;
    // Entrar por el menú siempre lleva a la primera página: vista nueva, scroll arriba y paginación en 1 (DC-147)
    state.view = null; state.code = null; listUi.page = 1;
    if (r === location.hash) render(); else location.hash = r;
    if ($side.closeDrawer) $side.closeDrawer();
  });
    $side.addEventListener('nwtOpenChange', function (e) {
    var open = !!e.detail;
    $menuBtn.setAttribute('aria-expanded', String(open));
    syncInert(open);
    if (open) { var f = $side.querySelector('.nwt-sidebar__toolbar__button'); if (f) f.focus(); }
    else if (!viaMenu && drawerMode()) $menuBtn.focus();
    viaMenu = false;
  });
  /* Foco atrapado mientras el drawer está abierto. */
  $side.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !drawerMode() || $menuBtn.getAttribute('aria-expanded') !== 'true') return;
    var fs = $side.querySelectorAll('a[href],button:not([disabled])');
    if (!fs.length) return;
    var first = fs[0], last = fs[fs.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('click', function (e) {
    if ($menuBtn.getAttribute('aria-expanded') === 'true' && !$side.contains(e.target) && !$menuBtn.contains(e.target)) $side.closeDrawer();
  });
  $menuBtn.addEventListener('click', function () { if ($side.openDrawer) { $side.removeAttribute('inert'); $side.openDrawer(); } });
  window.matchMedia('(max-width:960px)').addEventListener('change', function () { $menuBtn.setAttribute('aria-expanded', 'false'); syncInert(false); });
  syncInert(false);

  /* ---------- listado ---------- */
  var EST_KEY = { curso: 'En curso', proximo: 'Próximo', finalizado: 'Finalizado' };
  var EST_ORD = { 'En curso': 0, 'Próximo': 1, 'Finalizado': 2 };
  var EST_SEC = { 'En curso': 'En curso', 'Próximo': 'Próximos', 'Finalizado': 'Finalizados' };
  function eventosFiltrados(sinEstado) {
    var q = listUi.q.trim().toLowerCase();
    return OLC.eventos().filter(function (e) {
      if (!window.ROLES.puedeVer(e)) return false;
      if (ROL.lista === 'alcance' && listUi.scope === 'mine' && e.gestor.nombre !== YO) return false;
      if (!sinEstado && listUi.estado !== 'todos' && e.estado !== EST_KEY[listUi.estado]) return false;
      if (q) {
        var hay = [e.nombre, e.lugar, e.organismo, alcanceTxt(e), deporteTxt(e)].concat(e.sedes || []);
        if (!hay.some(function (s) { return String(s).toLowerCase().indexOf(q) >= 0; })) return false;
      }
      return true;
    }).sort(function (a, b) {
      // En curso, luego Próximos (el más cercano primero) y al final Finalizados (el más reciente primero)
      if (a.estado !== b.estado) return EST_ORD[a.estado] - EST_ORD[b.estado];
      return a.estado === 'Finalizado' ? (a.inicio < b.inicio ? 1 : -1) : (a.inicio < b.inicio ? -1 : 1);
    });
  }
  /* Solo los filtros de estado que tienen eventos en el alcance y la búsqueda actuales. */
  function itemsEstado() {
    var ex = {}; eventosFiltrados(true).forEach(function (e) { ex[e.estado] = 1; });
    var items = [{ id: 'todos', label: 'Todos', value: 'todos' }];
    [['curso', 'En curso'], ['proximo', 'Próximos'], ['finalizado', 'Finalizados']].forEach(function (x) { if (ex[EST_KEY[x[0]]]) items.push({ id: x[0], label: x[1], value: x[0] }); });
    return items.length > 2 ? items : [];
  }
  function syncEstado() {
    var tg = document.querySelector('#nws-estado nwt-tag-group'), items = itemsEstado();
    if (listUi.estado !== 'todos' && !items.some(function (i) { return i.value === listUi.estado; })) listUi.estado = 'todos';
    var box = document.getElementById('nws-estado'); if (box) box.hidden = !items.length;
    if (tg && items.length) { tg.items = items; tg.value = listUi.estado; }
  }

  function cardHtml(e) {
    return '<article class="ec nws-ec" ><div class="ec-body">' +
      '<div class="ec-top"><div class="ec-t"><h3 class="ec-title nwt-smalltext-font-bold"><a class="ec-main" href="#/eventos/' + encodeURIComponent(e.code) + '">' + esc(e.nombre) + '</a></h3>' +
      '<div class="ec-sub">' + icoAlcance(e) + (e.ciclo ? icoCiclo() : '') + icoDeporte(e) + '</div></div>' +
      dotEstado(e.estado) + '</div>' +
      '<div class="ec-meta">' +
      '<div class="ec-row">' + icon('calendar') + '<span><strong>' + OLC.fechaCorta(e.inicio) + '</strong> — ' + OLC.fechaCorta(e.fin) + '</span></div>' +
      '<div class="ec-row">' + icon('gps-pin') + '<span>' + esc(ciudad(e.lugar)) + '</span></div>' +
      '<div class="ec-row ec-when ec-when--' + { 'En curso': 'on', 'Próximo': 'next', 'Finalizado': 'end' }[e.estado] + '">' + icon('dispatch-time') + '<span>' + esc(tiempoEvento(e)) + '</span></div>' +
      '</div></div>' +
      '<div class="ec-foot' + (e.estado === 'Finalizado' ? ' ec-foot--two' : '') + '">' +
      (e.estado === 'Finalizado' ? '<a class="ec-link ec-link--med" href="#/eventos/' + encodeURIComponent(e.code) + '?tab=medalleria">Ver medallería ' + icon('arrow-right') + '</a>' : '') +
      '<span class="ec-link">Ver detalle ' + icon('arrow-right') + '</span></div></article>';
  }

  function filaHtml(e) {
    var href = '#/eventos/' + encodeURIComponent(e.code);
    return '<li class="nws-row"><span class="nws-row__st">' + dotEstado(e.estado) + '</span>' +
      '<a class="nws-row__name nwt-smalltext-font-bold" href="' + href + '">' + esc(e.nombre) + '</a>' +
      '<span class="nws-row__ciclo">' + (e.ciclo ? icoCiclo() : '') + '</span>' +
      '<span class="nws-row__fechas nwt-caption-font-regular">' + icon('calendar') + '<span><strong>' + OLC.fechaCorta(e.inicio) + '</strong> – ' + OLC.fechaCorta(e.fin) + '</span></span>' +
      '<span class="nws-row__lugar nwt-caption-font-regular">' + icon('gps-pin') + '<span>' + esc(ciudad(e.lugar)) + '</span></span>' +
      '<span class="nws-row__alc">' + icoAlcance(e) + '</span>' +
      '<a class="ec-link nws-row__ver" href="' + href + '" aria-label="Ver detalle de ' + esc(e.nombre) + '">Ver detalle ' + icon('arrow-right') + '</a></li>';
  }
  function itemsHtml(arr) {
    return listUi.vista === 'lista' ? '<ul class="nws-lista" aria-label="Eventos">' + arr.map(filaHtml).join('') + '</ul>' : '<div class="nws-cards">' + arr.map(cardHtml).join('') + '</div>';
  }

  /* calendario mensual con barras que abarcan días */
  function calendarHtml(evs) {
    var p = listUi.mes.split('-'), y = +p[0], m = +p[1] - 1;
    var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
    var first = new Date(y, m, 1, 12);
    var start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7)); // lunes
    var weeks = [];
    for (var w = 0; w < 6; w++) {
      var days = [];
      for (var d = 0; d < 7; d++) { var dt = new Date(start); dt.setDate(start.getDate() + w * 7 + d); days.push(dt); }
      if (w >= 4 && days[0].getMonth() !== m) break;
      weeks.push(days);
    }
    var tema = { 'En curso': 'on', 'Próximo': 'next', 'Finalizado': 'end' };
    var h = '<div class="nws-cal"><div class="nws-cal__nav"><button type="button" class="nws-iconbtn" data-mes="-1" aria-label="Mes anterior">' + icon('chevron-left') + '</button>' +
      '<h3 class="nwt-smalltext-font-bold" aria-live="polite">' + MESES[m][0].toUpperCase() + MESES[m].slice(1) + ' de ' + y + '</h3>' +
      '<button type="button" class="nws-iconbtn" data-mes="1" aria-label="Mes siguiente">' + icon('chevron-right') + '</button>' +
      '<button type="button" class="nws-linkbtn" data-mes="hoy">Hoy</button></div>';
    h += '<div class="nws-cal__dow" aria-hidden="true">' + ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>';
    weeks.forEach(function (days) {
      var a = iso(days[0]), b = iso(days[6]);
      var bars = evs.filter(function (e) { return e.inicio <= b && e.fin >= a; }).sort(function (x, z) { return x.inicio < z.inicio ? -1 : 1; });
      var lanes = [];
      bars.forEach(function (e) {
        var c0 = Math.max(0, days.findIndex(function (dd) { return iso(dd) >= e.inicio; })), c1 = 6;
        for (var i = 0; i < 7; i++) if (iso(days[i]) <= e.fin) c1 = i;
        if (e.inicio > a) { for (var j = 0; j < 7; j++) if (iso(days[j]) === e.inicio) c0 = j; } else c0 = 0;
        var lane = 0;
        while (lanes[lane] && lanes[lane].some(function (r) { return !(c1 < r[0] || c0 > r[1]); })) lane++;
        (lanes[lane] = lanes[lane] || []).push([c0, c1]);
        e._p = { c0: c0, c1: c1, lane: lane, ini: e.inicio >= a, fin: e.fin <= b };
      });
      h += '<div class="nws-cal__week" style="--lanes:' + Math.max(lanes.length, 1) + '"><div class="nws-cal__days">' +
        days.map(function (dd) {
          var out = dd.getMonth() !== m, hoy = iso(dd) === OLC.HOY;
          return '<div class="nws-cal__day' + (out ? ' is-out' : '') + '"><span class="' + (hoy ? 'is-today' : '') + '"' + (hoy ? ' aria-label="Hoy, ' + dd.getDate() + '"' : '') + '>' + dd.getDate() + '</span></div>';
        }).join('') + '</div>';
      bars.forEach(function (e) {
        var r = e._p;
        h += '<a class="nws-cal__bar nws-cal__bar--' + tema[e.estado] + (r.ini ? ' is-start' : '') + (r.fin ? ' is-end' : '') + '" href="#/eventos/' + encodeURIComponent(e.code) +
          '" style="grid-column:' + (r.c0 + 1) + '/' + (r.c1 + 2) + ';grid-row:' + (r.lane + 1) + '" title="' + esc(e.nombre + ' · ' + e.estado) + '">' + esc(e.nombre) + '<span class="nws-sr"> · ' + e.estado + '</span></a>';
      });
      h += '</div>';
    });
    return h + '</div>';
  }

  function renderResultados() {
    var box = document.getElementById('nws-results');
    var evs = eventosFiltrados();
    var cuenta = document.getElementById('nws-count');
    if (listUi.vista === 'calendario') {
      cuenta.textContent = evs.length + (evs.length === 1 ? ' evento' : ' eventos');
      box.innerHTML = evs.length ? calendarHtml(evs) : emptyHtml();
      box.querySelectorAll('[data-mes]').forEach(function (b) {
        b.addEventListener('click', function () {
          var v = b.getAttribute('data-mes'), p = listUi.mes.split('-'), d;
          if (v === 'hoy') d = new Date(OLC.HOY + 'T12:00:00'); else d = new Date(+p[0], +p[1] - 1 + (+v), 1, 12);
          listUi.mes = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
          var f = b.getAttribute('data-mes');
          renderResultados();
          var again = box.querySelector('[data-mes="' + f + '"]'); if (again) again.focus();
        });
      });
      return;
    }
    var pages = Math.max(1, Math.ceil(evs.length / PAGE_SIZE));
    if (listUi.page > pages) listUi.page = pages;
    var slice = evs.slice((listUi.page - 1) * PAGE_SIZE, listUi.page * PAGE_SIZE);
    cuenta.textContent = evs.length + (evs.length === 1 ? ' evento' : ' eventos');
    if (!evs.length) { box.innerHTML = emptyHtml(); return; }
    var h = '';
    if (listUi.estado === 'todos') {
      // secciones por estado: solo las que tienen eventos
      var cont = {}; evs.forEach(function (e) { cont[e.estado] = (cont[e.estado] || 0) + 1; });
      var ult = null, abierto = false, grupo = [];
      var cerrar = function () { if (abierto) h += itemsHtml(grupo) + '</section>'; };
      slice.forEach(function (e) {
        if (e.estado !== ult) {
          cerrar();
          h += '<section class="nws-sec" aria-labelledby="nws-sec-' + EST_ORD[e.estado] + '"><h2 class="nws-sec__t nwt-smalltext-font-bold" id="nws-sec-' + EST_ORD[e.estado] + '">' + EST_SEC[e.estado] + '<span class="nws-sec__n">' + cont[e.estado] + '</span></h2>';
          ult = e.estado; abierto = true; grupo = [];
        }
        grupo.push(e);
      });
      cerrar();
    } else h = itemsHtml(slice);
    h += '<div class="nws-bar">';
    if (pages > 1) {
      h += '<nav class="nw-pager nw-pager--nums" aria-label="Paginación"><button type="button" data-pg="' + (listUi.page - 1) + '" aria-label="Página anterior"' + (listUi.page === 1 ? ' disabled' : '') + '>' + icon('chevron-left') + '</button>';
      for (var i = 1; i <= pages; i++) h += '<button type="button" data-pg="' + i + '"' + (i === listUi.page ? ' aria-current="page"' : '') + '>' + i + '</button>';
      h += '<button type="button" data-pg="' + (listUi.page + 1) + '" aria-label="Página siguiente"' + (listUi.page === pages ? ' disabled' : '') + '>' + icon('chevron-right') + '</button></nav>';
    }
    box.innerHTML = h + '</div>';
    box.querySelectorAll('[data-pg]').forEach(function (b) {
      b.addEventListener('click', function () { listUi.page = +b.getAttribute('data-pg'); renderResultados(); var s = box.querySelector('.nws-cards a, .nws-lista a'); if (s) s.focus(); });
    });
    // tarjeta entera clicable: el enlace del título hace de ancla accesible
    box.querySelectorAll('.nws-ec').forEach(function (c) {
      c.addEventListener('click', function (ev) { if (ev.target.closest('a')) return; location.hash = c.querySelector('a.ec-main').getAttribute('href'); });
    });
  }

  function emptyHtml() {
    return '<div class="nws-empty"><p class="nwt-smalltext-font-bold">No hay eventos con estos criterios</p><p class="nwt-caption-font-regular nws-muted">Prueba con otro estado o borra la búsqueda.</p></div>';
  }

  function renderListado() {
    var pv = parseHash().params.vista; if (pv === 'calendario' || pv === 'tarjetas' || pv === 'lista') listUi.vista = pv;
    setTop([{ t: 'Eventos' }]);
    $main.innerHTML =
      '<div class="nws-page nws-events-list">' +
      '<div class="nws-events-header"><div class="nws-events-header__description"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">Eventos</h1>' +
      '<small class="nwt-smalltext-font-regular">' + (ROL.crea ? 'Consulta y administra los eventos del módulo.' : 'Consulta los eventos a los que tienes acceso.') + '</small></div>' +
      (ROL.crea ? '<a class="nws-newbtn" href="#/eventos/nuevo">' + icon('add') + '&nbsp;Crear evento</a>' : '') + '</div>' +
      '<div class="nws-events-catalog">' +
      '<div class="nws-scope" id="nws-scope"></div>' +
      '<div class="nws-events-catalog__header">' +
      '<div class="nwt-searchbox nws-search"><label class="nwt-searchbox__container">' + icon('search') +
      '<input class="nwt-searchbox__input" type="search" id="nws-q" placeholder="Buscar evento, deporte, lugar u organismo…" aria-label="Buscar evento, deporte, lugar u organismo" value="' + esc(listUi.q) + '"></label></div>' +
      '<div class="nws-events-catalog__filters"><div id="nws-estado"></div>' +
      '<div class="nws-seg" role="group" aria-label="Vista">' + [['tarjetas', 'view-grid', 'Vista de tarjetas'], ['lista', 'view-list', 'Vista de lista'], ['calendario', 'calendar', 'Vista de calendario']].map(function (v) {
        return '<button type="button" data-vista="' + v[0] + '" aria-pressed="' + (listUi.vista === v[0]) + '" aria-label="' + v[2] + '" title="' + v[2] + '">' + icon(v[1]) + '</button>';
      }).join('') + '</div></div></div>' +
      '<p class="nwt-caption-font-regular nws-muted" id="nws-count" role="status" aria-live="polite"></p>' +
      '<div id="nws-results"></div></div></div>';

    var scope = document.getElementById('nws-scope');
    scope.innerHTML = ROL.lista === 'alcance' ? '<nwt-tabs auto-width></nwt-tabs>' : '';
    scope.hidden = ROL.lista !== 'alcance';
    var tabs = scope.firstChild;
    if (tabs) whenDefined('nwt-tabs', function () {
      tabs.items = [{ id: 'mine', label: 'Mis eventos', value: 'mine' }, { id: 'all', label: 'Todos los eventos', value: 'all' }];
      tabs.value = listUi.scope;
      tabs.addEventListener('nwtChange', function (e) { listUi.scope = e.detail; listUi.page = 1; syncEstado(); renderResultados(); });
    });
    var est = document.getElementById('nws-estado');
    est.innerHTML = '<nwt-tag-group nwt-size="medium" aria-label="Filtrar por estado"></nwt-tag-group>';
    var tg = est.firstChild;
    whenDefined('nwt-tag-group', function () {
      syncEstado();
      tg.addEventListener('nwtChange', function (e) { listUi.estado = e.detail; listUi.page = 1; renderResultados(); });
    });
    document.getElementById('nws-q').addEventListener('input', function (e) { listUi.q = e.target.value; listUi.page = 1; syncEstado(); renderResultados(); });
    $main.querySelectorAll('[data-vista]').forEach(function (b) {
      b.addEventListener('click', function () {
        listUi.vista = b.getAttribute('data-vista');
        $main.querySelectorAll('[data-vista]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        renderResultados();
      });
    });
    syncEstado();
    renderResultados();
  }

  /* ---------- crear evento ---------- */
  function renderNuevo() {
    setTop([{ t: 'Eventos', href: '#/eventos' }, { t: 'Crear evento' }]);
    document.title = 'Crear evento · Naowee Suite';
    if (!ROL.crea) {
      $main.innerHTML = '<div class="nws-page"><div class="nws-empty nws-empty--page"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">Crear evento no está disponible</h1><p class="nwt-smalltext-font-regular nws-muted">Tu rol no puede crear eventos.</p><a class="nws-btn" href="#/eventos">Volver a eventos</a></div></div>';
      return;
    }
    window.Crear.render($main, { icon: icon, onCreated: function (code) { state.flash = 'Evento creado. Quedó asignado a su gestor y su estado se calcula con sus fechas.'; location.hash = '#/eventos/' + encodeURIComponent(code); } });
  }

  /* ---------- deportistas y usuarios ---------- */
  function renderDirectorio(route) {
    var clave = route.view === 'usuarios' ? 'usuarios' : 'deportistas', ctx = { icon: icon, setTop: setTop };
    if ((ROL.menu || []).indexOf(clave) < 0) {
      setTop([{ t: 'Eventos', href: '#/eventos' }]);
      $main.innerHTML = '<div class="nws-page"><div class="nws-empty nws-empty--page"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">Esta sección no está disponible</h1><p class="nwt-smalltext-font-regular nws-muted">Tu rol no tiene acceso.</p><a class="nws-btn" href="#/eventos">Volver a eventos</a></div></div>';
      return;
    }
    if (route.view === 'usuarios') window.Directorio.usuarios($main, ctx);
    else if (route.view === 'perfil') window.Directorio.perfil($main, ctx, route.code);
    else window.Directorio.deportistas($main, ctx);
  }

  /* ---------- editar evento ---------- */
  function renderEditar(route) {
    var data; try { data = OLC.datosDe(route.code); } catch (err) { data = null; }
    var ev = data && data.evento;
    setTop([{ t: 'Eventos', href: '#/eventos' }, { t: ev ? ev.nombre : 'Evento', href: ev ? '#/eventos/' + encodeURIComponent(ev.code) : '#/eventos' }, { t: 'Editar' }]);
    if (!ev || !ROL.edita || !window.ROLES.puedeVer(ev)) {
      $main.innerHTML = '<div class="nws-page"><div class="nws-empty nws-empty--page"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">Editar evento no está disponible</h1><p class="nwt-smalltext-font-regular nws-muted">Tu rol no puede editar este evento.</p><a class="nws-btn" href="#/eventos">Volver a eventos</a></div></div>';
      return;
    }
    document.title = 'Editar ' + ev.nombre + ' · Naowee Suite';
    window.Crear.render($main, { icon: icon, evento: ev, onSaved: function (code) { state.flash = 'Cambios guardados.'; location.hash = '#/eventos/' + encodeURIComponent(code); } });
  }

  /* ---------- detalle ---------- */
  /* Un nacional necesita al menos una organización invitada para operar: se avisa solo a quien lo gestiona. Se rehace al invitar o quitar. */
  function incompletoHtml(ev) {
    return ev.alcance === 'NACIONAL' && window.ROLES.gestiona(ev) && !window.OrgsEvento.lista(ev).length
      ? '<div class="nws-flash nws-flash--info" role="note"><span>El evento necesita al menos una organización invitada para operar (inscripciones, resultados y medallería). <a href="' + buildHash(ev.code, { tab: 'organizaciones' }) + '">Invitar organizaciones</a></span></div>' : '';
  }
  window.OrgsEvento.alCambiar = function (ev) { var b = document.getElementById('nws-incompleto'); if (b) b.innerHTML = incompletoHtml(ev); };

  // DC-112: fila etiqueta | valor de la lista de datos (dt/dd); `extra` es el badge junto al valor.
  function dataRow(ic, lbl, val, extra) {
    return '<div class="nws-event-detail__row"><dt class="nws-event-detail__label">' + icon(ic) + lbl + '</dt>' +
      '<dd class="nws-event-detail__value"><span class="nwt-smalltext-font-bold">' + esc(val) + '</span>' + (extra || '') + '</dd></div>';
  }

  function varianteFoto(code) {
    var n = 0; code = String(code || ''); for (var i = 0; i < code.length; i++) n += code.charCodeAt(i);
    return ['', ' nws-ph--b', ' nws-ph--c'][n % 3];
  }

  /* La descripción del fixture trae una nota técnica entre paréntesis: no es texto de usuario. */
  function limpiarDesc(t) { return String(t || '').replace(/\s*\(descripción derivada[^)]*\)/i, ''); }
  // DC-035: "Volver" va fuera de la card, en su propia fila sobre el fondo de la página.
  function volverHtml() {
    return '<a class="nws-iconbtn nws-iconbtn--lg nws-event-detail__back" href="#/eventos" aria-label="Volver a eventos">' + icon('arrow-left') + '<span class="nws-event-detail__back-label">Volver</span></a>';
  }
  /* DC-114: mismo contador del landing (texto + chip con la cifra); el aria-label lleva la frase completa. */
  function contadorHtml(e, est) {
    var w, c, l;
    if (est === 'Próximo') { var d = dif(OLC.HOY, e.inicio); w = d === 1 ? 'Día que falta' : 'Días que faltan'; c = d; l = d === 1 ? '1 día que falta' : d + ' días que faltan'; }
    else if (est === 'En curso') { var a = dif(e.inicio, OLC.HOY) + 1, t = dif(e.inicio, e.fin) + 1; w = 'Día'; c = a + '/' + t; l = 'Día ' + a + ' de ' + t; }
    else return '';
    return '<span class="nws-event-detail__ctd" role="group" aria-label="' + l + '"><span class="nws-event-detail__ctd-w" aria-hidden="true">' + w + '</span><span class="nws-event-detail__ctd-n" aria-hidden="true">' + c + '</span></span>';
  }
  /* DC-107: el hero va entre el Volver y la barra de pestañas, una sola vez para todas las pestañas. */
  function heroHtml(data) {
    var e = data.evento, est = data.estado;
    return '<header class="nws-event-detail__head nws-ph' + varianteFoto(e.code || data.code || e.nombre) + '" aria-label="Encabezado del evento"><span class="nws-ph__tag">Foto del evento</span><div class="nws-event-detail__veil"></div>' +
      '<div class="nws-event-detail__hero-in">' +
      '<div class="nws-event-detail__titlebox"><div class="nws-event-detail__badges">' + (e.ciclo ? '<span class="nws-event-detail__cycle">Ciclo Olímpico</span>' : '') +
      '<span class="nws-event-detail__kind">' + esc(alcanceTxt(e).split(' · ')[0]) + '</span><span class="nws-event-detail__kind">' + esc(deporteTxt(e)) + '</span></div>' +
      '<h2 class="nws-event-detail__name">' + esc(e.nombre) + '</h2>' +
      (e.descripcion ? '<p class="nws-event-detail__lead">' + esc(limpiarDesc(e.descripcion)) + '</p>' : '') + '<div class="nws-event-detail__badges">' + contadorHtml(e, est) + '</div></div></div></header>';
  }
  /* Primera pestaña de todo evento: datos clave, sedes y gestor. */
  function informacionHtml(data) {
    var e = data.evento, est = data.estado;
    var h = '<div class="nws-event-detail__card"><dl class="nws-event-detail__list">' +
      dataRow('real-estate', 'Organismo', e.organismo) + dataRow('home', 'Alcance', alcanceTxt(e)) +
      dataRow('categories', 'Deportes', data.deportes.length === 1 ? data.deportes[0].nombre : 'Multideportivo · ' + data.deportes.length + ' deportes') +
      dataRow('calendar', 'Fecha de inicio', OLC.fechaCorta(e.inicio)) + dataRow('calendar', 'Fecha final', OLC.fechaCorta(e.fin), badgeEstado(est, true)) +
      dataRow('gps-pin', 'Lugar', e.lugar);
    if (e.sedes && e.sedes.length) {
      h += '<div class="nws-event-detail__row nws-event-detail__row--full"><dt class="nws-event-detail__label">' + icon('gps-pin-filled') + 'Sedes<span class="nws-event-detail__venues-count">' + e.sedes.length + '</span></dt>' +
        '<dd class="nws-event-detail__value"><ul class="nws-event-detail__venues-list" aria-label="Sedes del evento">' + e.sedes.map(function (s) { return '<li class="nws-event-detail__venue nwt-smalltext-font-regular">' + esc(s) + '</li>'; }).join('') + '</ul></dd></div>';
    }
    h += '<div class="nws-event-detail__row nws-event-detail__row--full"><dt class="nws-event-detail__label">' + icon('user') + 'Gestor asignado</dt>' +
      '<dd class="nws-event-detail__value"><div class="nws-event-detail__manager"><span class="nws-avatar" aria-hidden="true">' + esc(iniciales(e.gestor.nombre)) + '</span>' +
      '<div class="nws-event-detail__manager-meta"><span class="nwt-smalltext-font-bold">' + esc(e.gestor.nombre) + '</span><small class="nwt-caption-font-regular">' + esc(e.gestor.rol) + '</small></div></div></dd></div></dl></div>';
    return h;
  }

  function renderDetalle(route) {
    var data;
    try { data = OLC.datosDe(route.code); } catch (err) { data = null; }
    if (data && data.evento && !window.ROLES.puedeVer(data.evento)) data = null; // fuera de alcance = «no disponible», sin decir por qué
    if (!data || !data.evento) {
      setTop([{ t: 'Eventos', href: '#/eventos' }, { t: 'Evento no encontrado' }]);
      $main.innerHTML = '<div class="nws-page nws-event-detail"><div class="nws-empty nws-empty--page"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">Evento no disponible</h1>' +
        '<p class="nwt-smalltext-font-regular nws-muted">No pudimos abrir este evento. Puede que ya no exista o que no esté entre los que tienes disponibles.</p><a class="nws-btn" href="#/eventos">Volver a eventos</a></div></div>';
      return;
    }
    setTop([{ t: 'Eventos', href: '#/eventos' }, { t: data.evento.nombre }]);
    var flash = state.flash ? '<div class="nws-flash" role="status"><span>' + esc(state.flash) + '</span></div>' : ''; state.flash = null;
    var ev0 = data.evento, bar = '<div class="nws-event-detail__bar">' + volverHtml() + (ROL.edita ? '<a class="nws-newbtn nws-newbtn--ghost" href="#/eventos/' + encodeURIComponent(ev0.code) + '/editar">' + icon('edit') + '&nbsp;Editar evento</a>' : '') + '</div>';
    $main.innerHTML = '<div class="nws-page nws-event-detail">' + flash + bar + '<div id="nws-incompleto">' + incompletoHtml(ev0) + '</div>' +
      '<h1 class="nws-sr" id="nws-h1" tabindex="-1">' + esc(data.evento.nombre) + '</h1>' + heroHtml(data) +
      '<div class="nws-event-detail-tabs"><div class="nws-tabnav__sent" aria-hidden="true"></div>' +
      '<nav class="nws-tabnav" aria-label="Secciones del evento"><div class="nws-tabnav__row">' +
      '<div class="nws-event-detail-tabs__strip" id="nws-tabstrip"></div></div></nav>' +
      '<div class="nws-event-detail-tabs__panel" id="nws-panel" role="tabpanel" aria-label="Contenido de la sección"></div></div></div>';
    state.data = data;
    var strip = document.getElementById('nws-tabstrip');
    strip.innerHTML = '<nwt-tabs auto-width></nwt-tabs>';
    state.tabsEl = strip.firstChild;
    whenDefined('nwt-tabs', function () {
      state.tabsEl.items = visibleTabs(data).map(function (t) { return { id: t.id, label: t.label, value: t.id }; });
      state.tabsEl.value = currentTab(route);
      state.tabsEl.addEventListener('nwtChange', function (e) {
        var r = parseHash();
        if (e.detail !== currentTab(r)) location.hash = buildHash(r.code, merge(r.params, { tab: e.detail, modal: '' }));
      });
    });
    state.data = data;
    renderPanel(route);
    wireTabnav();
  }


  /* Barra de pestañas pegada: el centinela avisa cuándo el head la alcanza y entonces se marca is-stuck (sombra). */
  var tabnavIO = null, headRO = null, tabnavSync = null;
  function wireTabnav() {
    if (tabnavIO) { tabnavIO.disconnect(); tabnavIO = null; }
    var nav = document.querySelector('.nws-tabnav'), sent = document.querySelector('.nws-tabnav__sent'), hd = document.querySelector('.nws-head');
    if (!nav || !sent || !hd || !window.IntersectionObserver) return;
    var h = hd.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--nws-hh', h + 'px');
    tabnavIO = new IntersectionObserver(function (en) {
      var e = en[en.length - 1];
      nav.classList.toggle('is-stuck', !e.isIntersecting && e.boundingClientRect.top < (e.rootBounds ? e.rootBounds.top : h));
    }, { rootMargin: '-' + Math.ceil(h) + 'px 0px 0px 0px', threshold: [0, 1] });
    tabnavIO.observe(sent);
    if (!tabnavSync) {
      /* Un salto de scroll que pasa de largo el centinela no dispara el observer: este listener lo cubre. */
      tabnavSync = function () {
        var n = document.querySelector('.nws-tabnav'), s = document.querySelector('.nws-tabnav__sent'), d = document.querySelector('.nws-head');
        if (n && s && d) n.classList.toggle('is-stuck', s.getBoundingClientRect().top < d.getBoundingClientRect().height);
      };
      window.addEventListener('scroll', tabnavSync, { passive: true });
    }
    if (!headRO && window.ResizeObserver) {
      headRO = new ResizeObserver(function () { if (document.querySelector('.nws-tabnav')) wireTabnav(); });
      headRO.observe(hd);
    }
  }

  /* Pestañas visibles: Medallería solo si el evento ya empezó (Deportistas se quitó de la barra). */
  function visibleTabs(data) {
    var ev = data && data.evento, est = ev ? OLC.estado(ev) : null, clave = ev ? pestanaClave(ev) : null;
    var permitidas = ev ? window.ROLES.pestanasDe(ev) : [];
    var vis = TABS.filter(function (t) {
      if (!data) return true;
      if (permitidas.indexOf(t.id) < 0) return false;
      if (t.id === 'organizaciones') return ev.alcance === 'NACIONAL';
      if (t.id === 'boletines') return OLC.boletines(data).length > 0;
      if (t.id === 'medalleria') return est !== 'Próximo' && ev.alcance !== 'NACIONAL'; // el medallero compara países
      return true;
    }).map(function (t) {
      return t.id === 'calendario-resultados' ? { id: t.id, label: etiquetaCalendario(ev) } : t;
    });
    /* Información va primero y abre por defecto; el resto sigue el orden de la revisión COC según el estado (21 y 22). La clave solo se marca. */
    var ORD = { 'Finalizado': ['informacion', 'cargas', 'medalleria', 'deportes', 'organizaciones', 'inscripciones', 'calendario-resultados', 'boletines', 'metodologos', 'analitica'], 'En curso': ['informacion', 'cargas', 'calendario-resultados', 'deportes', 'organizaciones', 'inscripciones', 'medalleria', 'boletines', 'metodologos', 'analitica'] }[est];
    if (ORD && data) vis.sort(function (a, b) { return ORD.indexOf(a.id) - ORD.indexOf(b.id); });
    return vis.map(function (t) { return t.id === clave ? Object.assign({}, t, { clave: true }) : t; });
  }
  /* Qué sección importa según el momento del evento: pasó, está pasando o viene. */
  function pestanaClave(ev) {
    var est = OLC.estado(ev);
    return est === 'Finalizado' ? 'medalleria' : est === 'En curso' ? 'calendario-resultados' : 'inscripciones';
  }
  /* DC-043: un evento Próximo aún no tiene resultados, así que la pestaña solo dice «Calendario». */
  function etiquetaCalendario(ev) {
    return ev && OLC.estado(ev) === 'Próximo' ? 'Calendario' : 'Calendario y resultados';
  }
  /* El tab= explícito manda; si no existe o está oculto (medallería en Próximo) abre Información. */
  function currentTab(route) {
    var vis = visibleTabs(state.data), t = route.params.tab;
    if (vis.some(function (x) { return x.id === t; })) return t;
    return vis[0].id;
  }

  function renderPanel(route) {
    var panel = document.getElementById('nws-panel');
    var tab = currentTab(route);
    var data = state.data;
    var tabsRoot = panel;
    var before = document.activeElement && panel.contains(document.activeElement) ? pathOf(panel, document.activeElement) : null;
    var beforeTab = state.lastTab;
    state.lastTab = tab;
    var ui = (tabUi[route.code] = tabUi[route.code] || {});
    var ctx = {
      audience: 'platform', data: tab === 'deportes' || tab === 'calendario-resultados' ? OLC.soloColombia(data) : data, event: data.evento, params: route.params, ui: ui,
      go: function (patch) {
        var r = parseHash();
        var next = buildHash(r.code, merge(r.params, patch));
        if (next === location.hash) { renderPanel(parseHash()); } else { location.hash = next; }
      },
      href: function (patch) { var r = parseHash(); return buildHash(r.code, merge(r.params, patch)); }
    };
    panel.classList.toggle('is-info', tab === 'informacion');
    panel.setAttribute('aria-label', (visibleTabs(data).filter(function (t) { return t.id === tab; })[0] || {}).label);
    if (tab === 'informacion') {
      panel.innerHTML = informacionHtml(data);
    } else if (window.Tabs && window.Tabs[tab] && typeof window.Tabs[tab].render === 'function') {
      try { window.Tabs[tab].render(panel, ctx); } catch (err) {
        console.error('Tab «' + tab + '»', err);
        panel.innerHTML = '<div class="nws-reserved"><b>No se pudo mostrar esta sección</b><span>Intenta recargar la página.</span></div>';
      }
    } else if (tab === 'inscripciones') {
      panel.innerHTML = '<div class="nws-reserved"><b>Nominal</b></div>';
    } else {
      panel.innerHTML = '<div class="nws-reserved"><b>Sección en construcción</b><span>Esta sección aún no está disponible.</span></div>';
    }
    if (before && beforeTab === tab) {
      var el = resolve(tabsRoot, before);
      if (el && el.focus) el.focus({ preventScroll: true });
    }
  }

  /* DC-047: al cambiar de pestaña con las tabs pegadas, el scroll queda en el inicio del contenido (bajo head + tabnav). */
  function alInicioDelContenido() {
    var panel = document.getElementById('nws-panel'), hd = document.querySelector('.nws-head'), nav = document.querySelector('.nws-tabnav');
    if (!panel || !hd || !nav) return;
    var meta = panel.getBoundingClientRect().top + window.pageYOffset - hd.offsetHeight - nav.offsetHeight;
    if (window.pageYOffset > meta) window.scrollTo(0, Math.max(0, meta));
  }

  /* ---------- usuario en sesión ---------- */
  /* El cambio de rol vive en el marco de la demo (demo.html, panel «Configuraciones»); aquí solo se muestra quién está en sesión. */
  function renderRolSw() {
    document.getElementById('nws-rolsw').innerHTML = '<span class="nws-rolsw__btn nws-rolsw__btn--static"><span class="nws-rolsw__av" aria-hidden="true">' + esc(ROL.ini) + '</span>' +
      '<span class="nws-rolsw__who"><span class="nwt-smalltext-font-bold">' + esc(ROL.persona) + '</span><small class="nwt-caption-font-regular">' + esc(ROL.etiqueta) + '</small></span></span>';
  }

  /* El metodólogo no entra al módulo de eventos: ve un aviso, sin menú de eventos ni listado. */
  function renderMetodologo() {
    setTop([{ t: 'Eventos' }]);
    $main.innerHTML = '<div class="nws-page"><div class="nws-empty nws-empty--page"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">Este módulo no es para tu rol</h1>' +
      '<p class="nwt-smalltext-font-regular nws-muted">Como metodólogo calificas desde tu propia vista. Aquí no hay eventos que administrar.</p></div></div>';
    document.title = 'Eventos · Naowee Suite';
  }

  /* ---------- router ---------- */
  function render() {
    if (ROL.lista === 'ninguna') { $side.menus = []; renderMetodologo(); return; }
    var route = parseHash();
    syncMenu(route);
    var sameDetail = route.view === 'detalle' && state.view === 'detalle' && state.code === route.code && document.getElementById('nws-panel');
    if (sameDetail) {
      var cambioTab = state.lastTab !== currentTab(route);
      if (state.tabsEl && state.tabsEl.value !== currentTab(route)) state.tabsEl.value = currentTab(route);
      renderPanel(route);
      if (cambioTab) alInicioDelContenido();
      return;
    }
    var cambioVista = !(state.view === route.view && state.code === route.code);
    state.view = route.view; state.code = route.code; state.lastTab = null;
    if (route.view === 'detalle') renderDetalle(route); else if (route.view === 'nuevo') renderNuevo(); else if (route.view === 'editar') renderEditar(route); else if (route.view === 'deportistas' || route.view === 'perfil' || route.view === 'usuarios') renderDirectorio(route); else renderListado();
    if (cambioVista) {
      window.scrollTo(0, 0);
      var h1 = document.getElementById('nws-h1');
      if (h1 && state.focusReady) h1.focus({ preventScroll: true });
    }
    state.focusReady = true;
    document.title = (route.view === 'detalle' && state.data && state.data.evento ? state.data.evento.nombre : 'Eventos') + ' · Naowee Suite';
  }

  window.addEventListener('hashchange', render);
  renderRolSw();
  render();
})();
