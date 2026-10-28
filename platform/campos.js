/* Ayudas comunes de los formularios: crear elementos del SDK (nwt-*) con sus propiedades, y guardar en localStorage. */
window.Campos = (function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* Crea un nwt-* y le pasa las propiedades cuando el componente ya está definido; `cambio(valor, el)` escucha nwtChange. */
  function mk(tag, props, cambio) {
    var el = document.createElement(tag);
    function aplicar() { Object.keys(props || {}).forEach(function (k) { el[k] = props[k]; }); }
    aplicar();
    if (window.customElements) customElements.whenDefined(tag).then(aplicar);
    if (cambio) el.addEventListener('nwtChange', function (ev) { cambio(ev.detail, el); });
    return el;
  }
  function leer(clave, vacio) { try { var v = JSON.parse(localStorage.getItem(clave)); return v == null ? vacio : v; } catch (e) { return vacio; } }
  function guardar(clave, valor) { try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* queda solo en memoria */ } }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function opciones(arr) { return arr.map(function (o) { var v = typeof o === 'string' ? o : o.value, l = typeof o === 'string' ? o : o.label; return { key: String(v).toLowerCase(), label: l, value: v }; }); }
  return { esc: esc, mk: mk, leer: leer, guardar: guardar, iso: iso, opciones: opciones };
})();
