/* Pestaña Nominal (plataforma; antes «Inscripciones»): solo lo de Colombia (KPIs, cupos, jornada+tipo, género, por deporte) y la nómina al final. No registra deportes ni pruebas sin Colombia. */
(function () {
  window.Tabs = window.Tabs || {};
  var C = window.NWIN, U = C.U, esc = C.esc, num = C.num, plural = C.plural;

  function icon(kind) {
    var p = {
      user: '<circle cx="10" cy="6.5" r="3.2"/><path d="M3.5 17c.6-3.4 3.2-5 6.5-5s5.9 1.6 6.5 5"/>',
      globe: '<circle cx="10" cy="10" r="7.5"/><path d="M2.5 10h15M10 2.5c-2.4 2.4-2.4 12.6 0 15M10 2.5c2.4 2.4 2.4 12.6 0 15"/>',
      star: '<path d="M10 2.5l2.3 4.8 5.2.7-3.8 3.6.9 5.2L10 14.3l-4.6 2.5.9-5.2L2.5 8l5.2-.7z"/>',
      list: '<path d="M7 5h10M7 10h10M7 15h10M3 5h.01M3 10h.01M3 15h.01"/>'
    };
    return '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p[kind] + '</svg>';
  }

  function kpi(kind, val, label, hint) {
    return '<article class="nwtab-in-kpi"><header class="nwtab-in-kpi__h"><span class="nwtab-in-kpi__i nwtab-in-kpi__i--' + kind + '">' + icon(kind === 'a' ? 'user' : kind === 'b' ? 'list' : kind === 'c' ? 'star' : 'list') + '</span><small class="nwtab-in-kpi__hint">' + esc(hint) + '</small></header><strong class="nwtab-in-kpi__v">' + val + '</strong><span class="nwtab-in-kpi__l">' + esc(label) + '</span></article>';
  }

  /* Nominal: cada KPI es de Colombia y nombra su unidad. Sin países, sin «de N del evento». */
  function kpis(c, data) {
    var real = data.evento && data.evento.real, oficial = real && data.colombia && data.colombia.atletas;
    var h = '<div class="nwtab-in-kpis">' +
      kpi('a', num(c.deportistas), 'Deportistas', 'Nominal de Colombia') +
      kpi('c', num(c.deps.length), 'Deportes', 'Con deportistas de Colombia') +
      kpi('d', num(c.pruebasCol), 'Pruebas', 'Con deportistas de Colombia') +
      kpi('b', num(c.ins), 'Participaciones', 'Un deportista en una prueba') + '</div>';
    if (oficial && oficial > c.deportistas) h += '<p class="nwtab-in-note">Se reportan ' + num(oficial) + ' atletas; acá se cuentan los ' + num(c.deportistas) + ' que figuran en las pruebas cargadas.</p>';
    return h;
  }

  function render(el, ctx) {
    var data = ctx.data, ui = ctx.ui.ins = ctx.ui.ins || {}, c = C.calc(data), h;
    if (!(data.pruebas || []).length) {
      el.innerHTML = '<section class="nwtab-tab nwtab-ins-root" aria-label="Nominal"><div class="nwtab-emptyb nwtab-emptyb--lg"><b>Sin datos disponibles</b><span>Este evento todavía no tiene pruebas publicadas.</span></div></section>';
      return;
    }
    h = '<section class="nwtab-tab nwtab-ins-root" aria-label="Nominal"><p class="nwtab-in-lead">Nominal: los deportistas de Colombia en este evento, con los deportes y pruebas en que participan y su avance por jornada.</p>' + kpis(c, data) + C.cupos(c) +
      '<div class="nwtab-in-row nwtab-in-row--a">' + C.jornada(c, ui) + C.tipo(c) + '</div>' + C.genero(c, ui) +
      C.deportes(c, ui) + C.tabla.render(c, ui, data) + '</section>';
    el.innerHTML = h;
    C.cerrarInfo();
    function again(key) { window.Tabs['inscripciones'].render(el, ctx); U().refocus(key); }
    el.querySelectorAll('[data-in-modo]').forEach(function (b) { b.addEventListener('click', function () { ui.modo = b.getAttribute('data-in-modo'); again(b.getAttribute('data-k')); }); });
    el.querySelectorAll('[data-in-orden]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-in-orden'), def = { dep: 'asc', ath: 'desc', ins: 'desc', cob: 'asc' }, cur = ui.ordenD || def[ui.orden || 'ins']; ui.ordenD = ui.orden === k || (!ui.orden && k === 'ins') ? (cur === 'asc' ? 'desc' : 'asc') : def[k]; ui.orden = k; again(b.getAttribute('data-k')); }); });
    el.querySelectorAll('[data-in-filtro]').forEach(function (b) { b.addEventListener('click', function () { ui.filtro = b.getAttribute('data-in-filtro'); again(b.getAttribute('data-k')); }); });
    var g = el.querySelector('[data-in-gmas]'); if (g) g.addEventListener('click', function () { ui.gtodos = !ui.gtodos; again('in-gmas'); });
    C.tabla.bind(el, ui, data, c);
  }

  window.Tabs['inscripciones'] = { render: render, calc: C.calc };
  window.NWTAB_INSCRIPCIONES = window.Tabs['inscripciones'];
})();
