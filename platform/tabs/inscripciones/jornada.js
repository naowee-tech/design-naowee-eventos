/* Componente: participaciones por jornada, columnas con Diario/Acumulado. */
(function () {
  var C = window.NWIN, esc = C.esc, num = C.num, plural = C.plural, card = C.card, seg = C.seg, vacio = C.vacio, por = C.por;
  function actividad(c, ui) {
    var modo = ui.modo === 'acumulado' ? 'acumulado' : 'diario', acc = 0, cuerpo;
    var datos = c.jornadas.map(function (j) { acc += j.n; return { fecha: j.fecha, v: modo === 'diario' ? j.n : acc, n: j.n }; });
    var max = Math.max.apply(null, datos.map(function (d) { return d.v; }).concat([1]));
    var picoI = 0; datos.forEach(function (d, i) { if (d.v > datos[picoI].v) picoI = i; });
    var etq = modo === 'diario' ? picoI : datos.length - 1, mid = Math.round(max / 2);
    if (!datos.length || !c.jornadas.some(function (j) { return j.n; })) {
      cuerpo = vacio('Sin datos disponibles', 'Todavía no hay participaciones de Colombia por jornada.');
    } else {
      var prevM = '';
      cuerpo = '<div class="nwtab-in-ch"><ul class="nwtab-in-ax" aria-hidden="true"><li>' + num(max) + '</li><li>' + num(mid) + '</li><li>0</li></ul><ul class="nwtab-in-cols">' + datos.map(function (d, i) {
        var dt = new Date(d.fecha + 'T12:00:00'), mes = OLC.diaCorto(d.fecha).split(' ')[2], showM = mes !== prevM; prevM = mes;
        var txt = OLC.diaCorto(d.fecha) + ': ' + plural(modo === 'diario' ? d.n : d.v, 'participación', 'participaciones') + (modo === 'acumulado' ? ' acumuladas' : '') + (d.fecha === OLC.HOY ? ' (hoy)' : '');
        return '<li class="nwtab-in-col' + (d.fecha === OLC.HOY ? ' is-hoy' : '') + (i === picoI && modo === 'diario' ? ' is-peak' : '') + '" aria-label="' + esc(txt) + '"><span class="nwtab-in-col__t">' + '<em>' + num(d.v) + '</em><i style="height:' + Math.max(d.v / max * 100, d.v ? 1.5 : 0.8).toFixed(1) + '%"></i></span><span class="nwtab-in-col__d">' + dt.getDate() + '</span><span class="nwtab-in-col__m">' + (showM ? mes : '') + '</span></li>';
      }).join('') + '</ul></div>';
    }
    var modos = seg([['diario', 'Diario'], ['acumulado', 'Acumulado']], modo, { key: 'modo', label: 'Modo del gráfico' });
    return card('act', por(c, { pasado: '¿Cuántas participaciones hubo cada jornada?', presente: '¿Cuántas participaciones hay por jornada?' }), ['Participaciones de Colombia por día de competencia · ' + num(c.ins) + ' en total.'], cuerpo, modos, 'nwtab-in-card--act');
  }
  C.jornada = actividad;
})();
