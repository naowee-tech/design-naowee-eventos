/* Pestaña Metodólogos: asignar y quitar metodólogos del evento, para todo el evento o para un deporte. Demo: se guarda en este navegador. */
window.Tabs = window.Tabs || {};
window.Tabs['metodologos'] = (function () {
  'use strict';
  var C = window.Campos, esc = C.esc;
  var POOL = [
    { nombre: 'Sofía Quintero', esp: 'Gimnasia' }, { nombre: 'Iván Cárdenas', esp: 'Atletismo' }, { nombre: 'Natalia Rojas', esp: 'Natación' },
    { nombre: 'Esteban Mejía', esp: 'Judo' }, { nombre: 'Paula Giraldo', esp: 'Ciclismo' }, { nombre: 'Gustavo Pineda', esp: 'Voleibol' }
  ];
  function render(el, ctx) {
    var key = 'eventos.metodologos.' + ctx.event.code, lista = C.leer(key, []), sel = { persona: '', alcance: 'Todos los deportes' };
    var deportes = ctx.data.deportes.map(function (d) { return d.nombre; });
    var libres = POOL.filter(function (p) { return !lista.some(function (a) { return a.nombre === p.nombre; }); });

    el.innerHTML = '<div class="mt"><section class="cg-card"><h3 class="nwt-smalltext-font-bold">Asignar metodólogo</h3><div class="cg-form" id="mt-form"></div><div class="cg-act"><span class="cg-msg nwt-caption-font-regular" id="mt-msg" role="status"></span><span id="mt-add"></span></div></section>' +
      '<section class="cg-card"><h3 class="nwt-smalltext-font-bold">Metodólogos del evento <span class="cg-n">' + lista.length + '</span></h3><div id="mt-lista"></div></section></div>';

    var $f = document.getElementById('mt-form');
    var dd1 = C.mk('nwt-dropdown', { label: 'Metodólogo', required: true, placeholder: libres.length ? 'Selecciona' : 'Ya están todos asignados', disabled: !libres.length, options: libres.map(function (p) { return { key: p.nombre.toLowerCase(), label: p.nombre + ' · ' + p.esp, value: p.nombre }; }), nwtSize: 'large' }, function (v) { sel.persona = v || ''; });
    var dd2 = C.mk('nwt-dropdown', { label: 'Alcance', value: sel.alcance, options: C.opciones(['Todos los deportes'].concat(deportes)), searchable: false, nwtSize: 'large' }, function (v) { sel.alcance = v || 'Todos los deportes'; });
    var a = document.createElement('div'), b = document.createElement('div'); a.appendChild(dd1); b.appendChild(dd2); $f.appendChild(a); $f.appendChild(b);

    var add = C.mk('nwt-button', { nwtVariant: 'loud', disabled: !libres.length }); add.textContent = 'Asignar';
    add.addEventListener('click', function () {
      if (!sel.persona) { dd1.error = true; var m = document.getElementById('mt-msg'); m.textContent = 'Selecciona un metodólogo.'; m.className = 'cg-msg cg-msg--err nwt-caption-font-regular'; return; }
      lista.push({ nombre: sel.persona, alcance: sel.alcance }); C.guardar(key, lista); render(el, ctx);
    });
    document.getElementById('mt-add').appendChild(add);

    var $l = document.getElementById('mt-lista');
    $l.innerHTML = lista.length ? '<div class="cg-scroll"><table class="cg-tab"><thead><tr><th scope="col">Metodólogo</th><th scope="col">Alcance</th><th scope="col"><span class="nws-sr">Quitar</span></th></tr></thead><tbody>' +
      lista.map(function (r, i) { return '<tr><td>' + esc(r.nombre) + '</td><td>' + esc(r.alcance) + '</td><td><button type="button" class="cg-x" data-i="' + i + '" aria-label="Quitar a ' + esc(r.nombre) + '">Quitar</button></td></tr>'; }).join('') + '</tbody></table></div>'
      : '<p class="nws-muted nwt-smalltext-font-regular">Este evento aún no tiene metodólogos asignados.</p>';
    $l.querySelectorAll('[data-i]').forEach(function (x) { x.addEventListener('click', function () { lista.splice(+x.getAttribute('data-i'), 1); C.guardar(key, lista); render(el, ctx); }); });
  }
  return { render: render };
})();
