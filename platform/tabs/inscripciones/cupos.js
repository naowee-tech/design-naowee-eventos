/* Componente: ¿Cuántos cupos se usaron? Un cuadro por cupo (barra si son más de 40). */
(function () {
  var C = window.NWIN, num = C.num, pct = C.pct, card = C.card, vacio = C.vacio, por = C.por;
  /* Hasta 40 cupos se dibujan uno por cuadro (contables); más que eso, barra continua. */
  function cupos(c) {
    var n = c.deportistas, tot = Math.ceil(n * 1.15 / 10) * 10, libres = tot - n, p = pct(n, tot), cuerpo, i, cs = '';
    if (!n) return card('cupos', por(c, { pasado: '¿Cuántos cupos se usaron?', presente: '¿Cuántos cupos se han usado?', futuro: '¿Cuántos cupos se han usado hasta ahora?' }), ['Deportistas de Colombia frente al límite de cupos del evento.'], vacio('Sin datos disponibles', 'Todavía no hay deportistas de Colombia en la nominal.'));
    if (tot <= 40) { for (i = 0; i < tot; i++) cs += '<i class="' + (i < n ? 'is-on' : '') + '"></i>'; }
    cuerpo = '<div class="nwtab-in-cu"><p class="nwtab-in-cu__lead"><strong>' + num(n) + '</strong><span>de ' + num(tot) + ' cupos</span></p><div class="nwtab-in-cu__m">' +
      (tot <= 40 ? '<div class="nwtab-in-sq" role="img" aria-label="' + n + ' de ' + tot + ' cupos usados, ' + libres + ' sin usar" style="grid-template-columns:repeat(' + tot + ',minmax(0,1fr))">' + cs + '</div>'
        : '<div class="nwtab-in-bar" role="img" aria-label="' + p + ' % de los cupos usados"><span style="width:' + p + '%"></span></div>') +
      '<p class="nwtab-in-cu__ft"><strong>' + num(libres) + (c.t === 'pasado' ? ' sin usar' : ' disponibles') + '</strong> · ' + p + ' % ' + (c.t === 'pasado' ? 'de uso' : 'usado') + '</p></div></div>';
    return card('cupos', por(c, { pasado: '¿Cuántos cupos se usaron?', presente: '¿Cuántos cupos se han usado?', futuro: '¿Cuántos cupos se han usado hasta ahora?' }), ['Cupos de deportistas de Colombia · límite del evento: ' + num(tot) + '.'], cuerpo);
  }
  C.cupos = cupos;
})();
