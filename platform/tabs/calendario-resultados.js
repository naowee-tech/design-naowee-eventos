/* Utilidades compartidas de las pestañas de la plataforma (se antepone a cada tab; idempotente). */
(function () {
  if (window.NWS) return;
  var SX = { F: 'Femenino', M: 'Masculino', X: 'Mixto' };
  var N = {};
  N.tip = function (b) {
    var t = document.querySelector('.nwtab-tip'); if (t) t.remove(); if (!b) return;
    t = document.createElement('div'); t.className = 'nwtab-tip'; t.setAttribute('role', 'tooltip'); t.textContent = b.getAttribute('data-tip'); document.body.appendChild(t);
    var r = b.getBoundingClientRect(), w = t.offsetWidth; t.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px'; t.style.top = Math.max(8, r.top - t.offsetHeight - 8) + 'px';
  };
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
  /* Chip de país: bandera (flagcdn) a la izquierda del código ISO-2; si la imagen falla, queda el código. */
  N.cc = function (iso, nombre) {
    if (!iso) return '';
    var b = OLC.bandera(iso, 20), t = N.esc(nombre || OLC.paisNombre(iso));
    return '<span class="nwtab-cc" title="' + t + '">' + (b ? '<img class="nwtab-cc__f" src="' + b.src + '" srcset="' + b.srcset + '" width="20" height="15" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : '') + '<span>' + N.esc(String(iso).toUpperCase()) + '</span></span>';
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
/* Pestaña Calendario y resultados (plataforma): filtros globales, mini calendario por jornada y ranking completo por prueba. */
(function () {
  var N = window.NWS, esc = N.esc;
  window.Tabs = window.Tabs || {};
  var MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var SEM = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  var SEM_N = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  var ICO_ALL = ['exp', 'con'].reduce(function (o, k) {
    o[k] = '<svg class="nwtab-i" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path d="' + (k === 'exp' ? 'M5 4.5l5 4 5-4M5 11.5l5 4 5-4' : 'M5 8.5l5-4 5 4M5 15.5l5-4 5 4') + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return o;
  }, {});

  function st(ctx) { var u = ctx.ui; u.cr = u.cr || { g: {}, p: {}, d: {}, prueba: '', ronda: '' }; return u.cr; }

  function pasa(p, ctx, ui, skip) {
    var pr = ctx.params;
    if (!N.sexOk(p, pr) || (N.colOn(pr, ctx.data) && !p.participa)) return false;
    if (skip !== 'deporte' && pr.deporte && p.deporte !== pr.deporte) return false;
    if (skip !== 'prueba' && ui.prueba && p.nombre !== ui.prueba) return false;
    if (ui.ronda && p.ronda !== ui.ronda) return false;
    return true;
  }
  function abiertaPorDefecto() { return false; } /* Revisión COC (2): el listado carga colapsado. */
  function pruebaAbierta(p, ui) { return p.id in ui.p ? ui.p[p.id] : abiertaPorDefecto(p); }
  function grupoAbierto(code, ui) { return code in ui.g ? ui.g[code] : false; } /* Revisión COC: todo carga colapsado. */

  /* Tira horizontal de jornadas: un cuadrado por día con competencias, agrupado por mes. */
  function calendario(ctx, dia, conPruebas) {
    var ev = ctx.data.evento, ini = ev.inicio, fin = ev.fin;
    var iso = function (d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
    var mesMas = function (s, n) { /* mes calendario con tope al último día del mes destino */
      var y = +s.slice(0, 4), m = +s.slice(5, 7) - 1 + n, d = +s.slice(8, 10), t = new Date(y, m + 1, 0);
      return iso(new Date(t.getFullYear(), t.getMonth(), Math.min(d, t.getDate()), 12));
    };
    var dias = [], cur = new Date(mesMas(ini, -1) + 'T12:00:00'), tope = mesMas(fin, 1), meses = [];
    while (iso(cur) <= tope) { dias.push(iso(cur)); cur.setDate(cur.getDate() + 1); }
    dias.forEach(function (d) { var k = d.slice(0, 7); if (meses.indexOf(k) < 0) meses.push(k); });
    var prevD = dia > ini ? iso(new Date(new Date(dia + 'T12:00:00').getTime() - 864e5)) : '', nextD = dia < fin ? iso(new Date(new Date(dia + 'T12:00:00').getTime() + 864e5)) : '';
    var chv = function (d) { return '<svg class="nwtab-i" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; };
    var flecha = function (k, lbl, d, path) { return '<button type="button" class="nwtab-btn nwtab-btn--i nwtab-stripw__b" data-k="' + k + '"' + (d ? ' data-dia="' + d + '"' : ' disabled') + ' aria-label="' + lbl + '" title="' + lbl + '">' + chv(path) + '</button>'; };
    return '<div class="nwtab-stripw">' + flecha('strip-prev', 'Día anterior', prevD, 'M12.5 4.5l-5 5.5 5 5.5') + '<div class="nwtab-strip">' + meses.map(function (k) {
      var m = +k.slice(5) - 1, y = +k.slice(0, 4);
      return '<div class="nwtab-strip__m" role="group" aria-label="' + MESES[m] + ' de ' + y + '"><div class="nwtab-strip__d">' + dias.filter(function (d) { return d.slice(0, 7) === k; }).map(function (iso) {
        var dt = new Date(iso + 'T12:00:00'), wd = SEM_N[(dt.getDay() + 6) % 7], tm = N.tiempoDia(iso);
        var colDia = false; /* Todo el evento es de Colombia: ni bandera ni color por país en la tira */
        var bd = colDia ? OLC.bandera('CO', 40) : null;
        var dot = colDia ? '<span class="nwtab-cal__band" aria-hidden="true">' + (bd ? '<img src="' + bd.src + '" srcset="' + bd.srcset + '" width="28" height="14" alt="" onerror="this.remove()">' : '') + '</span>' : '';
        var inner = '<span class="nwtab-cal__wd" aria-hidden="true">' + wd.slice(0, 3) + '</span><span class="nwtab-cal__mo" aria-hidden="true">' + MESES[dt.getMonth()].slice(0, 3).toLowerCase() + '</span><span class="nwtab-cal__n" aria-hidden="true">' + dt.getDate() + '</span>';
        if (iso < ini || iso > fin) return '<span class="nwtab-cal__d is-off" aria-hidden="true">' + inner + '</span>';
        var cls = 'nwtab-cal__d ' + (tm === 'Pasada' ? 'is-pas' : tm === 'Hoy' ? 'is-hoy' : 'is-fut') + (iso === dia ? ' is-sel' : '') + (conPruebas[iso] || colDia ? ' has' : '') + (colDia ? ' co' : '');
        return '<button type="button" class="' + cls + '" data-dia="' + iso + '" data-k="dia-' + iso + '"' + (iso === dia ? ' aria-current="date"' : '') + ' aria-pressed="' + (iso === dia) + '" aria-label="' + esc(OLC.fechaLarga(iso)) + ', ' + tm.toLowerCase() + (conPruebas[iso] ? ', con competencias' : ', sin competencias') + (colDia ? ', participan colombianos esta fecha' : '') + '"' + (colDia ? ' data-tip="Participan Colombianos esta fecha"' : '') + '>' + inner + dot + '</button>';
      }).join('') + '</div></div>';
    }).join('') + '</div>' + flecha('strip-next', 'Día siguiente', nextD, 'M7.5 4.5l5 5.5-5 5.5') + '</div>';
  }

  /* Filas y etiqueta de Colombia salen del modelo (OLC.resultadoFilas/colombianoEtiqueta); aquí solo se pintan. */
  function tieneRes(p) { return !!((p.filas && p.filas.length) || (p.tipo === 'match' && p.match)); }
  var MET = { oro: 'gold', plata: 'silver', bronce: 'bronze' };
  function puesto(f) {
    /* En una final los tres primeros llevan color aunque el dato no traiga la medalla. */
    var med = f.medalla || (f.premia !== false && f.puesto >= 1 && f.puesto <= 3 ? ['Oro', 'Plata', 'Bronce'][f.puesto - 1] : ''), m = f.premia !== false && med ? String(med).toLowerCase() : '';
    return '<span class="nwtab-pos">' + (m ? '<span class="nwtab-pm-m" title="' + esc(med) + '">' + OLC.medalla(MET[m], f.puesto, 34) + '</span><span class="nwtab-sr">' + esc(med) + '</span>' : '<span class="nwtab-pm nwtab-pm--n">' + f.puesto + '</span>') + '</span>';
  }
  function lado(l, gana, rev) {
    var co = l.pais === 'CO', cc = N.flag(l.pais, l.paisNombre), nm = '<span class="nwtab-dn">' + esc(l.nombre) + '</span>';
    return '<span class="nwtab-mt__s' + (rev ? ' nwtab-mt__s--b' : '') + (gana ? ' is-win' : '') + (co ? ' is-co' : '') + '">' + (cc + nm) + (gana ? '<span class="nwtab-sr"> (ganador)</span>' : '') + '</span>';
  }
  function filaMatch(f) {
    return '<div class="nwtab-mt' + (f.colombiano ? ' nwtab-mt--co' : '') + '" role="group" aria-label="Combate">' + lado(f.a, f.ganador === 'a', false) + '<b class="nwtab-mt__m">' + esc(f.marcador || 'vs') + '</b>' + lado(f.b, f.ganador === 'b', true) + '</div>';
  }
  function tablaPodio(p, completo) {
    var rows = OLC.resultadoFilas(p, completo ? p.filas.length : 5);
    if (rows[0] && rows[0].tipo === 'match') return '<div class="nwtab-mw">' + filaMatch(rows[0]) + '</div>';
    var h = '<div class="nwtab-tw"><table class="nwtab-tb nwtab-tb--res"><caption class="nwtab-sr">Resultado de ' + esc(p.nombre) + ', ' + esc(p.sexoNombre) + '</caption><thead><tr><th scope="col" class="nwtab-c1">Puesto</th><th scope="col">Deportista</th><th scope="col" class="nwtab-r">Marca</th></tr></thead><tbody>';
    rows.forEach(function (f) {
      if (f.tipo === 'separador') { h += '<tr class="nwtab-out"><td colspan="3"><span class="nwtab-sr">Colombianos fuera del top</span></td></tr>'; return; }
      var col = f.colombiano;
      h += '<tr' + (col ? ' class="nwtab-co"' : '') + '><td class="nwtab-c1">' + puesto(f) + '</td><td><span class="nwtab-dg">' + N.flag(f.pais, f.paisNombre) + '<span class="nwtab-dn">' + esc(f.deportista) + '</span>' +
        '</span></td><td class="nwtab-r"><span class="nwtab-mk">' + (esc(f.marca) || '—') + '</span></td></tr>';
    });
    return h + '</tbody></table></div>';
  }
  /* DC-200: botón que abre el resultado completo en un modal, sin cambiar la vista. */
  function verCompleto(p) {
    return '<button type="button" class="nwtab-lk nwtab-lk--res" data-k="vc-' + esc(p.id) + '" data-vc="' + esc(p.id) + '" aria-haspopup="dialog">Ver resultado completo</button>';
  }
  function cuerpo(p, ctx) { return tablaPodio(p) + (p.filas.length > 5 ? verCompleto(p) : ''); }
  /* DC-103: solo la mejor medalla de Colombia en la fase; sin medalla, nada. */
  function medallaFase(p) {
    var orden = ['Oro', 'Plata', 'Bronce'], mejor = '';
    (p.colombianos || []).forEach(function (c) { if (c.medalla && c.premia !== false && (!mejor || orden.indexOf(c.medalla) < orden.indexOf(mejor))) mejor = c.medalla; });
    if (!mejor) return '';
    var k = mejor.toLowerCase(), t = 'Medalla de ' + k + ' para Colombia';
    return '<span class="nwtab-mdl" role="img" title="' + t + '" aria-label="' + t + '">' + OLC.medalla({ oro: 'gold', plata: 'silver', bronce: 'bronze' }[k], 'none', 30) + '</span>';
  }
  function textoProg(p) { var n = (p.colombianos || []).length; return n ? (n === 1 ? '1 colombiano compite' : n + ' colombianos compiten') : ''; }

  /* DC-158: calendario 16px a la derecha de «Programado». */
  var ICO_CAL = '<svg class="nwtab-st__ic" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false"><rect x="3" y="4.5" width="14" height="12.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 8.5h14M7 2.5v3.5M13 2.5v3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  function prueba(p, ctx, ui) {
    var est = N.estadoPrueba(p), conRes = est !== 'Programado' && tieneRes(p);
    var sub = [p.ronda, p.escenario].filter(Boolean).map(esc).join(' · ');
    var cop = !conRes && est !== 'Programado' ? OLC.colombiaEtiqueta(p) : ''; /* DC-130: programada sin chip */
    /* DC-026: caja con el nombre + columna (género arriba, "Fase · sede" con elipsis debajo). */
    var tit = '<span class="nwtab-tg__t"><b class="nwtab-tg__nm">' + esc(p.nombre) + '</b><span class="nwtab-tg__mt"><span class="nwtab-pn">' + N.sexTag(p.sexo) + (cop ? '<span class="nwtab-cop">' + esc(cop) + '</span>' : '') + '</span>' + (sub ? '<span class="nwtab-sub nwtab-tg__sb" title="' + sub + '">' + sub + '</span>' : '') + '</span></span>';
    /* Programada: solo la cabecera, sin bloque de resultados ni colapsable. */
    if (!conRes) return '<article class="nwtab-pr nwtab-pr--prog"><header class="nwtab-pr__hd"><div class="nwtab-tg nwtab-tg--st">' + tit + '</div><div class="nwtab-pr__ac"><span class="nwtab-st nwtab-st--prog">' + N.esc(est) + ICO_CAL + '</span></div></header></article>';
    var abierta = pruebaAbierta(p, ui), id = 'nwtab-r-' + p.id;
    /* El cuerpo se pinta al abrir: con cientos de fases por día el render inicial va colapsado. */
    return '<article class="nwtab-pr' + (abierta ? ' is-open' : '') + '"><header class="nwtab-pr__hd"><button type="button" class="nwtab-tg" data-pr="' + esc(p.id) + '" data-k="pr-' + esc(p.id) + '" aria-expanded="' + abierta + '" aria-controls="' + id + '">' + tit + '<span class="nwtab-pr__ac">' + medallaFase(p) + N.badge(est) + '</span>' + N.ico('chev').replace('nwtab-i', 'nwtab-i nwtab-chev nwtab-chev--s') + '</button></header>' +
      '<div class="nwtab-pr__bd" id="' + id + '"' + (abierta ? '>' + cuerpo(p, ctx) : ' hidden>') + '</div></article>';
  }

  function resumenGrupo(ps) {
    var fin = ps.filter(function (p) { return N.estadoPrueba(p) === 'Finalizado'; }).length;
    var s = '<span class="nwtab-tag">' + ps.length + (ps.length === 1 ? ' prueba' : ' pruebas') + '</span>';
    if (fin) s += '<span class="nwtab-tag nwtab-tag--done">' + fin + (fin === 1 ? ' finalizada' : ' finalizadas') + '</span>';
    return s;
  }

  /* Grupos de deporte de un conjunto de pruebas; `pref` prefija la clave de estado abierto/cerrado. */
  function grupos(ps, ctx, ui, pref) {
    var by = {}; ps.forEach(function (p) { (by[p.deporte] = by[p.deporte] || []).push(p); });
    var h = '';
    ctx.data.deportes.forEach(function (d) {
      var gp = by[d.codigo]; if (!gp) return;
      var key = pref + d.codigo, ab = grupoAbierto(key, ui), gid = 'nwtab-g-' + (pref ? pref.replace('|', '-') : '') + d.codigo;
      h += '<section class="nwtab-gr"><h3 class="nwtab-gh"><button type="button" class="nwtab-gb" data-gr="' + key + '" data-k="gr-' + key + '" aria-expanded="' + ab + '" aria-controls="' + gid + '">' + N.ico('chev').replace('nwtab-i', 'nwtab-i nwtab-chev') +
        '<span class="nwtab-gb__i">' + N.depIco(d.codigo) + '</span><span class="nwtab-gb__t"><span class="nwtab-gb__n">' + esc(d.nombre) + '</span><span class="nwtab-gb__e">' + esc(d.escenario) + '</span></span><span class="nwtab-gs">' + resumenGrupo(gp) + '</span></button></h3>' +
        '<div class="nwtab-gr__bd" id="' + gid + '"' + (ab ? '>' + gp.map(function (p) { return prueba(p, ctx, ui); }).join('') : ' hidden>') + '</div></section>';
    });
    return h;
  }

  /* Jornada seleccionada por defecto: hoy si cae dentro del evento; si no, la más cercana a hoy. */
  function diaSel(data, dia) {
    if (dia && data.dias.indexOf(dia) >= 0) return dia;
    var best = data.dias[0], bd = Infinity;
    data.dias.forEach(function (d) { var x = Math.abs(N.dif(OLC.HOY, d)); if (x < bd) { bd = x; best = d; } });
    return best;
  }

  var SEXOS = { F: 'Femenino', M: 'Masculino', X: 'Mixto' };
  /* DC-097: título a la izquierda como los otros filtros, interruptor a la derecha de la misma fila. */
  /* Sin interruptor: el calendario ya trae solo pruebas con Colombia (OLC.soloColombia). */
  function colSwitch(params, data) {
    return '';
    var on = N.colOn(params, data); /* ausente = encendido; 0 = apagado */
    return '<div class="nwtab-fld nwtab-fld--sw"><span class="nwtab-lbl nwtab-lbl--2l" id="nwtab-col-l"><span>Solo pruebas</span> <span>con Colombianos</span></span><button type="button" class="nwtab-sw" role="switch" aria-checked="' + on + '" aria-labelledby="nwtab-col-l" data-k="col" data-col="' + (on ? '0' : '') + '"><span class="nwtab-sw__t" aria-hidden="true"><i></i></span></button></div>';
  }
  function selectHtml(id, label, val, opts) {
    return '<label class="nwtab-fld"><span class="nwtab-lbl">' + label + '</span><select class="nwtab-sel" data-k="' + id + '" data-sel="' + id + '">' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === val ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>';
  }

  /* DC-200: modal del resultado completo; reutiliza tablaPodio y el encabezado del detalle. */
  var modal = null;
  function cerrarModal(devolver) {
    var m = modal; if (!m) return; modal = null;
    document.documentElement.style.overflow = m.prev;
    m.dlg.removeEventListener('close', m.onClose);
    if (m.dlg.open) m.dlg.close();
    m.dlg.remove();
    if (devolver) { var t = document.querySelector('[data-k="vc-' + m.id + '"]') || document.querySelector('.nwtab-tg'); if (t) t.focus({ preventScroll: true }); }
  }
  function abrirModal(el, ctx, p) {
    cerrarModal(false);
    var est = N.estadoPrueba(p), dlg = document.createElement('dialog');
    dlg.className = 'nwtab-md'; dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-labelledby', 'nwtab-md-t');
    dlg.innerHTML = '<div class="nwtab-md__hd"><div class="nwtab-md__tt"><h2 class="nwtab-h nwtab-h--lg" id="nwtab-md-t">' + esc(p.nombre) + ' ' + N.sexTag(p.sexo) + ' ' + N.badge(est) + '</h2><p class="nwtab-sub">' + [p.ronda, p.escenario, OLC.fechaLarga(p.fecha)].filter(Boolean).map(esc).join(' · ') + '</p></div>' +
      '<button type="button" class="nwtab-md__x" data-md-x="1" aria-label="Cerrar">' + '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>' +
      '<div class="nwtab-md__bd">' + (tieneRes(p) && est !== 'Programado' ? tablaPodio(p, true) : '<div class="nwtab-emptyb"><b>Esta prueba aún no tiene resultados.</b></div>') + '</div>';
    var m = modal = { dlg: dlg, id: p.id, prev: document.documentElement.style.overflow };
    m.onClose = function () { /* Esc: el navegador ya lo cerró */
      var limpiar = ctx.params.prueba; cerrarModal(true);
      if (limpiar && history.replaceState) { history.replaceState(null, '', ctx.href({ prueba: '' })); ctx.params.prueba = ''; }
    };
    dlg.addEventListener('close', m.onClose);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.querySelector('[data-md-x]').addEventListener('click', function () { dlg.close(); });
    el.appendChild(dlg);
    document.documentElement.style.overflow = 'hidden';
    dlg.showModal();
    dlg.querySelector('[data-md-x]').focus({ preventScroll: true });
  }
  function bindVer(root, ctx, el) {
    root.querySelectorAll('[data-vc]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = ctx.data.pruebas.filter(function (x) { return x.id === b.getAttribute('data-vc'); })[0];
        if (p) abrirModal(el, ctx, p);
      });
    });
  }

  function render(el, ctx) {
    cerrarModal(false);
    var ui = st(ctx), data = ctx.data, pr = ctx.params;
    var dia = diaSel(data, pr.dia);
    /* Filtros en cascada (Deporte → Prueba → Género → Ronda): cada lista sale de lo elegido antes y lo que deja de existir se limpia solo. */
    var uniq = function (arr, f) { return arr.reduce(function (o, p) { var v = f(p); if (v && o.indexOf(v) < 0) o.push(v); return o; }, []); };
    var P0 = data.pruebas.filter(function (p) { return !(N.colOn(pr, data) && !p.participa); });
    var deps = data.deportes.filter(function (d) { return P0.some(function (p) { return p.deporte === d.codigo; }); });
    var P1 = P0.filter(function (p) { return !pr.deporte || p.deporte === pr.deporte; });
    var nombres = uniq(P1, function (p) { return p.nombre; }).sort(function (a, b) { return a.localeCompare(b, 'es', { numeric: true }); });
    if (nombres.length < 2 || nombres.indexOf(ui.prueba) < 0) ui.prueba = '';
    var P2 = P1.filter(function (p) { return !ui.prueba || p.nombre === ui.prueba; });
    var sexos = ['F', 'M', 'X'].filter(function (s) { return P2.some(function (p) { return p.sexo === s; }); });
    if (pr.sexo && (sexos.length < 2 || sexos.indexOf(pr.sexo) < 0)) {
      ctx.params.sexo = '';
      try { history.replaceState(null, '', ctx.href({ sexo: '' })); } catch (e) { /* sin historial: la vista ya lo ignora */ }
    }
    var P3 = P2.filter(function (p) { return !pr.sexo || p.sexo === pr.sexo; });
    var rondas = uniq(P3, function (p) { return p.ronda; });
    if (rondas.length < 2 || rondas.indexOf(ui.ronda) < 0) ui.ronda = '';
    var base = data.pruebas.filter(function (p) { return pasa(p, ctx, ui); });
    var conPruebas = {}; base.forEach(function (p) { conPruebas[p.fecha] = 1; });

    var ctrl = colSwitch(pr, data) + (deps.length > 1 ? selectHtml('f-dep', 'Deporte', pr.deporte || '', [['', 'Todos los deportes']].concat(deps.map(function (d) { return [d.codigo, d.nombre]; }))) : '') +
      (nombres.length > 1 ? selectHtml('f-pru', 'Prueba', ui.prueba, [['', 'Todas las pruebas']].concat(nombres.map(function (n) { return [n, n]; }))) : '') +
      (sexos.length > 1 ? selectHtml('f-sex', 'Género', pr.sexo || '', [['', 'Todos']].concat(sexos.map(function (s) { return [s, SEXOS[s]]; }))) : '') +
      (rondas.length > 1 ? selectHtml('f-ron', 'Ronda', ui.ronda, [['', 'Todas las rondas']].concat(rondas.map(function (r) { return [r, r]; }))) : '');
    var hayFiltro = !!(pr.sexo || pr.deporte || ui.prueba || ui.ronda), colOn = N.colOn(pr, data);
    /* DC-101: siempre pintado (deshabilitado sin filtros) para que el panel no cambie de alto. */
    var hayAlgo = hayFiltro || !!pr.q;
    if (ctrl) ctrl += '<div class="nwtab-clr"><button type="button" class="nwtab-btn nwtab-btn--clr" data-k="clr-all" data-clr-all="1"' + (hayAlgo ? '' : ' disabled aria-disabled="true"') + '><i class="naotech-icon-refresh" aria-hidden="true"></i>Limpiar filtros</button></div>';

    var main = '';
    if (!base.length) {
      main = '<div class="nwtab-emptyb"><b>Ninguna competencia coincide con los filtros.</b><span>' + (hayFiltro ? 'Pruebe con otros criterios o restablézcalos.' : 'Este evento aún no tiene competencias con Colombia.') + '</span>' + (hayFiltro ? '<button type="button" class="nwtab-btn" data-k="clr" data-clr="1">Limpiar filtros</button>' : '') + '</div>';
    } else {
      var acciones = '<div class="nwtab-all" role="group" aria-label="Pruebas de la jornada">' + [['exp', 'Expandir todo', 1], ['con', 'Contraer todo', 0]].map(function (x) {
        return '<button type="button" class="nwtab-btn" data-k="all-' + x[0] + '" data-all="' + x[2] + '" aria-label="' + x[1] + '">' + ICO_ALL[x[0]] + '<span class="nwtab-all__t">' + x[1] + '</span></button>';
      }).join('') + '</div>';
      var delDia = base.filter(function (p) { return p.fecha === dia; }), t = N.tiempoDia(dia);
      main = '<div class="nwtab-dayh"><div><h2 class="nwtab-h nwtab-h--lg">' + esc(OLC.fechaLarga(dia)) + ' ' + N.tiempoBadge(t) + '</h2>' + (t === 'Próxima' ? '<p class="nwtab-sub">' + N.faltan(dia) + '</p>' : '') + '</div>' + (delDia.length ? acciones : '') + '</div>';
      if (delDia.length) main += grupos(delDia, ctx, ui, '');
      else {
        /* DC-112: el vacío del día queda solo con su texto, sin botones. */
        main += '<div class="nwtab-emptyb"><b>Colombia no compite este día.</b></div>';
      }
    }

    var h = '<section class="nwtab-tab nwtab-calres" aria-label="Calendario y resultados">' +
      '<aside class="nwtab-cr__cal" aria-label="Jornadas del evento">' + calendario(ctx, dia, conPruebas) + '</aside>' +
      '<div class="nwtab-cr">' + (ctrl ? '<div class="nwtab-cr__side"><div class="nwtab-bar nwtab-bar--one"><div class="nwtab-bar__r1">' + ctrl + '</div></div></div>' : '') + '<div class="nwtab-cr__main">' + main + '</div></div></section>';
    el.innerHTML = h;
    bind(el, ctx, ui, base.filter(function (p) { return p.fecha === dia; }));
    centrarTira(el);
    compactarTira(el);
    /* Compatibilidad: ?prueba=<id> abre el modal sobre el calendario. */
    var dp = pr.prueba && data.pruebas.filter(function (x) { return x.id === pr.prueba; })[0];
    if (dp) abrirModal(el, ctx, dp);
  }

  /* DC-062: el día elegido queda centrado en la tira (solo scroll horizontal). */
  function centrarTira(el) {
    var tira = el.querySelector('.nwtab-strip'), sel = tira && tira.querySelector('.is-sel'); if (!sel) return;
    var r = sel.getBoundingClientRect(), t = tira.getBoundingClientRect();
    tira.scrollLeft += (r.left + r.width / 2) - (t.left + t.width / 2);
  }

  /* DC-053: al pegarse, la tira pasa a is-stuck (compacta, ancho completo) como en el landing; centinela + IntersectionObserver. */
  function compactarTira(el) {
    if (el._nwtabCalOff) el._nwtabCalOff();
    var cal = el.querySelector('.nwtab-cr__cal'), sec = cal && cal.parentNode;
    if (!cal || !window.IntersectionObserver) return;
    var sent = document.createElement('div'); sent.className = 'nwtab-cal-sent'; sent.setAttribute('aria-hidden', 'true'); sec.insertBefore(sent, cal);
    var io = null;
    var mide = function () { /* alturas llena y compacta: el offset de filtros y el hueco de la tira dependen de ellas */
      var v = cal.classList.contains('is-stuck'); cal.classList.remove('is-stuck');
      var full = cal.offsetHeight; cal.classList.add('is-stuck'); var c = cal.offsetHeight;
      cal.classList.toggle('is-stuck', v);
      sec.style.setProperty('--nwtab-cal-full', full + 'px'); sec.style.setProperty('--nwtab-cal-h', c + 'px');
    };
    var centra = function () { centrarTira(el); };
    var fija = function (v) { if (cal.classList.contains('is-stuck') !== v) { cal.classList.toggle('is-stuck', v); centra(); } };
    var ro = null, ancho = el.clientWidth;
    var limpia = function () { if (io) window.removeEventListener('scroll', io); io = null; if (ro) ro.disconnect(); ro = null; window.removeEventListener('resize', arma); delete el._nwtabCalOff; };
    function arma() {
      if (io) window.removeEventListener('scroll', io); io = null;
      if (!el.contains(cal)) return limpia();
      var off = parseFloat(getComputedStyle(cal).top);
      if (getComputedStyle(cal).position !== 'sticky' || isNaN(off)) { fija(false); return; }
      mide();
      fija(sent.getBoundingClientRect().bottom <= off);
      io = function () { fija(sent.getBoundingClientRect().bottom <= off); }; /* scroll directo: el observer se salta los saltos rápidos */
      window.addEventListener('scroll', io, { passive: true });
    }
    window.addEventListener('resize', arma);
    /* Contraer el menú cambia el ancho útil sin evento resize: rearma para que la tira no quede pegada a medias. */
    if (window.ResizeObserver) { ro = new ResizeObserver(function () { if (el.clientWidth !== ancho) { ancho = el.clientWidth; arma(); } }); ro.observe(el); }
    el._nwtabCalOff = limpia;
    arma();
  }

  function bind(el, ctx, ui, visibles) {
    N.bindBar(el, ctx); N.bindLinks(el, ctx); bindVer(el, ctx, el); N.tip(null);
    var again = function (key) { window.Tabs['calendario-resultados'].render(el, ctx); N.refocus(key); };
    var on = function (sel, ev, fn) { el.querySelectorAll(sel).forEach(function (b) { b.addEventListener(ev, function (e) { fn(b, e); }); }); };
    /* DC-172: tooltip fijo (la tira recorta el overflow); hover y foco del día con Colombia. */
    on('[data-tip]', 'mouseenter', function (b) { N.tip(b, true); }); on('[data-tip]', 'focus', function (b) { N.tip(b, true); });
    on('[data-tip]', 'mouseleave', function () { N.tip(null); }); on('[data-tip]', 'blur', function () { N.tip(null); });
    on('[data-dia]', 'click', function (b) {
      var iso = b.getAttribute('data-dia');
      var k = b.getAttribute('data-k'), ev = ctx.data.evento;
      /* Una flecha que queda deshabilitada en el extremo cede el foco al día elegido. */
      if ((k === 'strip-prev' && iso <= ev.inicio) || (k === 'strip-next' && iso >= ev.fin)) k = 'dia-' + iso;
      N.go(ctx, { dia: iso }, k);
    });
    var q = function (k) { return el.querySelector('[data-sel="' + k + '"]'); };
    if (q('f-sex')) q('f-sex').addEventListener('change', function (e) { N.go(ctx, { sexo: e.target.value }, 'f-sex'); });
    if (q('f-dep')) q('f-dep').addEventListener('change', function (e) { N.go(ctx, { deporte: e.target.value }, 'f-dep'); });
    if (q('f-pru')) q('f-pru').addEventListener('change', function (e) { ui.prueba = e.target.value; again('f-pru'); });
    if (q('f-ron')) q('f-ron').addEventListener('change', function (e) { ui.ronda = e.target.value; again('f-ron'); });
    on('[data-gr]', 'click', function (b) { var c = b.getAttribute('data-gr'); ui.g[c] = !grupoAbierto(c, ui); again(b.getAttribute('data-k')); });
    on('[data-pr]', 'click', function (b) {
      var p = ctx.data.pruebas.filter(function (x) { return x.id === b.getAttribute('data-pr'); })[0];
      var ab = ui.p[p.id] = !pruebaAbierta(p, ui), art = b.closest('.nwtab-pr'), bd = art.querySelector('.nwtab-pr__bd');
      if (ab && !bd.firstChild) { bd.innerHTML = cuerpo(p, ctx); N.bindLinks(bd, ctx); bindVer(bd, ctx, el); }
      b.setAttribute('aria-expanded', ab); art.classList.toggle('is-open', ab); bd.hidden = !ab;
    });
    on('[data-all]', 'click', function (b) {
      var v = b.getAttribute('data-all') === '1';
      el.querySelectorAll('[data-gr]').forEach(function (x) { ui.g[x.getAttribute('data-gr')] = v; });
      visibles.forEach(function (p) { ui.p[p.id] = v; }); /* también las de grupos cerrados */
      again(b.getAttribute('data-k'));
    });
    /* DC-101: restablece filtros (no dia ni tab); si queda deshabilitado, el foco pasa al primer control. */
    on('[data-clr-all]', 'click', function () {
      var sc = window.scrollY; ui.prueba = ''; ui.ronda = '';
      ctx.go({ deporte: '', prueba: '', sexo: '', q: '', colombia: '' });
      var n = 0, f = function () {
        var r = document.querySelector('.nwtab-calres [data-k="clr-all"]');
        if (!r) { if (n++ < 20) setTimeout(f, 30); return; }
        var t = r.disabled ? document.querySelector('.nwtab-calres .nwtab-cr__side [data-k="col"], .nwtab-calres .nwtab-cr__side select') : r;
        if (t) t.focus({ preventScroll: true });
        if (Math.abs(window.scrollY - sc) > 1) window.scrollTo(window.scrollX, sc);
      };
      setTimeout(f, 30);
    });
    on('[data-clr]', 'click', function () { ui.prueba = ''; ui.ronda = ''; N.go(ctx, { sexo: '', colombia: '', deporte: '' }, 'clr'); });
  }

  window.Tabs['calendario-resultados'] = { render: render };
})();
