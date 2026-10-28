/* Componente: individuales vs. de equipo y de dónde salen. */
(function () {
  var C = window.NWIN, num = C.num, card = C.card, vacio = C.vacio, por = C.por;
  /* Equipo = participaciones a nombre de «Colombia (…)»; se separa conjunto de relevos y dobles. */
  function tipo(c) {
    var tot = c.ins, eq = c.insEq, ind = tot - eq, cuerpo;
    var conjEq = c.deps.reduce(function (a, s) { return a + (s.conj ? s.eq : 0); }, 0), otros = eq - conjEq;
    if (!tot) return card('tipo', 'Participaciones según deportes', ['Participaciones de Colombia en pruebas.'], vacio('Sin datos disponibles', 'Todavía no hay participaciones de Colombia para clasificar.'), '', 'nwtab-in-card--tipo');
    cuerpo = '<div class="nwtab-in-tp"><div class="nwtab-in-tp__b" role="img" aria-label="' + ind + ' participaciones individuales y ' + eq + ' de equipo"><i class="is-ind" style="flex:' + ind + '"></i>' + (eq ? '<i class="is-eq" style="flex:' + eq + '"></i>' : '') + '</div>' +
      '<div class="nwtab-in-tp__k"><span><i class="is-ind"></i><b>' + num(ind) + '</b> individuales</span><span><i class="is-eq"></i><b>' + num(eq) + '</b> de equipo</span></div></div>' +
      (eq ? '<table class="nwtab-in-mini"><caption>De dónde salen las ' + num(eq) + ' de equipo</caption><tbody><tr><th scope="row">Deportes de conjunto</th><td>' + num(conjEq) + '</td></tr><tr><th scope="row">Relevos y dobles</th><td>' + num(otros) + '</td></tr></tbody></table>' : '');
    return card('tipo', 'Participaciones según deportes', ['Participaciones de Colombia en pruebas · ' + num(tot) + ' en total.', 'Individual o conjunto se deduce por el nombre del deporte.'], cuerpo, '', 'nwtab-in-card--tipo');
  }
  C.tipo = tipo;
})();
