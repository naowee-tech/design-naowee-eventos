/* Dentro de demo.html, avisa la ruta al marco para que el panel conmute conservando dónde estás. */
(function () {
  if (window.parent === window) return;
  function avisar() { try { window.parent.postMessage({ type: 'olc-ruta', hash: location.hash || '' }, '*'); } catch (e) {} }
  window.addEventListener('hashchange', avisar); avisar();
})();
