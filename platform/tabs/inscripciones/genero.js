/* Componente: barras divergentes F | M por deporte, con mixtas como número. */
(function () {
  var C = window.NWIN, U = C.U, esc = C.esc, num = C.num, card = C.card, vacio = C.vacio, GCOL = C.GCOL, INICIAL = C.INICIAL, por = C.por;
  /* Barras divergentes F | M con el valor escrito; mixtas como número, no como tercer color. */
  function genero(c, ui) {
    var tot = c.tot, mix = tot.X + tot.U;
    if (!c.ins) return card('gen', por(c, { pasado: '¿Cómo se repartieron por género?', presente: '¿Cómo se reparten por género?' }), ['Participaciones según el género de la prueba, no deportistas.'], vacio('Sin datos disponibles', 'Todavía no hay participaciones de Colombia para repartir por género.'), '', 'nwtab-in-card--gen');
    var rows = c.deps.filter(function (s) { return s.ins; }).sort(function (a, b) { return b.ins - a.ins || a.nombre.localeCompare(b.nombre); });
    var W = Math.max.apply(null, rows.map(function (s) { return Math.max(s.F, s.M); }).concat([1]));
    var solo = function (k, o) { return rows.filter(function (s) { return s[k] > 0 && s[o] === 0 && s.X === 0 && s.U === 0; }).map(function (s) { return esc(s.nombre); }); };
    var sF = solo('F', 'M'), sM = solo('M', 'F'), paras = ['Participaciones según el género de la prueba, no deportistas · de mayor a menor.'];
    /* Nominal: no se lista «solo hombres / solo mujeres»; eso afirma que Colombia no está en las pruebas del otro género. */
    var tit = por(c, { pasado: '¿Cómo se repartieron por género?', presente: '¿Cómo se reparten por género?' });
    var items = [{ t: 'Femenino', n: tot.F, c: GCOL.F }, { t: 'Masculino', n: tot.M, c: GCOL.M }, { t: 'Mixtas', n: mix, c: 'var(--naotech-app-color-500)' }];
    var on = items.filter(function (i) { return i.n; }), alt = 'Participaciones por género: ' + on.map(function (i) { return i.n + ' ' + i.t.toLowerCase() + ' (' + C.pct(i.n, c.ins) + ' %)'; }).join(', ');
    /* Mismo patrón que la barra apilada de Medallería: total a la izquierda, barra y leyenda a su lado. */
    var resumen = '<div class="nwtab-in-sbar"><p class="nwtab-in-sbar__t"><b>' + num(c.ins) + '</b><span>Participaciones</span></p><div class="nwtab-in-sbar__m"><div class="nwtab-in-sbar__b" role="img" aria-label="' + esc(alt) + '">' +
      on.map(function (i) { return '<span style="flex:' + i.n + ' 1 0;background:' + i.c + '"></span>'; }).join('') + '</div><ul class="nwtab-in-sbar__lg">' +
      items.map(function (i) { return '<li><i class="nwtab-in-sbar__d" style="background:' + i.c + '" aria-hidden="true"></i><span>' + i.t + '</span><b>' + num(i.n) + '</b><small>(' + C.pct(i.n, c.ins) + ' %)</small></li>'; }).join('') + '</ul></div></div>';
    var cab = '<div class="nwtab-in-gr nwtab-in-gr--h" aria-hidden="true"><span class="l">← Femenino</span><span></span><span>Masculino →</span><span class="r">Mixtas</span></div>';
    var WX = Math.max.apply(null, rows.map(function (s) { return s.X + s.U; }).concat([1]));
    /* Misma escala por unidad en F, M y mixtas (--u): 1 mixta mide lo mismo que 1 femenina (DC-054). */
    var seg = function (n) { return n ? '<i style="width:calc(' + n + ' * var(--u))">' + n + '</i>' : ''; };
    var lista = '<ul class="nwtab-in-gl" style="--w:' + W + ';--x:' + WX + '" aria-label="Participaciones por género en cada deporte">' + rows.map(function (s) {
      var x = s.X + s.U;
      return '<li class="nwtab-in-gr"><span class="nwtab-in-gr__f">' + seg(s.F) + '</span><span class="nwtab-in-gr__n" title="' + esc(s.nombre) + '">' + esc(s.nombre) + '</span><span class="nwtab-in-gr__m">' + seg(s.M) + '</span><span class="r nwtab-in-gr__x" title="' + (x ? x + ' mixta' + (x > 1 ? 's' : '') : '') + '">' + seg(x) + '</span></li>';
    }).join('') + '</ul>';
    /* Mismo recorte que Medallería: filas en el DOM, fundido encima y el botón centrado debajo. */
    var clip = rows.length > INICIAL;
    lista = '<div class="nwtab-in-clipw' + (clip && !ui.gtodos ? ' is-clip' : '') + '"><div class="nwtab-in-clip">' + lista + '</div>' + (clip ? '<div class="nwtab-in-ov"><button type="button" class="nwtab-md-more" data-k="in-gmas" data-in-gmas="1" aria-expanded="' + !!ui.gtodos + '">' + (ui.gtodos ? 'Ver menos deportes' : 'Ver los ' + rows.length + ' deportes') + '</button></div>' : '') + '</div>';
    return card('gen', tit, [paras[0]], resumen, '', 'nwtab-in-card--gen') +
      card('gen-dep', 'Género por deporte', paras.slice(1).length ? paras.slice(1) : [paras[0]], '<div class="nwtab-in-gg__r" style="--w:' + W + ';--x:' + WX + '">' + cab + lista + '</div>', '', 'nwtab-in-card--gen');
  }
  C.genero = genero;
})();
