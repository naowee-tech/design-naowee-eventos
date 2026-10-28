/* Pestaña Cargas (gestor del evento): inscripciones, ranking/resultados y medallería, de a uno o por CSV.
   Demo: los registros se guardan en este navegador (localStorage), no en el servidor. */
window.Tabs = window.Tabs || {};
window.Tabs['cargas'] = (function () {
  'use strict';
  var C = window.Campos, esc = C.esc;
  var SUBS = [{ id: 'inscripciones', label: 'Inscripciones' }, { id: 'ranking', label: 'Ranking / Resultados' }, { id: 'medallas', label: 'Medallería' }];
  var COLS = { inscripciones: ['deportista', 'documento', 'deporte', 'pais'], ranking: ['deporte', 'prueba', 'deportista', 'puesto', 'marca'], medallas: ['deporte', 'prueba', 'deportista', 'medalla'] };
  var REQ = { inscripciones: ['deportista', 'documento', 'deporte'], ranking: ['deporte', 'prueba', 'deportista', 'puesto'], medallas: ['deporte', 'prueba', 'deportista', 'medalla'] };
  var ETQ = { deportista: 'Deportista', documento: 'Documento', deporte: 'Deporte', pais: 'País', prueba: 'Prueba', puesto: 'Puesto', marca: 'Marca', medalla: 'Medalla' };
  var MEDALLAS = ['Oro', 'Plata', 'Bronce'];
  function cap(t) { t = String(t || '').trim().toLowerCase(); return t.charAt(0).toUpperCase() + t.slice(1); }

  function validar(sub, o, deportes) {
    var falta = REQ[sub].filter(function (c) { return !String(o[c] || '').trim(); })[0];
    if (falta) return 'Falta ' + ETQ[falta].toLowerCase();
    if (deportes.indexOf(String(o.deporte).trim()) < 0) return 'El deporte no pertenece al evento';
    if (sub === 'ranking' && !(parseInt(o.puesto, 10) > 0)) return 'El puesto debe ser un número';
    if (sub === 'medallas' && MEDALLAS.indexOf(cap(o.medalla)) < 0) return 'La medalla es Oro, Plata o Bronce';
    return '';
  }
  function parseCsv(txt, sub) {
    var lines = txt.replace(/^﻿/, '').split(/\r?\n/).filter(function (l) { return l.trim(); });
    var sep = (lines[0] || '').indexOf(';') >= 0 ? ';' : ',';
    var cab = (lines.shift() || '').split(sep).map(function (c) { return c.trim().toLowerCase(); });
    var faltan = REQ[sub].filter(function (c) { return cab.indexOf(c) < 0; });
    return { faltan: faltan, filas: lines.map(function (l, i) { var v = l.split(sep), o = { _n: i + 2 }; cab.forEach(function (c, k) { o[c] = (v[k] || '').trim(); }); return o; }) };
  }

  function render(el, ctx) {
    var code = ctx.event.code, key = 'eventos.cargas.' + code, ui = ctx.ui, sub = ui.sub = ui.sub || 'inscripciones';
    var deportes = ctx.data.deportes.map(function (d) { return d.nombre; });
    var store = C.leer(key, { inscripciones: [], ranking: [], medallas: [] });
    var rows = store[sub] || [], cols = COLS[sub], form = {}, campos = {};
    /* Solo el gestor del evento carga; el administrador supervisa en solo lectura (seguimiento). */
    var puede = !!(window.ROLES.rol.gestion && window.ROLES.gestiona(ctx.event));

    el.innerHTML = '<div class="cg"><div id="cg-tabs"></div>' + (puede ? '<div class="cg-grid">' : '') + (!puede ? '<p class="cg-ro nwt-caption-font-regular nws-muted">Seguimiento: solo lectura. Los cargues los registra el gestor del evento.</p>' : '') + (puede ?
      '<section class="cg-card"><h3 class="nwt-smalltext-font-bold">Carga manual</h3><div class="cg-form" id="cg-form"></div><div class="cg-act"><span class="cg-msg nwt-caption-font-regular" id="cg-msg" role="status"></span><span id="cg-add"></span></div></section>' +
      '<section class="cg-card"><h3 class="nwt-smalltext-font-bold">Carga masiva (CSV)</h3><p class="nwt-caption-font-regular nws-muted">Una fila por registro. Revisamos cada fila antes de cargarla.</p>' +
      '<p><button type="button" class="cg-lk" id="cg-tpl">Descargar plantilla CSV</button></p><label class="cg-file"><span class="nwt-caption-font-regular">Archivo CSV</span><input type="file" accept=".csv,text/csv" id="cg-file"></label><div id="cg-prev"></div></section></div>' : '') +
      '<section class="cg-card"><h3 class="nwt-smalltext-font-bold">Registros cargados <span class="cg-n">' + rows.length + '</span></h3><div id="cg-tabla"></div></section></div>';

    var tabs = C.mk('nwt-tabs', { items: SUBS.map(function (s) { return { id: s.id, label: s.label, value: s.id }; }), value: sub, autoWidth: true }, function (v) { if (v !== sub) { ui.sub = v; render(el, ctx); } });
    tabs.setAttribute('auto-width', ''); document.getElementById('cg-tabs').appendChild(tabs);

    if (puede) {
    /* formulario manual */
    var $f = document.getElementById('cg-form');
    cols.forEach(function (c) {
      var w = document.createElement('div'), base = { label: ETQ[c], required: REQ[sub].indexOf(c) >= 0, nwtSize: 'large' };
      if (c === 'deporte') campos[c] = C.mk('nwt-dropdown', Object.assign(base, { placeholder: 'Selecciona', options: C.opciones(deportes) }), function (v) { form[c] = v || ''; });
      else if (c === 'medalla') campos[c] = C.mk('nwt-dropdown', Object.assign(base, { placeholder: 'Selecciona', options: C.opciones(MEDALLAS) }), function (v) { form[c] = v || ''; });
      else if (c === 'pais') campos[c] = C.mk('nwt-dropdown', Object.assign(base, { placeholder: 'Selecciona', options: C.opciones(ctx.data.paises.map(function (p) { return { value: p.pais, label: p.paisNombre }; })), value: 'CO' }), function (v) { form[c] = v || ''; });
      else campos[c] = C.mk('nwt-text-field', Object.assign(base, { placeholder: c === 'puesto' ? 'Ej. 1' : '' }), function (v) { form[c] = String(v == null ? '' : v); });
      if (c === 'pais') form[c] = 'CO';
      w.appendChild(campos[c]); $f.appendChild(w);
    });
    var add = C.mk('nwt-button', { nwtVariant: 'loud' }); add.textContent = 'Agregar registro';
    add.addEventListener('click', function () {
      var err = validar(sub, form, deportes), msg = document.getElementById('cg-msg');
      cols.forEach(function (c) { campos[c].error = REQ[sub].indexOf(c) >= 0 && !String(form[c] || '').trim(); });
      if (err) { msg.textContent = err + '.'; msg.className = 'cg-msg cg-msg--err nwt-caption-font-regular'; return; }
      var r = {}; cols.forEach(function (c) { r[c] = c === 'medalla' ? cap(form[c]) : String(form[c] || '').trim(); });
      store[sub].push(r); C.guardar(key, store); render(el, ctx);
    });
    document.getElementById('cg-add').appendChild(add);

    }
    /* tabla */
    var $t = document.getElementById('cg-tabla');
    $t.innerHTML = rows.length ? '<div class="cg-scroll"><table class="cg-tab"><thead><tr>' + cols.map(function (c) { return '<th scope="col">' + ETQ[c] + '</th>'; }).join('') + (puede ? '<th scope="col"><span class="nws-sr">Quitar</span></th>' : '') + '</tr></thead><tbody>' +
      rows.map(function (r, i) { return '<tr>' + cols.map(function (c) { return '<td>' + esc(r[c]) + '</td>'; }).join('') + (puede ? '<td><button type="button" class="cg-x" data-i="' + i + '" aria-label="Quitar registro ' + (i + 1) + '">Quitar</button></td>' : '') + '</tr>'; }).join('') + '</tbody></table></div>'
      : '<p class="nws-muted nwt-smalltext-font-regular">' + (puede ? 'Aún no hay registros. Agrégalos de a uno o sube un CSV.' : 'El gestor aún no ha cargado registros.') + '</p>';
    $t.querySelectorAll('[data-i]').forEach(function (b) { b.addEventListener('click', function () { store[sub].splice(+b.getAttribute('data-i'), 1); C.guardar(key, store); render(el, ctx); }); });

    if (puede) {
    /* carga masiva */
    document.getElementById('cg-tpl').addEventListener('click', function () {
      var ej = { inscripciones: 'Mosquera Andrea;1020304050;' + deportes[0] + ';CO', ranking: deportes[0] + ';100 m;Mosquera Andrea;1;10,28 s', medallas: deportes[0] + ';100 m;Mosquera Andrea;Oro' }[sub];
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + cols.join(';') + '\n' + ej + '\n'], { type: 'text/csv' })); a.download = 'plantilla-' + sub + '.csv'; a.click(); URL.revokeObjectURL(a.href);
    });
    document.getElementById('cg-file').addEventListener('change', function (ev) {
      var f = ev.target.files[0], $p = document.getElementById('cg-prev'); if (!f) { $p.innerHTML = ''; return; }
      var rd = new FileReader();
      rd.onload = function () {
        var p = parseCsv(String(rd.result), sub);
        if (p.faltan.length) { $p.innerHTML = '<p class="cg-msg cg-msg--err nwt-caption-font-regular">Faltan columnas: ' + esc(p.faltan.join(', ')) + '.</p>'; return; }
        var ok = [], mal = [];
        p.filas.forEach(function (o) { var e = validar(sub, o, deportes); (e ? mal : ok).push(e ? { o: o, e: e } : o); });
        $p.innerHTML = '<p class="nwt-caption-font-regular"><b>' + ok.length + '</b> filas válidas' + (mal.length ? ' · <b class="cg-bad">' + mal.length + '</b> con error' : '') + '</p>' +
          (mal.length ? '<ul class="cg-errs nwt-caption-font-regular">' + mal.slice(0, 5).map(function (m) { return '<li>Fila ' + m.o._n + ': ' + esc(m.e) + '</li>'; }).join('') + '</ul>' : '') + '<span id="cg-ok"></span>';
        var go = C.mk('nwt-button', { nwtVariant: 'loud', disabled: !ok.length }); go.textContent = 'Cargar ' + ok.length + ' filas válidas';
        go.addEventListener('click', function () { ok.forEach(function (o) { var r = {}; cols.forEach(function (c) { r[c] = c === 'medalla' ? cap(o[c]) : (o[c] || (c === 'pais' ? 'CO' : '')); }); store[sub].push(r); }); C.guardar(key, store); render(el, ctx); });
        document.getElementById('cg-ok').appendChild(go);
      };
      rd.readAsText(f);
    });
    }
  }
  return { render: render };
})();
