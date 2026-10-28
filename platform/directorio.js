/* Páginas transversales del sidebar: Consulta deportistas (directorio y perfil con su trayectoria) y Usuarios (administración).
   Los deportistas se arman con los colombianos de los eventos que el rol puede ver. */
window.Directorio = (function () {
  'use strict';
  var C = window.Campos, esc = C.esc, OLC = window.OLC, R = window.ROLES, PAGE = 15;
  var cache = null;

  function indice() {
    var evs = OLC.eventos().filter(R.puedeVer), key = R.actual + '|' + evs.map(function (e) { return e.code + e.inicio + e.fin + (e.deportes || ''); }).join(',');
    if (cache && cache.key === key) return cache.v;
    var map = {};
    evs.forEach(function (ev) {
      OLC.datosDe(ev.code).pruebas.forEach(function (p) {
        (p.colombianos || []).forEach(function (c) {
          var nm = c.deportista; if (!nm || nm.indexOf('(') >= 0) return; // equipos y relevos no son personas
          var a = map[nm] || (map[nm] = { nombre: nm, deportes: {}, eventos: {}, med: { oro: 0, plata: 0, bronce: 0 }, part: [] });
          a.deportes[p.deporteNombre] = 1; a.eventos[ev.code] = ev.nombre;
          var m = c.medalla && String(c.medalla).toLowerCase(); if (m && a.med[m] != null) a.med[m]++;
          a.part.push({ evento: ev.nombre, code: ev.code, deporte: p.deporteNombre, prueba: p.nombre, fase: p.fase, fecha: p.fecha, puesto: c.puesto, marca: c.marca, medalla: c.medalla });
        });
      });
    });
    var v = Object.keys(map).map(function (k) { var a = map[k]; a.total = a.med.oro + a.med.plata + a.med.bronce; return a; })
      .sort(function (x, y) { return y.med.oro - x.med.oro || y.total - x.total || x.nombre.localeCompare(y.nombre); });
    cache = { key: key, v: v }; return v;
  }
  function iniciales(n) { return String(n).split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase(); }
  function medallas(m) { return '<span class="dr-med" title="Oro, plata y bronce"><b class="dr-o">' + m.oro + '</b><b class="dr-p">' + m.plata + '</b><b class="dr-b">' + m.bronce + '</b></span>'; }
  function pager(box, total, pagina, ir) {
    var n = Math.max(1, Math.ceil(total / PAGE)); if (n < 2) return;
    var h = '<nav class="nw-pager nw-pager--nums dr-pager" aria-label="Paginación">';
    for (var i = 1; i <= n; i++) h += '<button type="button" data-pg="' + i + '"' + (i === pagina ? ' aria-current="page"' : '') + '>' + i + '</button>';
    box.insertAdjacentHTML('beforeend', h + '</nav>');
    box.querySelectorAll('[data-pg]').forEach(function (b) { b.addEventListener('click', function () { ir(+b.getAttribute('data-pg')); }); });
  }
  function filtros(el, opts, alCambiar) {
    el.innerHTML = '<div class="nwt-searchbox nws-search"><label class="nwt-searchbox__container"><input class="nwt-searchbox__input" type="search" id="dr-q" placeholder="' + esc(opts.placeholder) + '" aria-label="' + esc(opts.placeholder) + '"></label></div><div id="dr-f"></div>';
    var f = C.mk('nwt-dropdown', { placeholder: opts.filtro, clearable: true, options: C.opciones(opts.valores), nwtSize: 'large' }, function (v) { alCambiar(null, v || ''); });
    el.querySelector('#dr-f').appendChild(f);
    el.querySelector('#dr-q').addEventListener('input', function (e) { alCambiar(e.target.value, undefined); });
  }

  function deportistas(main, ctx) {
    var todos = indice(), q = '', dep = '', pagina = 1;
    ctx.setTop([{ t: 'Consulta deportistas' }]); document.title = 'Consulta deportistas · Naowee Suite';
    main.innerHTML = '<div class="nws-page dr"><div class="nws-events-header"><div class="nws-events-header__description"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">Consulta deportistas</h1>' +
      '<small class="nwt-smalltext-font-regular">Deportistas colombianos en los eventos a los que tienes acceso, con su trayectoria.</small></div></div>' +
      '<div class="dr-filtros" id="dr-fil"></div><p class="nwt-caption-font-regular nws-muted" id="dr-n" role="status"></p><div id="dr-res"></div></div>';
    var deportes = {}; todos.forEach(function (a) { Object.keys(a.deportes).forEach(function (d) { deportes[d] = 1; }); });
    filtros(document.getElementById('dr-fil'), { placeholder: 'Buscar deportista…', filtro: 'Todos los deportes', valores: Object.keys(deportes).sort() }, function (nq, nd) { if (nq != null) q = nq; if (nd !== undefined) dep = nd; pagina = 1; pintar(); });
    function pintar() {
      var t = q.trim().toLowerCase(), lista = todos.filter(function (a) { return (!t || a.nombre.toLowerCase().indexOf(t) >= 0) && (!dep || a.deportes[dep]); });
      document.getElementById('dr-n').textContent = lista.length + (lista.length === 1 ? ' deportista' : ' deportistas');
      var box = document.getElementById('dr-res'), sl = lista.slice((pagina - 1) * PAGE, pagina * PAGE);
      box.innerHTML = lista.length ? '<div class="cg-scroll cg-card dr-card"><table class="cg-tab"><thead><tr><th scope="col">Deportista</th><th scope="col">Deportes</th><th scope="col">Eventos</th><th scope="col">Medallas</th><th scope="col"><span class="nws-sr">Perfil</span></th></tr></thead><tbody>' +
        sl.map(function (a) { return '<tr><td><a class="dr-n" href="#/deportistas/' + encodeURIComponent(a.nombre) + '"><span class="nws-avatar" aria-hidden="true">' + esc(iniciales(a.nombre)) + '</span>' + esc(a.nombre) + '</a></td><td>' + esc(Object.keys(a.deportes).join(', ')) + '</td><td>' + Object.keys(a.eventos).length + '</td><td>' + medallas(a.med) + '</td><td><a class="ec-link" href="#/deportistas/' + encodeURIComponent(a.nombre) + '">Ver perfil ' + ctx.icon('arrow-right') + '</a></td></tr>'; }).join('') + '</tbody></table></div>'
        : '<div class="nws-empty"><p class="nwt-smalltext-font-bold">No hay deportistas con estos criterios</p></div>';
      pager(box, lista.length, pagina, function (n) { pagina = n; pintar(); });
    }
    pintar();
  }

  function perfil(main, ctx, nombre) {
    var a = indice().filter(function (x) { return x.nombre === nombre; })[0];
    ctx.setTop([{ t: 'Consulta deportistas', href: '#/deportistas' }, { t: a ? a.nombre : 'Deportista' }]);
    if (!a) { main.innerHTML = '<div class="nws-page"><div class="nws-empty nws-empty--page"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">Deportista no disponible</h1><a class="nws-btn" href="#/deportistas">Volver a la consulta</a></div></div>'; return; }
    document.title = a.nombre + ' · Naowee Suite';
    var part = a.part.slice().sort(function (x, y) { return x.fecha < y.fecha ? 1 : -1; });
    main.innerHTML = '<div class="nws-page dr"><a class="nws-iconbtn nws-iconbtn--lg nws-event-detail__back" href="#/deportistas" aria-label="Volver">' + ctx.icon('arrow-left') + '<span class="nws-event-detail__back-label">Volver</span></a>' +
      '<section class="cg-card dr-head"><span class="nws-avatar dr-av" aria-hidden="true">' + esc(iniciales(a.nombre)) + '</span><div><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">' + esc(a.nombre) + '</h1>' +
      '<p class="nwt-smalltext-font-regular nws-muted">' + esc(Object.keys(a.deportes).join(' · ')) + '</p></div>' +
      '<dl class="dr-kpis"><div><dt>Eventos</dt><dd>' + Object.keys(a.eventos).length + '</dd></div><div><dt>Participaciones</dt><dd>' + a.part.length + '</dd></div><div><dt>Medallas</dt><dd>' + medallas(a.med) + '</dd></div></dl></section>' +
      '<section class="cg-card"><h2 class="nwt-smalltext-font-bold">Trayectoria</h2><div class="cg-scroll"><table class="cg-tab"><thead><tr><th scope="col">Evento</th><th scope="col">Deporte</th><th scope="col">Prueba</th><th scope="col">Fecha</th><th scope="col">Puesto</th><th scope="col">Marca</th><th scope="col">Medalla</th></tr></thead><tbody>' +
      part.map(function (p) { return '<tr><td><a href="#/eventos/' + encodeURIComponent(p.code) + '">' + esc(p.evento) + '</a></td><td>' + esc(p.deporte) + '</td><td>' + esc(p.prueba + (p.fase ? ' · ' + p.fase : '')) + '</td><td>' + esc(OLC.fechaCorta(p.fecha)) + '</td><td>' + (p.puesto ? p.puesto + '.º' : '—') + '</td><td>' + esc(p.marca || '—') + '</td><td>' + esc(p.medalla || '—') + '</td></tr>'; }).join('') + '</tbody></table></div></section></div>';
  }

  /* Usuarios: administración. Los roles de las personas de la demo más algunos perfiles de apoyo. */
  function usuarios(main, ctx) {
    var base = R.orden.map(function (k) { var r = R.tabla[k]; return { n: r.persona, rol: r.etiqueta, est: 'Activo' }; });
    [['Andrés Felipe Mora', 'Gestor de eventos', 'Activo'], ['Camilo Restrepo', 'Gestor de eventos', 'Activo'], ['Marcela Duarte', 'Gestor de eventos', 'Activo'], ['Julián Pardo', 'Gestor de eventos', 'Invitado'],
      ['Verónica Alvarado', 'Gestor de eventos', 'Activo'], ['Iván Cárdenas', 'Metodólogo', 'Activo'], ['Natalia Rojas', 'Metodólogo', 'Activo'], ['Esteban Mejía', 'Metodólogo', 'Invitado']]
      .forEach(function (x) { base.push({ n: x[0], rol: x[1], est: x[2] }); });
    base.forEach(function (u) { u.c = u.n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '.') + '@ejemplo.co'; });
    var q = '', rol = '', pagina = 1, roles = {}; base.forEach(function (u) { roles[u.rol] = 1; });
    ctx.setTop([{ t: 'Usuarios' }]); document.title = 'Usuarios · Naowee Suite';
    main.innerHTML = '<div class="nws-page dr"><div class="nws-events-header"><div class="nws-events-header__description"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">Usuarios</h1><small class="nwt-smalltext-font-regular">Personas del módulo y el rol que tienen.</small></div></div>' +
      '<div class="dr-filtros" id="dr-fil"></div><p class="nwt-caption-font-regular nws-muted" id="dr-n" role="status"></p><div id="dr-res"></div></div>';
    filtros(document.getElementById('dr-fil'), { placeholder: 'Buscar usuario…', filtro: 'Todos los roles', valores: Object.keys(roles) }, function (nq, nr) { if (nq != null) q = nq; if (nr !== undefined) rol = nr; pagina = 1; pintar(); });
    function pintar() {
      var t = q.trim().toLowerCase(), l = base.filter(function (u) { return (!t || (u.n + ' ' + u.c).toLowerCase().indexOf(t) >= 0) && (!rol || u.rol === rol); });
      document.getElementById('dr-n').textContent = l.length + (l.length === 1 ? ' usuario' : ' usuarios');
      var box = document.getElementById('dr-res'), sl = l.slice((pagina - 1) * PAGE, pagina * PAGE);
      box.innerHTML = l.length ? '<div class="cg-scroll cg-card dr-card"><table class="cg-tab"><thead><tr><th scope="col">Usuario</th><th scope="col">Correo</th><th scope="col">Rol</th><th scope="col">Estado</th></tr></thead><tbody>' +
        sl.map(function (u) { return '<tr><td><span class="dr-n"><span class="nws-avatar" aria-hidden="true">' + esc(iniciales(u.n)) + '</span>' + esc(u.n) + '</span></td><td>' + esc(u.c) + '</td><td>' + esc(u.rol) + '</td><td>' + esc(u.est) + '</td></tr>'; }).join('') + '</tbody></table></div>'
        : '<div class="nws-empty"><p class="nwt-smalltext-font-bold">No hay usuarios con estos criterios</p></div>';
      pager(box, l.length, pagina, function (n) { pagina = n; pintar(); });
    }
    pintar();
  }
  return { deportistas: deportistas, perfil: perfil, usuarios: usuarios };
})();
