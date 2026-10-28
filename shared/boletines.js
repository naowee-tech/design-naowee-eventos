/* Boletines técnicos (revisión COC, 18): uno por jornada con resultados, con CSV y PDF generados al vuelo (demo, sin archivos). */
(function () {
  'use strict';
  var OLC = window.OLC = window.OLC || {};
  var MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  function fechaLarga(iso) { var p = iso.split('-'); return +p[2] + ' de ' + MES[+p[1] - 1] + ' de ' + p[0]; }
  function limpio(t) { return String(t == null ? '' : t); }

  /* Una entrada por jornada que ya tiene pruebas con resultado; la más reciente primero. */
  OLC.boletines = function (data) {
    var por = {};
    (data.pruebas || []).forEach(function (p) { if (p.estado === 'Finalizado' && p.filas && p.filas.length) (por[p.fecha] = por[p.fecha] || []).push(p); });
    var dias = Object.keys(por).sort().reverse(), total = Object.keys(por).length;
    return dias.map(function (f) {
      return { id: f, fecha: f, titulo: 'Boletín técnico · Jornada ' + (Object.keys(por).sort().indexOf(f) + 1) + ' de ' + total, pruebas: por[f] };
    });
  };

  OLC.boletinCsv = function (data, b) {
    var q = function (v) { v = limpio(v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var rows = [['Deporte', 'Prueba', 'Género', 'Fase', 'Puesto', 'Deportista', 'País', 'Marca']];
    b.pruebas.forEach(function (p) { p.filas.forEach(function (f) { rows.push([p.deporteNombre, p.nombre, p.sexoNombre, p.fase, f.puesto, f.deportista, f.paisNombre || f.pais, f.marca]); }); });
    return '\ufeff' + rows.map(function (r) { return r.map(q).join(';'); }).join('\r\n');
  };

  /* PDF mínimo (Helvetica, texto plano) para poder «Ver PDF» sin servidor. */
  OLC.boletinPdf = function (data, b) {
    var lineas = [data.evento.nombre, b.titulo, fechaLarga(b.fecha), ''];
    b.pruebas.forEach(function (p) {
      lineas.push(p.deporteNombre + ' · ' + p.nombre + ' · ' + p.sexoNombre + (p.fase ? ' · ' + p.fase : ''));
      p.filas.slice(0, 8).forEach(function (f) { lineas.push('   ' + f.puesto + '.  ' + f.deportista + ' (' + (f.paisNombre || f.pais) + ')' + (f.marca ? '  ' + f.marca : '')); });
      lineas.push('');
    });
    var paginas = [], POR = 52, i, n = 0;
    for (i = 0; i < lineas.length; i += POR) paginas.push(lineas.slice(i, i + POR));
    var cod = function (t) { return limpio(t).replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7E\xA0-\xFF]/g, '?'); };
    var objs = [], pages = [];
    objs.push('<< /Type /Catalog /Pages 2 0 R >>');
    objs.push(null);
    objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    paginas.forEach(function (pl) {
      var s = 'BT /F1 10 Tf 14 TL 50 800 Td\n' + pl.map(function (l) { return '(' + cod(l) + ') Tj T*'; }).join('\n') + '\nET';
      var c = objs.push('<< /Length ' + s.length + ' >>\nstream\n' + s + '\nendstream');
      var pg = objs.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ' + c + ' 0 R >>');
      pages.push(pg + ' 0 R');
    });
    objs[1] = '<< /Type /Pages /Count ' + pages.length + ' /Kids [' + pages.join(' ') + '] >>';
    var out = '%PDF-1.4\n', offs = [];
    objs.forEach(function (o, k) { offs.push(out.length); out += (k + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
    var x = out.length; n = objs.length + 1;
    out += 'xref\n0 ' + n + '\n0000000000 65535 f \n' + offs.map(function (o) { return ('0000000000' + o).slice(-10) + ' 00000 n \n'; }).join('') + 'trailer\n<< /Size ' + n + ' /Root 1 0 R >>\nstartxref\n' + x + '\n%%EOF';
    var bytes = new Uint8Array(out.length); for (i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
    return new Blob([bytes], { type: 'application/pdf' });
  };

  OLC.boletinNombre = function (data, b, ext) { return 'boletin-' + data.evento.code + '-' + b.fecha + '.' + ext; };
  OLC.fechaLarga = fechaLarga;

  /* Engancha los botones [data-bol-csv] / [data-bol-pdf] de un contenedor. */
  OLC.boletinesBind = function (el, data, lista) {
    var by = {}; lista.forEach(function (b) { by[b.id] = b; });
    el.querySelectorAll('[data-bol-csv]').forEach(function (a) {
      a.addEventListener('click', function () {
        var b = by[a.getAttribute('data-bol-csv')], u = URL.createObjectURL(new Blob([OLC.boletinCsv(data, b)], { type: 'text/csv;charset=utf-8' })), l = document.createElement('a');
        l.href = u; l.download = OLC.boletinNombre(data, b, 'csv'); document.body.appendChild(l); l.click(); l.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
      });
    });
    el.querySelectorAll('[data-bol-pdf]').forEach(function (a) {
      a.addEventListener('click', function () { var b = by[a.getAttribute('data-bol-pdf')]; window.open(URL.createObjectURL(OLC.boletinPdf(data, b)), '_blank', 'noopener'); });
    });
  };
})();
