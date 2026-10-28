/* Pestaña Analítica: el dashboard del evento, dentro del evento (antes era una pantalla general por rol). */
window.Tabs = window.Tabs || {};
window.Tabs['analitica'] = {
  render: function (el, ctx) {
    var d = ctx.data, e = ctx.event, OLC = window.OLC;
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    var nacional = e.alcance === 'NACIONAL';
    var fin = d.pruebas.filter(function (p) { return p.estado === 'Finalizado'; }).length, tot = d.pruebas.length;
    var col = d.colombia, m = col.medallas;
    var proximo = d.estado === 'Próximo';

    function kpi(lbl, val, sub) {
      return '<div class="an-kpi"><span class="an-kpi__l nwt-caption-font-regular">' + esc(lbl) + '</span><b class="an-kpi__v">' + val + '</b>' + (sub ? '<span class="an-kpi__s nwt-caption-font-regular">' + esc(sub) + '</span>' : '') + '</div>';
    }
    var nDep = d.deportes.length;
    var kpis = kpi('Pruebas finalizadas', fin + '<small> / ' + tot + '</small>', tot ? Math.round(fin * 100 / tot) + '% del programa' : '') +
      kpi(nDep === 1 ? 'Deporte' : 'Deportes', String(nDep), nDep === 1 ? d.deportes[0].nombre : 'Evento multideportivo') +
      (nacional ? kpi('Deportistas', String(col.deportistas), 'con nombre en pruebas') : kpi('Países', String(Math.max(d.paises.length, e.paises || 0)), 'Colombia anfitrión')) +
      kpi('Medallas de Colombia', String(m.total), proximo ? 'Aún sin resultados' : m.oro + ' oro · ' + m.plata + ' plata · ' + m.bronce + ' bronce') +
      (nacional || col.posicion == null ? '' : kpi('Puesto en el medallero', col.posicion + '.º', 'de ' + col.de + ' países'));

    /* Avance por jornada: pruebas finalizadas y pendientes de cada día. */
    var porDia = {}; d.dias.forEach(function (x) { porDia[x] = { f: 0, p: 0 }; });
    d.pruebas.forEach(function (p) { var o = porDia[p.fecha]; if (o) { if (p.estado === 'Finalizado') o.f++; else o.p++; } });
    var max = 1; Object.keys(porDia).forEach(function (k) { max = Math.max(max, porDia[k].f + porDia[k].p); });
    var jornadas = d.dias.map(function (x) {
      var o = porDia[x];
      return '<li class="an-day' + (x === OLC.HOY ? ' is-today' : '') + '" title="' + esc(OLC.diaCorto(x)) + ': ' + o.f + ' finalizadas, ' + o.p + ' pendientes">' +
        '<span class="an-day__bar"><i class="an-day__f" style="height:' + (o.f * 100 / max) + '%"></i><i class="an-day__p" style="height:' + (o.p * 100 / max) + '%"></i></span>' +
        '<span class="an-day__x nwt-caption-font-regular">' + esc(x.slice(8)) + '</span></li>';
    }).join('');

    var porDep = col.porDeporte.slice(0, 6), maxM = 1; porDep.forEach(function (r) { maxM = Math.max(maxM, r.total); });
    var medDep = porDep.length ? '<ul class="an-bars">' + porDep.map(function (r) {
      return '<li><span class="an-bars__n nwt-smalltext-font-regular">' + esc(r.deporteNombre) + '</span><span class="an-bars__t"><i style="width:' + (r.total * 100 / maxM) + '%"></i></span><b class="nwt-smalltext-font-bold">' + r.total + '</b></li>';
    }).join('') + '</ul>' : '<p class="nws-muted nwt-smalltext-font-regular">Todavía no hay medallas de Colombia en este evento.</p>';

    el.innerHTML = '<div class="an"><div class="an-kpis">' + kpis + '</div>' +
      '<div class="an-grid"><section class="an-card"><h3 class="nwt-smalltext-font-bold">Avance por jornada</h3>' +
      '<ol class="an-days" aria-label="Pruebas por jornada">' + jornadas + '</ol>' +
      '<p class="an-legend nwt-caption-font-regular"><span><i class="an-dot an-dot--f"></i>Finalizadas</span><span><i class="an-dot an-dot--p"></i>Pendientes</span></p></section>' +
      '<section class="an-card"><h3 class="nwt-smalltext-font-bold">Medallas de Colombia por deporte</h3>' + medDep + '</section></div></div>';
  }
};
