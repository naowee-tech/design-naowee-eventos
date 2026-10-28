/* Componente: nómina de Colombia (deportista × prueba) con búsqueda, filtros, orden y paginación. */
(function () {
  var C = window.NWIN, U = C.U, esc = C.esc, num = C.num, plural = C.plural, GEN = C.GEN;
  var PS = 10;
  var COLS = { nombre: 'Deportista', dep: 'Deporte · Prueba', cat: 'Categoría', fecha: 'Fecha', res: 'Resultado' };
  var EST = { Finalizado: 'Finalizada', 'En curso': 'En curso', Programado: 'Programada' };

  /* Misma regla de dedupe que calc(): una participación por deportista (o equipo) en cada prueba. */
  function inscritos(data) {
    var seen = {}, out = [];
    (data.pruebas || []).forEach(function (p) {
      var sx = p.sexo === 'F' || p.sexo === 'M' || p.sexo === 'X' ? p.sexo : 'U';
      (p.colombianos || []).forEach(function (c) {
        var eq = String(c.deportista).indexOf('(') >= 0, k = (eq ? 'E|' : 'D|') + p.deporte + '|' + p.nombre + '|' + (p.sexo || '') + '|' + c.deportista;
        if (seen[k]) return;
        seen[k] = 1;
        out.push({ id: out.length, est: p.estado, nombre: c.deportista, eq: eq, dep: p.deporteNombre || p.deporte, codigo: p.deporte, prueba: p.nombre, sx: sx, fecha: p.fecha, puesto: c.puesto, marca: c.marca, med: c.medalla ? String(c.medalla).toLowerCase() : '' });
      });
    });
    return out;
  }

  function filtrar(rows, t) {
    var N = U(), q = N.norm(String(t.q || '').trim());
    var base = rows.filter(function (r) {
      return (!t.dep || r.dep === t.dep) && (!t.cat || r.sx === t.cat) && (!t.jor || r.fecha === t.jor) &&
        (!q || N.norm(r.nombre + ' ' + r.dep + ' ' + r.prueba).indexOf(q) >= 0);
    });
    return { base: base, vis: t.chip === 'med' ? base.filter(function (r) { return r.med; }) : t.chip === 'eq' ? base.filter(function (r) { return r.eq; }) : base };
  }

  function ordenar(arr, t) {
    var by = {
      nombre: function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); },
      dep: function (a, b) { return a.dep.localeCompare(b.dep, 'es') || a.prueba.localeCompare(b.prueba, 'es'); },
      cat: function (a, b) { return (GEN[a.sx] || '').localeCompare(GEN[b.sx] || '', 'es'); },
      fecha: function (a, b) { return a.fecha.localeCompare(b.fecha); },
      res: function (a, b) { return (a.puesto || 99) - (b.puesto || 99); }
    }[t.sortK], d = t.sortD === 'desc' ? -1 : 1;
    return arr.slice().sort(function (a, b) { return d * by(a, b) || a.fecha.localeCompare(b.fecha) || a.id - b.id; });
  }

  function medalla(m) { return m ? '<span class="nwtab-in-md nwtab-in-md--' + m + '">' + m.charAt(0).toUpperCase() + m.slice(1) + '</span>' : ''; }

  function th(k, t, al, fut) {
    if (fut && k === 'res') return '<th scope="col" class="' + al + '">Estado de la prueba</th>';
    var on = t.sortK === k;
    return '<th scope="col" class="' + al + '"' + (on ? ' aria-sort="' + (t.sortD === 'desc' ? 'descending' : 'ascending') + '"' : '') + '><button type="button" class="nwtab-in-th' + (on ? ' is-on' : '') + '" data-tk="th-' + k + '" data-in-sort="' + k + '"><span>' + COLS[k] + '</span><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (on ? (t.sortD === 'desc' ? '<path d="M12 5v14M6 13l6 6 6-6"/>' : '<path d="M12 19V5M6 11l6-6 6 6"/>') : '<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>') + '</svg></button></th>';
  }

  /* Solo esta región se repinta al filtrar, así el campo de búsqueda conserva el foco. */
  function resultados(rows, t, tp) {
    var f = filtrar(rows, t), list = ordenar(f.vis, t), total = list.length, pages = Math.max(1, Math.ceil(total / PS)), page = Math.min(Math.max(1, t.page), pages), vis = list.slice((page - 1) * PS, page * PS);
    t.page = page;
    if (tp === 'futuro' && t.sortK === 'res') t.sortK = 'fecha';
    if (tp === 'futuro' && t.chip === 'med') t.chip = 'todas';
    var body = vis.map(function (r) {
      return '<tr><th scope="row" class="nwtab-in-ti__n"><span class="nwtab-in-ti__t" title="' + esc(r.nombre) + '">' + esc(r.nombre) + '</span>' + (r.eq ? '<span class="nwtab-in-st nwtab-in-st--eq">Equipo</span>' : '') + '</th>' +
        '<td class="nwtab-in-ti__p"><small title="' + esc(r.dep) + '">' + esc(r.dep) + '</small><b title="' + esc(r.prueba) + '">' + esc(r.prueba) + '</b></td><td class="nwtab-in-ti__c">' + esc(GEN[r.sx] || '') + '</td><td class="nwtab-in-ti__f">' + esc(OLC.diaCorto(r.fecha)) + '</td>' +
        (tp === 'futuro' ? '' : '<td class="nwtab-in-ti__r">' + (r.puesto ? r.puesto + '.º' + (r.marca ? ' · ' + esc(r.marca) : '') + ' ' + medalla(r.med) : '<span class="nwtab-in-pend">' + esc(EST[r.est] || 'Programada') + '</span>') + '</td>') + '</tr>';
    }).join('');
    var tabla = total ? '<div class="nwtab-in-tw"><table class="nw-table nwtab-in-ti' + (tp === 'futuro' ? ' nwtab-in-ti--fut' : '') + '"><caption class="nwtab-vh">' + plural(total, 'participación', 'participaciones') + ', ordenadas por ' + COLS[t.sortK].toLowerCase() + '</caption><thead><tr>' + th('nombre', t, 'l') + th('dep', t, 'l') + th('cat', t, 'l') + th('fecha', t, 'l') + (tp === 'futuro' ? '' : th('res', t, 'l')) + '</tr></thead><tbody>' + body + '</tbody></table></div>'
      : C.vacio('Sin resultados', 'Ninguna participación coincide con la búsqueda o los filtros.');
    var pie = total && pages > 1 ? '<nav class="nw-pager" aria-label="Paginación"><button type="button" data-tk="pg-prev" data-in-page="-1" aria-label="Página anterior"' + (page <= 1 ? ' disabled' : '') + '><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><span>Página <b>' + page + '</b> de ' + pages + '</span><button type="button" data-tk="pg-next" data-in-page="1" aria-label="Página siguiente"' + (page >= pages ? ' disabled' : '') + '><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></nav>' : '';
    return tabla + pie;
  }

  /* DC-031: el filtro rápido es un select en la fila del título; los conteos siguen a los demás filtros. */
  function opcionesRapido(rows, t, tp) {
    var b = filtrar(rows, t).base, o = [['todas', 'Todas', b.length]];
    if (tp !== 'futuro') o.push(['med', 'Con medalla', b.filter(function (r) { return r.med; }).length]);
    o.push(['eq', 'Por equipo', b.filter(function (r) { return r.eq; }).length]);
    return o;
  }
  function selRapido(rows, t, tp) {
    return '<label class="nwtab-in-fl nwtab-in-fl--h"><span class="nwtab-vh">Filtro rápido de la nómina</span><select class="nwtab-in-fi" data-in-chip-sel>' + opcionesRapido(rows, t, tp).map(function (o) {
      return '<option value="' + o[0] + '"' + (t.chip === o[0] ? ' selected' : '') + '>' + o[1] + ' · ' + num(o[2]) + '</option>';
    }).join('') + '</select></label>';
  }

  function opts(vals, cur, todos) {
    return '<option value="">' + todos + '</option>' + vals.map(function (v) { return '<option value="' + esc(v[0]) + '"' + (cur === v[0] ? ' selected' : '') + '>' + esc(v[1]) + '</option>'; }).join('');
  }

  function render(c, ui, data) {
    var rows = inscritos(data), t = ui.t = ui.t || { q: '', dep: '', cat: '', jor: '', chip: 'todas', sortK: 'fecha', sortD: 'asc', page: 1 };
    var deps = [], jors = [], cats = [];
    rows.forEach(function (r) { if (deps.indexOf(r.dep) < 0) deps.push(r.dep); if (jors.indexOf(r.fecha) < 0) jors.push(r.fecha); if (cats.indexOf(r.sx) < 0) cats.push(r.sx); });
    deps.sort(function (a, b) { return a.localeCompare(b, 'es'); }); jors.sort();
    var lab = function (txt, ctl) { return '<label class="nwtab-in-fl">' + txt + ctl + '</label>'; };
    var tools = '<div class="nwtab-in-tools">' +
      lab('Buscar', '<input type="search" class="nwtab-in-fi" data-in-q value="' + esc(t.q) + '" placeholder="Deportista o prueba" autocomplete="off">').replace('class="nwtab-in-fl"', 'class="nwtab-in-fl nwtab-in-fl--q"') +
      lab('Deporte', '<select class="nwtab-in-fi" data-in-f="dep">' + opts(deps.map(function (d) { return [d, d]; }), t.dep, 'Todos (' + deps.length + ')') + '</select>') +
      lab('Categoría', '<select class="nwtab-in-fi" data-in-f="cat">' + opts(cats.map(function (x) { return [x, GEN[x] || x]; }), t.cat, 'Todas') + '</select>') +
      lab('Jornada', '<select class="nwtab-in-fi" data-in-f="jor">' + opts(jors.map(function (j) { return [j, OLC.diaCorto(j)]; }), t.jor, 'Todas (' + jors.length + ')') + '</select>') + '</div>';
    var paras = [plural(rows.length, 'participación', 'participaciones') + ' de ' + plural(c.deportistas, 'deportista', 'deportistas') + ' de Colombia.', 'Los equipos, relevos y dobles figuran como «Colombia».'];
    return C.card('tabla', 'Nómina de Colombia', paras, tools + '<div data-in-res>' + resultados(rows, t, c.t) + '</div>', selRapido(rows, t, c.t), 'nwtab-in-card--tabla');
  }

  function bind(el, ui, data, c) {
    var sec = el.querySelector('.nwtab-in-card--tabla'); if (!sec) return;
    var rows = inscritos(data), t = ui.t, res = sec.querySelector('[data-in-res]'), rapido = sec.parentNode.querySelector('[data-in-chip-sel]');
    function pintar(foco) {
      res.innerHTML = resultados(rows, t, c.t); wire();
      var rs = rapido.options, ops = opcionesRapido(rows, t, c.t);
      for (var i = 0; i < rs.length; i++) rs[i].textContent = ops[i][1] + ' · ' + num(ops[i][2]);
      var n = foco && res.querySelector('[data-tk="' + foco + '"]'); if (n && !n.disabled) n.focus();
    }
    function wire() {
      res.querySelectorAll('[data-in-sort]').forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-in-sort'); t.sortD = t.sortK === k && t.sortD === 'asc' ? 'desc' : 'asc'; t.sortK = k; t.page = 1; pintar(b.getAttribute('data-tk')); }); });
      res.querySelectorAll('[data-in-page]').forEach(function (b) { b.addEventListener('click', function () { t.page += +b.getAttribute('data-in-page'); pintar(b.getAttribute('data-tk')); }); });
    }
    sec.querySelector('[data-in-q]').addEventListener('input', function (e) { t.q = e.target.value; t.page = 1; pintar(); });
    sec.querySelectorAll('[data-in-f]').forEach(function (s) { s.addEventListener('change', function () { t[s.getAttribute('data-in-f')] = s.value; t.page = 1; pintar(); }); });
    rapido.addEventListener('change', function () { t.chip = rapido.value; t.page = 1; pintar(); });
    wire();
  }

  C.tabla = { render: render, bind: bind };
})();
