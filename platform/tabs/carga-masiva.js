/* Carga masiva de calendario (revisión COC, 19): plantilla CSV, vista previa con validación y confirmación. Demo: no persiste. */
(function () {
  'use strict';
  var COLS = ['fecha', 'deporte', 'prueba', 'genero', 'fase', 'hora', 'escenario'];
  var base = window.Tabs && window.Tabs['calendario-resultados'];
  if (!base) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function parse(txt) {
    var sep = txt.indexOf(';') >= 0 && txt.split('\n')[0].indexOf(';') >= 0 ? ';' : ',';
    var lines = txt.replace(/^﻿/, '').split(/\r?\n/).filter(function (l) { return l.trim(); });
    var cab = (lines.shift() || '').split(sep).map(function (c) { return c.trim().toLowerCase(); });
    var faltan = COLS.slice(0, 5).filter(function (c) { return cab.indexOf(c) < 0; });
    var filas = lines.map(function (l, i) {
      var v = l.split(sep), o = { n: i + 2, err: '' };
      cab.forEach(function (c, k) { o[c] = (v[k] || '').trim(); });
      if (!/^\d{4}-\d{2}-\d{2}$/.test(o.fecha || '')) o.err = 'Fecha con formato AAAA-MM-DD';
      else if (o.fecha > OLC.HOY) o.err = 'La fecha es posterior a hoy: la carga masiva es para competencias pasadas';
      else if (!o.deporte || !o.prueba) o.err = 'Falta deporte o prueba';
      return o;
    });
    return { faltan: faltan, filas: filas };
  }

  function dialogo(ev) {
    var d = document.createElement('dialog'); d.className = 'nwtab-cm';
    d.innerHTML = '<form method="dialog" class="nwtab-cm__b"><h2>Carga masiva de calendario</h2>' +
      '<p>Sube las competencias de ' + esc(ev.nombre) + ' en un solo archivo, en lugar de registrarlas una por una.</p>' +
      '<ol><li><button type="button" class="nwtab-cm__lk" data-cm-plantilla>Descarga la plantilla CSV</button> y complétala (una fila por competencia).</li><li>Súbela aquí. Revisamos cada fila antes de cargar.</li></ol>' +
      '<label class="nwtab-cm__f"><span>Archivo CSV</span><input type="file" accept=".csv,text/csv" data-cm-file></label>' +
      '<div data-cm-prev aria-live="polite"></div>' +
      '<div class="nwtab-cm__a"><button value="cancel" class="nwtab-bol-b">Cancelar</button><button type="button" class="nwtab-bol-b nwtab-bol-b--p" data-cm-ok disabled>Cargar competencias</button></div></form>';
    var prev = d.querySelector('[data-cm-prev]'), ok = d.querySelector('[data-cm-ok]'), validas = 0;
    d.querySelector('[data-cm-plantilla]').addEventListener('click', function () {
      var csv = '﻿' + COLS.join(';') + '\r\n2026-09-14;Natación;100 m libre;Femenino;Final;18:30;Piscinas Olímpicas\r\n';
      var u = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), a = document.createElement('a');
      a.href = u; a.download = 'plantilla-calendario.csv'; document.body.appendChild(a); a.click(); a.remove();
    });
    d.querySelector('[data-cm-file]').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var p = parse(String(r.result)); validas = p.filas.filter(function (x) { return !x.err; }).length;
        if (p.faltan.length) { prev.innerHTML = '<p class="nwtab-cm__e" role="alert">Al archivo le faltan columnas: ' + esc(p.faltan.join(', ')) + '.</p>'; ok.disabled = true; return; }
        var malas = p.filas.length - validas;
        prev.innerHTML = '<p><b>' + validas + '</b> de ' + p.filas.length + ' competencias listas' + (malas ? ' · <span class="nwtab-cm__e">' + malas + ' con errores</span>' : '') + '</p>' +
          '<div class="nwtab-cm__t"><table><thead><tr><th>Fila</th><th>Fecha</th><th>Deporte</th><th>Prueba</th><th>Estado</th></tr></thead><tbody>' +
          p.filas.slice(0, 50).map(function (x) { return '<tr class="' + (x.err ? 'is-err' : '') + '"><td>' + x.n + '</td><td>' + esc(x.fecha) + '</td><td>' + esc(x.deporte) + '</td><td>' + esc(x.prueba) + '</td><td>' + (x.err ? esc(x.err) : 'Lista') + '</td></tr>'; }).join('') + '</tbody></table></div>';
        ok.disabled = !validas;
      };
      r.readAsText(f);
    });
    ok.addEventListener('click', function () {
      d.querySelector('.nwtab-cm__b').innerHTML = '<div role="status"><h2>Calendario cargado</h2><p>Se cargaron ' + validas + ' competencias (demo: no se guardan).</p><div class="nwtab-cm__a"><button value="cancel" class="nwtab-bol-b nwtab-bol-b--p">Cerrar</button></div></div>';
    });
    d.addEventListener('close', function () { d.remove(); });
    document.body.appendChild(d); d.showModal();
  }

  window.Tabs['calendario-resultados'] = Object.assign({}, base, {
    render: function (el, ctx) {
      base.render(el, ctx);
      var ev = ctx.data && ctx.data.evento, est = ev && OLC.estado(ev);
      if (window.COC_PERFIL === 'comite' || !ev || est === 'Próximo') return;
      var bar = document.createElement('div'); bar.className = 'nwtab-cm__bar';
      bar.innerHTML = '<button type="button" class="nwtab-bol-b" data-cm-open>Carga masiva</button>';
      bar.firstChild.addEventListener('click', function () { dialogo(ev); });
      el.insertBefore(bar, el.firstChild);
    }
  });
})();
