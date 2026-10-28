/* Pestaña Organizaciones (solo eventos nacionales): organismos invitados a participar. Quien gestiona el evento invita y quita; el resto la ve en solo lectura.
   Un evento creado en la demo nace sin organizaciones (incompleto); los de ejemplo traen su organismo organizador. Se guarda en este navegador. */
window.OrgsEvento = (function () {
  'use strict';
  var C = window.Campos;
  var POOL = ['Liga de Atletismo de Antioquia', 'Liga Vallecaucana de Natación', 'Federación Colombiana de Judo', 'Liga de Voleibol del Valle', 'Liga Bogotana de Judo',
    'Federación Colombiana de Atletismo', 'Liga de Natación del Valle', 'Comité Paralímpico Colombiano', 'Liga de Ciclismo de Cundinamarca', 'Federación Colombiana de Natación'];
  function lista(ev) { return C.leer('eventos.organizaciones.' + ev.code, ev.creado ? [] : (ev.organismo ? [ev.organismo] : [])); }
  function guardar(ev, arr) { C.guardar('eventos.organizaciones.' + ev.code, arr); if (api.alCambiar) api.alCambiar(ev); }
  var api = { pool: POOL, lista: lista, guardar: guardar };
  return api;
})();

window.Tabs = window.Tabs || {};
window.Tabs['organizaciones'] = (function () {
  'use strict';
  var C = window.Campos, esc = C.esc, O = window.OrgsEvento;
  function render(el, ctx) {
    var ev = ctx.event, lista = O.lista(ev), puede = window.ROLES.gestiona(ev);
    var libres = O.pool.filter(function (o) { return lista.indexOf(o) < 0; });
    var sel = '';

    el.innerHTML = '<div class="mt' + (puede ? '' : ' mt--uno') + '">' +
      (puede ? '<section class="cg-card"><h3 class="nwt-smalltext-font-bold">Invitar organización</h3><div class="cg-form cg-form--uno" id="og-form"></div><div class="cg-act"><span class="cg-msg nwt-caption-font-regular" id="og-msg" role="status"></span><span id="og-add"></span></div></section>' : '') +
      '<section class="cg-card"><h3 class="nwt-smalltext-font-bold">Organizaciones invitadas <span class="cg-n">' + lista.length + '</span></h3><div id="og-lista"></div></section></div>';

    if (puede) {
      var dd = C.mk('nwt-dropdown', { label: 'Organización', required: true, placeholder: libres.length ? 'Busca una liga o federación' : 'Ya están todas invitadas', disabled: !libres.length, options: C.opciones(libres), nwtSize: 'large' }, function (v) { sel = v || ''; });
      var w = document.createElement('div'); w.appendChild(dd); document.getElementById('og-form').appendChild(w);
      var add = C.mk('nwt-button', { nwtVariant: 'loud', disabled: !libres.length }); add.textContent = 'Invitar';
      add.addEventListener('click', function () {
        if (!sel) { dd.error = true; var m = document.getElementById('og-msg'); m.textContent = 'Selecciona una organización.'; m.className = 'cg-msg cg-msg--err nwt-caption-font-regular'; return; }
        lista.push(sel); O.guardar(ev, lista); render(el, ctx);
      });
      document.getElementById('og-add').appendChild(add);
    }
    var $l = document.getElementById('og-lista');
    $l.innerHTML = lista.length ? '<div class="cg-scroll"><table class="cg-tab"><thead><tr><th scope="col">Organización</th><th scope="col">Estado</th>' + (puede ? '<th scope="col"><span class="nws-sr">Quitar</span></th>' : '') + '</tr></thead><tbody>' +
      lista.map(function (o, i) { return '<tr><td>' + esc(o) + (o === ev.organismo ? ' <span class="cg-tag">Organizador</span>' : '') + '</td><td>Invitada</td>' + (puede ? '<td><button type="button" class="cg-x" data-i="' + i + '" aria-label="Quitar a ' + esc(o) + '">Quitar</button></td>' : '') + '</tr>'; }).join('') + '</tbody></table></div>'
      : '<p class="nws-muted nwt-smalltext-font-regular">Este evento aún no tiene organizaciones invitadas.' + (puede ? ' Invita al menos una para que pueda operar.' : '') + '</p>';
    $l.querySelectorAll('[data-i]').forEach(function (x) { x.addEventListener('click', function () { lista.splice(+x.getAttribute('data-i'), 1); O.guardar(ev, lista); render(el, ctx); }); });
  }
  return { render: render };
})();
