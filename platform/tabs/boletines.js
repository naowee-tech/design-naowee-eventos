/* Plataforma · pestaña «Boletines técnicos»: un archivo por jornada, con Descargar (CSV) y Ver PDF. */
(function () {
  'use strict';
  window.Tabs = window.Tabs || {};
  window.Tabs['boletines'] = {
    render: function (el, ctx) {
      var data = ctx.data, lista = OLC.boletines(data);
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      if (!lista.length) { el.innerHTML = '<section class="nwtab-tab" aria-label="Boletines técnicos"><div class="nwtab-emptyb nwtab-emptyb--lg"><b>Aún no hay boletines</b><span>Se publican al cierre de cada jornada con resultados.</span></div></section>'; return; }
      el.innerHTML = '<section class="nwtab-tab nwtab-bol" aria-label="Boletines técnicos"><p class="nwtab-bol-s">Resultados oficiales por jornada, en PDF para leer y en CSV para trabajar con los datos.</p><ul class="nwtab-bol-l">' +
        lista.map(function (b) {
          return '<li class="nwtab-bol-i"><div><b>' + esc(b.titulo) + '</b><span>' + esc(OLC.fechaLarga(b.fecha)) + ' · ' + b.pruebas.length + (b.pruebas.length === 1 ? ' prueba' : ' pruebas') + '</span></div>' +
            '<div class="nwtab-bol-a"><button type="button" class="nwtab-bol-b" data-bol-pdf="' + b.id + '">Ver PDF</button><button type="button" class="nwtab-bol-b nwtab-bol-b--p" data-bol-csv="' + b.id + '">Descargar CSV</button></div></li>';
        }).join('') + '</ul></section>';
      OLC.boletinesBind(el, data, lista);
    }
  };
})();
