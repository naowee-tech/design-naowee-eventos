/* Pasos asistidos por HU: spotlight + tarjeta con tarea, propósito y «Paso N de M».
   Arranca con ?tour=HU-NN (demo.html lo agrega al elegir un caso). Motor portado de design-naowee-organismos/shared/tour.js. */
(function () {
  'use strict';
  if (window.__eventosTour) return; window.__eventosTour = true;

  var qs = new URLSearchParams(location.search);
  var embebido = window.parent !== window;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ayudas para los pasos que precargan un ejemplo ---------- */
  function q(sel) { return document.querySelector(sel); }
  /* Pone el valor y avisa con el mismo evento que usa el formulario; false = el componente aún no está listo. */
  function setv(sel, v) {
    var el = q(sel); if (!el || (window.customElements && !customElements.get(el.localName))) return false;
    el.value = v; el.dispatchEvent(new CustomEvent('nwtChange', { detail: v, bubbles: true })); return true;
  }
  /* Elige una opción de un grupo de radios del formulario (tipo, alcance); false = aún no está pintado. */
  function marcar(sel, v) {
    var el = q(sel + ' input[value="' + v + '"]'); if (!el) return false;
    if (!el.checked) el.click(); return true;
  }
  function abrirOrigen(abrir) {
    var b = q('#nws-origen .nws-orig__btn'); if (!b) return false;
    if ((b.getAttribute('aria-expanded') === 'true') !== abrir) b.click(); return true;
  }
  function marcarOrigen(v) {
    var cb = q('#nws-origen [data-o="' + v + '"]'); if (!cb) return false;
    if (!cb.checked) { cb.checked = true; cb.dispatchEvent(new CustomEvent('nwtChange', { detail: true, bubbles: true })); } return true;
  }
  var TAB = '#nws-tabstrip', GUARDAR = '#cr-actions nwt-button + nwt-button button', NUEVO = '#/eventos/nuevo';

  /* ---------- catálogo: una entrada por HU (misma numeración que hu-demo.js) ---------- */
  var TOURS = {
    'HU-01': { rol: 'admin', go: '#/eventos', title: 'Ver solo los eventos SUID', purpose: 'Tu lista muestra únicamente los eventos que se crean en SUID.',
      steps: [
        { sel: '.nws-events-header', body: 'Esta es la lista de <b>Eventos</b>. Con la capa <b>Solo SUID</b> ves únicamente lo que se crea aquí: no aparecen los eventos del ciclo ni los eventos completos de otros sistemas.' },
        { sel: '.nws-events-catalog__filters', body: 'El filtro <b>Origen</b> no se ve: con un solo origen no hay nada que elegir. Aparece cuando el panel está en <b>Ver todo</b>.' },
        { sel: '.nws-ec', body: 'Todas las tarjetas miden lo mismo. Si los chips no caben en una línea, el resto pasa a un contador <b>+N</b> (con el cursor encima ves cuáles son).' }
      ] },
    'HU-02': { rol: 'admin', go: NUEVO, title: 'Crear un evento competitivo', purpose: 'Un evento competitivo cierra con resultados, posiciones y medallería.',
      steps: [
        { sel: '#c-tipoev', ejemplo: 1, pre: function () { return marcar('#c-tipoev', 'competitivo'); }, body: 'Primero eliges el <b>tipo de evento</b> en una tarjeta. Con <b>Competitivo</b> el formulario pide lo básico y deja los deportes como opcionales.' },
        { sel: '#c-nombre', body: 'Escribe el <b>nombre</b> y las <b>fechas</b> de inicio y fin. El nombre no puede repetir el de otro evento.' },
        { sel: '#c-depto', body: 'En un evento <b>nacional</b> el lugar es departamento y municipio.' },
        { sel: '#c-deportes', body: 'Los <b>deportes</b> son opcionales: sin elegir ninguno, el evento queda <b>multideportivo</b>.' },
        { sel: GUARDAR, body: 'Al <b>Guardar</b> vuelves a la lista y el evento nuevo queda resaltado un momento.' }
      ] },
    'HU-03': { rol: 'admin', go: NUEVO, title: 'Crear Actividad Física', purpose: 'Al elegir el tipo, el formulario pide solo los campos propios de ese tipo.',
      steps: [
        { sel: '#c-tipoev', ejemplo: 1, pre: function () { return marcar('#c-tipoev', 'actividad_fisica'); }, body: 'El <b>tipo de evento</b> manda. Aquí está elegida <b>Actividad Física</b>; más abajo aparece la sección <b>Detalles del tipo</b> con una ayuda de cómo cierra.' },
        { sel: '#c-programa', body: 'Pide un <b>programa estándar</b> (HEVS, Vías Activas, etc.). Si no está en la lista, eliges <b>Otro programa</b> y escribes el nombre.' },
        { sel: '#c-modulos', body: 'Agrega las <b>temáticas o módulos</b> que se trabajan, una por una con <b>Agregar</b>. Se necesita al menos una.' },
        { sel: '#c-sesiones', body: 'Indica el <b>número de sesiones</b> y la <b>evaluación</b> (por asistencia o por aprobación). Fíjate que no hay campo de deportes: este tipo no tiene.' }
      ] },
    'HU-04': { rol: 'admin', go: NUEVO, title: 'Crear un evento internacional', purpose: 'En un evento internacional los países son obligatorios.',
      steps: [
        { sel: '#cr-alcance', ejemplo: 1, pre: function () { return marcar('#cr-alcance', 'INTERNACIONAL'); }, body: 'El <b>alcance</b> se elige al crear y no se puede cambiar después. Aquí está elegido <b>Internacional</b>.' },
        { sel: '.nws-flash--info', body: 'El aviso lo recuerda: se hace seguimiento a los <b>deportistas de Colombia</b>; los rivales se registran en los resultados.' },
        { sel: '#c-paises', body: 'En lugar de departamento y municipio, el lugar es uno o varios <b>países</b>. Es <b>obligatorio</b>.' },
        { sel: GUARDAR, click: true, wait: 350, body: 'Pulsa <b>Guardar</b> sin elegir países para ver qué pasa (no se crea nada).' },
        { sel: '#c-paises .nwt-dropdown, #c-paises', body: 'El campo de países queda marcado en error: sin al menos un país no se puede guardar.' }
      ] },
    'HU-05': { rol: 'admin', go: NUEVO, title: 'Probar un nombre repetido', purpose: 'No se puede crear un evento con el nombre de otro que ya existe, sea del origen que sea.',
      steps: [
        { sel: '#c-nombre', ejemplo: 1, pre: function () { return setv('#c-nombre nwt-text-field', 'Copa Nacional de Voleibol'); }, body: 'Escribimos el nombre de un evento que ya existe: <b>Copa Nacional de Voleibol</b>.' },
        { sel: GUARDAR, click: true, wait: 350, body: 'Pulsa <b>Guardar</b>: el formulario compara el nombre contra todos los eventos.' },
        { sel: '#cr-err', body: 'Aparece el aviso <b>«Ya existe un evento con un nombre similar»</b> con el nombre del que choca. Si es un evento completo, también lo dice. No se crea nada.' }
      ] },
    'HU-06': { rol: 'admin', go: '#/eventos/hevs-barranquilla-2026/editar', title: 'Editar un evento SUID', purpose: 'Puedes cambiar un evento tuyo; el tipo y sus campos propios se conservan.',
      steps: [
        { sel: '.cr-head', body: 'Es el mismo formulario de crear, ya con los datos del evento. Solo puedes editar eventos <b>SUID</b>.' },
        { sel: '#cr-alcance', body: 'El <b>alcance</b> se ve pero no se cambia: queda fijo desde que se creó.' },
        { sel: '#c-tipoev', body: 'El <b>tipo de evento</b> y sus campos propios (programa, temáticas, sesiones) vienen cargados y se conservan al guardar.' },
        { sel: GUARDAR, body: '<b>Guardar cambios</b> solo se activa cuando cambias algo.' }
      ] },
    'HU-07': { rol: 'admin', go: '#/eventos', ver: 'todos', title: 'Ver todo y filtrar por Origen', purpose: 'Con «Ver todo» la lista suma los eventos del ciclo y los completos, y se filtra por su origen.',
      steps: [
        { sel: '#nws-origen', click: true, pre: function () { return abrirOrigen(false); }, body: 'Con <b>Ver todo</b> aparece el filtro <b>Origen</b>. Ábrelo.' },
        { sel: '#nws-origen .nws-orig__panel', pre: function () { return abrirOrigen(true); }, body: 'Cada origen (SUID, Comité Olímpico, Evento nacional oficial, Liga) trae su cantidad. <b>Todos</b> quita el filtro; puedes marcar varios.' },
        { sel: '.nws-ec:has(.nws-chip--full) .ec-sub', pre: function () { return abrirOrigen(false); }, body: 'Cada tarjeta lleva <b>chips de origen</b>: el Ciclo Olímpico va primero y el <b>Evento nacional oficial</b> (bandera) marca los completos. El resto pasa a <b>+N</b> si no cabe.' },
        { sel: '#nws-count', ejemplo: 1, pre: function () { return marcarOrigen('full'); }, body: 'Al elegir un origen aparece su <b>chip</b> junto al conteo; un clic en el chip lo quita.' }
      ] },
    'HU-08': { rol: 'admin', go: '#/eventos/copa-coc-cali-2026', ver: 'todos', title: 'Consultar un evento del ciclo', purpose: 'Un evento del Ciclo Olímpico se consulta desde SUID, sin editarlo ni cargarle datos.',
      steps: [
        { sel: '.nws-event-detail__titlebox', body: 'Este evento es del <b>Ciclo Olímpico</b> (lo dice la insignia). No lo creó SUID.' },
        { sel: '.nws-event-detail__bar', body: 'Solo está <b>Volver</b>: no hay botón <b>Editar evento</b>. Un rol SUID solo edita eventos SUID.' },
        { sel: TAB, body: 'Las pestañas son las de <b>consulta</b>: Información, Deportes, Organizaciones y Analítica. No hay <b>Cargas</b>.' }
      ] },
    'HU-09': { rol: 'admin', go: '#/eventos/intercolegiados-nacionales-2026', ver: 'todos', title: 'Consultar un evento completo', purpose: 'Un evento completo lo administra otro sistema: aquí solo se consulta.',
      steps: [
        { sel: '.nws-event-detail__titlebox', body: 'La insignia <b>Evento completo</b> indica que el evento se administra en otro sistema.' },
        { sel: '.nws-event-detail__bar', body: 'No hay <b>Editar evento</b>: es solo de consulta.' },
        { sel: TAB, body: 'Solo hay dos pestañas: <b>Información</b> y <b>Deportes</b>.' },
        { sel: '#nws-panel .nws-flash--info', body: 'Un aviso explica que deportistas, resultados y medallería de este evento <b>todavía no están disponibles</b>.' }
      ] },
    'HU-10': { rol: 'admin', go: '#/eventos?vista=calendario', hoy: '2026-10-05', title: 'Calendario sin eventos', purpose: 'Si el mes no tiene eventos, el calendario lo dice en vez de quedar vacío.',
      steps: [
        { sel: '.nws-cal__nav', body: 'El calendario muestra un mes. Con las flechas cambias de mes y con <b>Hoy</b> vuelves al actual.' },
        { sel: '.nws-empty', ejemplo: 1, pre: function () { if (q('.nws-empty')) return true; var b = q('[data-mes="1"]'); if (b) b.click(); return false; }, body: 'Avanzamos hasta un mes sin eventos: aparece <b>«Sin eventos este mes»</b> con la sugerencia de cambiar de mes o ajustar filtros.' },
        { sel: '.nws-seg', body: 'Con estos botones vuelves a la vista de tarjetas o lista.' }
      ] },
    'HU-11': { rol: 'gestor', go: '#/eventos/nacional-voleibol-2026?tab=cargas', title: 'Cargar resultados de un evento mío', purpose: 'El gestor carga inscripciones, resultados y medallería solo en sus eventos SUID competitivos.',
      steps: [
        { sel: TAB, body: 'Como este evento es <b>tuyo</b>, ves las pestañas de carga al final: inscripciones, resultados y medallería.' },
        { sel: '#cg-tpl', body: 'Descarga la <b>plantilla</b> para diligenciarla.' },
        { sel: '#cg-drop', body: 'Sube el archivo aquí. Antes de confirmar ves una vista previa con las filas válidas y las que tienen error.' }
      ] },
    'HU-12': { rol: 'gestor', go: '#/eventos/hevs-barranquilla-2026', title: 'Ver un evento no competitivo', purpose: 'Un evento sin deportes no tiene resultados ni medallería, así que no tiene Cargas.',
      steps: [
        { sel: '.nws-event-detail__titlebox', body: 'El rótulo es el <b>tipo de evento</b> (Actividad Física), no un deporte.' },
        { sel: TAB, body: 'No hay <b>Cargas</b> ni <b>Deportes</b>: no hay resultados ni medallería que registrar.' },
        { sel: '.nws-event-detail__list', body: 'La información muestra los campos propios del tipo: programa, temáticas, sesiones y evaluación.' }
      ] },
    'HU-13': { rol: 'gestor', go: '#/eventos', title: 'Intentar crear un evento', purpose: 'El gestor no crea eventos: solo carga datos en los que tiene asignados.',
      steps: [
        { sel: '.nws-events-header', body: 'Arriba a la derecha <b>no hay botón Crear evento</b>: este rol no crea.' },
        { sel: '#nws-scope', body: '<b>Mis eventos</b> son los que tienes asignados; <b>Todos los eventos</b> es de solo consulta.' },
        { sel: '.nws-ec', body: 'Las tarjetas son iguales para todos los roles: mismo tamaño y chips de origen.' }
      ] },
    'HU-14': { rol: 'usuario', go: '#/eventos', ver: 'suid', title: 'Consultar la lista de eventos', purpose: 'El usuario del módulo solo consulta, sin crear ni cargar.',
      steps: [
        { sel: '.nws-events-header', body: 'Es una lista de <b>solo lectura</b>: no hay botón de crear.' },
        { sel: '.nws-events-catalog__filters', body: 'Filtras por <b>estado</b> y cambias de vista (tarjetas, lista o calendario).' },
        { sel: '.nws-ec', body: 'Cada tarjeta mide lo mismo; los chips que no caben pasan a <b>+N</b>. Un clic abre el evento.' }
      ] },
    'HU-15': { rol: 'usuario', go: '#/eventos/nacional-voleibol-2026?tab=analitica', title: 'Ver la analítica de un evento', purpose: 'La analítica resume el evento competitivo en cifras y gráficos.',
      steps: [
        { sel: TAB, body: 'La pestaña <b>Analítica</b> está disponible para tu rol. No hay pestañas de carga.' },
        { sel: '.an-kpis', body: 'Arriba, las <b>cifras clave</b> del evento.' },
        { sel: '.an-grid', body: 'Debajo, los gráficos de participación.' }
      ] },
    'HU-16': { rol: 'usuario', go: '#/eventos/hevs-barranquilla-2026', title: 'Ver Actividad Física', purpose: 'Un evento de Actividad Física muestra información propia y pocas pestañas.',
      steps: [
        { sel: '.nws-event-detail__titlebox', body: 'El evento muestra su tipo, <b>Actividad Física</b>, en lugar de un deporte.' },
        { sel: TAB, body: 'Pestañas por tipo: Información, Organizaciones y Analítica. Sin <b>Deportes</b> ni <b>Cargas</b>.' },
        { sel: '.nws-event-detail__list', body: 'En Información: programa estándar, temáticas, número de sesiones y evaluación.' }
      ] },
    'HU-17': { rol: 'metodologo', go: '#/eventos', title: 'Entrar al módulo de eventos', purpose: 'El metodólogo no usa este módulo: califica desde su propia vista.',
      steps: [
        { sel: '.nws-empty--page', body: 'En lugar de la lista ves un aviso: <b>«Este módulo no es para tu rol»</b>.' },
        { sel: '#nws-rolsw', body: 'Aquí ves con qué usuario y rol estás en sesión.' }
      ] },
    'HU-18': { rol: 'comite', go: '#/eventos', title: 'Ver solo eventos del ciclo', purpose: 'El sistema le entrega al Comité únicamente los eventos del Ciclo Olímpico.',
      steps: [
        { sel: '.nws-events-header', body: 'Sin botón de crear: el Comité <b>consulta</b>.' },
        { sel: '.nws-ec', body: 'Todas las tarjetas son del <b>Ciclo Olímpico</b> (chip morado). No hay eventos de otros orígenes.' },
        { sel: '#nws-estado', body: 'Filtras por estado. El filtro Origen no aparece: solo hay un origen.' }
      ] },
    'HU-19': { rol: 'comite', go: '#/eventos/copa-coc-cali-2026?tab=inscripciones', title: 'Consultar deportistas del ciclo', purpose: 'El Comité ve la lista nominal de deportistas inscritos en un evento del ciclo.',
      steps: [
        { sel: TAB, body: 'La pestaña <b>Nominal</b> es de tu rol. No hay pestañas de carga.' },
        { sel: '.nwtab-in-kpis', body: 'Arriba, las cifras de inscripción.' },
        { sel: '.nwtab-in-tw', body: 'Debajo, la tabla de deportistas con filtros.' }
      ] },
    'HU-20': { rol: 'comite_manager', go: '#/eventos/copa-coc-cali-2026?tab=medalleria', title: 'Ver resultados y medallería', purpose: 'El gestor del Comité suma resultados, medallería y boletines a lo que ve el Comité.',
      steps: [
        { sel: TAB, body: 'Además de Nominal, tienes <b>Calendario y resultados</b>, <b>Medallería</b> y <b>Boletines técnicos</b>.' },
        { sel: '.nwtab-md-top', body: 'Aquí está la <b>Medallería</b> del evento, que solo ven los roles del Comité.' }
      ] },
    'HU-21': { rol: 'comite_manager', go: '#/eventos/copa-coc-cali-2026?tab=metodologos', title: 'Asignar metodólogos', purpose: 'El gestor del Comité asigna los metodólogos que califican el evento.',
      steps: [
        { sel: TAB, body: 'La pestaña <b>Metodólogos</b> solo existe en eventos del ciclo y para este rol.' },
        { sel: '#mt-lista', body: 'Aquí están los metodólogos asignados al evento.' },
        { sel: '#mt-form', body: 'Para sumar uno, lo eliges y lo agregas con el botón.' }
      ] },
    'HU-22': { rol: 'comite_admin', go: NUEVO, title: 'Crear un evento del ciclo', purpose: 'Propuesto: el evento nace como del Ciclo Olímpico sin que haya que marcarlo.',
      steps: [
        { sel: '.cr-head', body: 'Es el formulario de crear. Este rol <b>solo crea eventos del ciclo</b>.' },
        { sel: '#c-ciclo-info', body: 'No hay interruptor de ciclo: la nota dice que el evento <b>se crea como del Ciclo Olímpico</b> automáticamente.' },
        { sel: '#c-tipoev', body: 'El resto es igual: <b>tipo de evento</b> y los campos propios de cada tipo.' }
      ] },
    'HU-23': { rol: 'comite_admin', go: '#/eventos/copa-coc-cali-2026/editar', title: 'Editar un evento del ciclo', purpose: 'Solo se editan los eventos del ciclo; los demás son de consulta.',
      steps: [
        { sel: '.cr-head', body: 'Editas un evento del <b>Ciclo Olímpico</b>. En los de otros orígenes no aparece <b>Editar</b>.' },
        { sel: '#cr-alcance', body: 'El <b>alcance</b> queda fijo.' },
        { sel: '#c-ciclo-info', body: 'Sigue siendo del ciclo, sin interruptor. Tampoco hay selector de tipo para estos eventos.' },
        { sel: GUARDAR, body: '<b>Guardar cambios</b> se activa cuando modificas algo.' }
      ] },
    'HU-24': { rol: 'viewer', go: '#/eventos/copa-coc-cali-2026?tab=deportes', title: 'Ver Deportes y analítica', purpose: 'El visualizador tiene el menor acceso: eventos del ciclo y pocas pestañas.',
      steps: [
        { sel: TAB, body: 'Solo ves <b>Información</b>, <b>Deportes</b>, <b>Organizaciones</b> y <b>Analítica</b>.' },
        { sel: '.nwtab-dp__nm', body: 'La pestaña <b>Deportes</b> lista los deportes del evento, uno por uno.' }
      ] }
  };

  /* ---------- estado ---------- */
  /* En el marco de la demo el botón «Configuraciones» flota abajo a la derecha (en móvil demo.html lo oculta durante el recorrido). */
  function pie() { return embebido && window.innerWidth > 760 ? 60 : 0; }
  var cur = null, n = 0, retry = null, acted = false, el = null, fresh = false, prevFocus = null, ocupa = 0, pend = 0;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function visible(e) {
    if (!e || !e.getClientRects().length) return false;
    var r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden';
  }
  function find(sel) {
    var l = sel.split(/,\s*(?![^()]*\))/);
    for (var i = 0; i < l.length; i++) { var e = null; try { e = document.querySelector(l[i].trim()); } catch (x) { /* selector inválido */ } if (visible(e)) return e; }
    return null;
  }
  function mk(tag, cls, id) { var e = document.createElement(tag); e.className = cls; e.id = id; document.body.appendChild(e); return e; }

  /* ---------- render de un paso (reintenta hasta que exista el elemento) ---------- */
  function render() {
    var t = TOURS[cur], step = t.steps[n], tries = 0;
    clearTimeout(retry);
    (function buscar() {
      var listo = true;
      if (step.pre) { try { listo = step.pre() !== false; } catch (x) { listo = false; } }
      var e = listo ? find(step.sel) : null;
      if ((e && listo) || tries > 30) { pintar(t, step, e); return; }
      tries++; retry = setTimeout(buscar, 120);
    })();
  }
  function pintar(t, step, e) {
    var card = document.getElementById('tr-card') || mk('div', 'tr-card', 'tr-card');
    var last = n === t.steps.length - 1, primera = !card.hasAttribute('data-n');
    el = e; acted = false;
    card.setAttribute('role', 'dialog'); card.setAttribute('aria-labelledby', 'tr-title'); card.setAttribute('aria-describedby', 'tr-body'); card.tabIndex = -1;
    card.setAttribute('data-n', n); card.setAttribute('data-ok', e ? '1' : '0');
    card.innerHTML = '<div class="tr-h"><span class="tr-chip">' + cur + '</span><button type="button" class="tr-x" data-a="x" aria-label="Cerrar pasos guiados">&times;</button></div>' +
      '<div class="tr-title" id="tr-title">' + esc(t.title) + '</div><div class="tr-purpose">' + esc(t.purpose) + '</div>' +
      '<div class="tr-body" id="tr-body" aria-live="polite">' + step.body + '</div>' +
      (step.ejemplo ? '<p class="tr-ej">Ejemplo precargado para que lo veas; no se guarda nada.</p>' : '') +
      '<div class="tr-f"><span class="tr-count">Paso ' + (n + 1) + ' de ' + t.steps.length + '</span><div class="tr-btns">' +
      (n ? '<button type="button" class="tr-btn" data-a="prev">Anterior</button>' : '') +
      '<button type="button" class="tr-btn tr-btn--p" data-a="' + (last ? 'done' : 'next') + '">' + (last ? 'Finalizar' : 'Siguiente') + '</button></div></div>';
    var spot = document.getElementById('tr-spot') || mk('div', 'tr-spot', 'tr-spot'), bd = document.getElementById('tr-backdrop');
    if (e) { if (bd) bd.style.display = 'none'; spot.style.display = 'block'; fresh = fresh || primera; revelar(e); }
    else { spot.style.display = 'none'; (bd || mk('div', 'tr-backdrop', 'tr-backdrop')).style.display = 'block'; }
    posicionar();
    setTimeout(function () { if (cur && el === e) posicionar(); }, 320);
    var foco = (!primera && card.querySelector('[data-a=next],[data-a=done]')) || card;
    if (primera) prevFocus = document.activeElement;
    foco.focus({ preventScroll: true });
  }

  /* Lleva el elemento a una zona donde ni el encabezado fijo ni la tarjeta lo tapen. */
  function revelar(e) {
    var hd = q('.nws-head'), arriba = (hd ? hd.offsetHeight : 56) + 56, r = e.getBoundingClientRect(), alto = window.innerHeight, chico = (window.innerWidth - ocupa) <= 640;
    var card = document.getElementById('tr-card'), libre = chico ? alto - (card ? card.offsetHeight : 220) - 24 - pie() : alto - 24;
    /* Holgura al final de la página para poder subir elementos que quedan abajo, detrás de la tarjeta. */
    (q('.nws-main') || document.body).style.paddingBottom = chico && card ? Math.max(card.offsetHeight + pie() + 24, alto - arriba) + 'px' : '';
    r = e.getBoundingClientRect();
    if (r.top >= arriba && r.bottom <= libre) return;
    var objetivo = chico || r.height > alto * 0.5 ? arriba : Math.max(arriba, (alto - r.height) / 2);
    try { window.scrollBy({ top: r.top - objetivo, behavior: reduce ? 'auto' : 'smooth' }); } catch (x) { window.scrollBy(0, r.top - objetivo); }
  }

  /* ---------- posición del recuadro y de la tarjeta ---------- */
  function posicionar() {
    var card = document.getElementById('tr-card'), spot = document.getElementById('tr-spot'); if (!card || !cur) return;
    /* Con el panel de la demo abierto el marco queda corrido: lo visible es [ocupa, innerWidth]. */
    var L = ocupa, W = window.innerWidth, H = window.innerHeight, m = 12, r = null;
    if (el && visible(el) && document.body.contains(el)) {
      r = el.getBoundingClientRect();
      var pad = 4, rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      if (fresh) spot.style.transition = 'none';
      spot.style.display = 'block'; spot.style.top = (r.top - pad) + 'px'; spot.style.left = (r.left - pad) + 'px';
      spot.style.width = (r.width + pad * 2) + 'px'; spot.style.height = (r.height + pad * 2) + 'px'; spot.style.borderRadius = (rad ? rad + pad : 10) + 'px';
      if (fresh) { void spot.offsetWidth; spot.style.transition = ''; fresh = false; }
      var bd = document.getElementById('tr-backdrop'); if (bd) bd.style.display = 'none';
    } else if (spot) { spot.style.display = 'none'; }
    var chico = W - L <= 640;
    card.classList.toggle('tr-card--dock', chico);
    card.style.right = chico ? m + 'px' : 'auto';
    card.style.width = chico ? 'auto' : Math.min(360, W - L - 2 * m) + 'px';
    if (chico) { card.style.left = m + 'px'; card.style.top = 'auto'; card.style.bottom = (m + pie()) + 'px';
      /* Un elemento alto se recorta sobre la tarjeta: se resalta lo visible, no lo que queda debajo. */
      var tope = H - pie() - m - card.offsetHeight - 8;
      if (r && r.bottom + 4 > tope && r.top < tope - 30) spot.style.height = (tope - r.top + 4) + 'px';
      return; }
    card.style.bottom = 'auto';
    var cw = card.offsetWidth, ch = card.offsetHeight, x, y, c = [];
    if (!r) { card.style.left = Math.max(L + m, (W + L - cw) / 2) + 'px'; card.style.top = Math.max(m, (H - ch) / 2) + 'px'; return; }
    var cx = function (v) { return Math.min(Math.max(L + m, v), W - cw - m); }, cy = function (v) { return Math.min(Math.max(m, v), H - ch - m); };
    c = [[cx(r.left), r.bottom + 16], [cx(r.left), r.top - ch - 16], [r.right + 16, cy(r.top)], [r.left - cw - 16, cy(r.top)]];
    var tapa = function (p) { return pie() && !ocupa && p[0] + cw > W - 200 && p[1] + ch > H - pie() - m; };
    var ok = c.filter(function (p) { return p[0] >= L + m && p[1] >= m && p[0] + cw <= W - m && p[1] + ch <= H - m && !tapa(p); })[0];
    if (!ok) ok = [pie() && !ocupa ? L + m : W - cw - m, H - ch - m]; /* sin hueco: esquina inferior */
    card.style.left = ok[0] + 'px'; card.style.top = ok[1] + 'px';
  }
  function reubicar() { if (!cur) return; cancelAnimationFrame(pend); pend = requestAnimationFrame(posicionar); }

  /* ---------- navegación ---------- */
  function ir(delta) { var t = TOURS[cur]; n = Math.min(t.steps.length - 1, Math.max(0, n + delta)); render(); }
  function siguiente() {
    var t = TOURS[cur], s = t.steps[n];
    if (n === t.steps.length - 1) { fin('terminado'); return; }
    var tgt = s.click && find(s.sel);
    if (tgt) { try { tgt.click(); } catch (x) { /* el clic es de cortesía */ } var id = cur; setTimeout(function () { if (cur === id) ir(1); }, s.wait || 350); return; }
    ir(1);
  }
  function fin(motivo) {
    var id = cur; if (!id) return;
    clearTimeout(retry); cur = null; el = null; (q('.nws-main') || document.body).style.paddingBottom = '';
    ['tr-spot', 'tr-card', 'tr-backdrop'].forEach(function (i) { var e = document.getElementById(i); if (e) e.remove(); });
    try { var u = new URL(location.href); u.searchParams.delete('tour'); history.replaceState(null, '', u); } catch (x) { /* sin historial */ }
    try { if (prevFocus && document.body.contains(prevFocus)) prevFocus.focus({ preventScroll: true }); } catch (x) { /* foco perdido */ }
    if (embebido) { try { window.parent.postMessage({ tour: 'fin', id: id, motivo: motivo }, '*'); } catch (x) { /* sin padre */ } }
  }
  function iniciar(id) { if (!TOURS[id]) return; cur = id; n = 0; fresh = true; var c = document.getElementById('tr-card'); if (c) c.remove(); render(); }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#tr-card [data-a]'); if (!b) return;
    var a = b.getAttribute('data-a');
    if (a === 'x' || a === 'done') fin(a === 'x' ? 'cerrado' : 'terminado'); else if (a === 'prev') ir(-1); else siguiente();
  });
  document.addEventListener('keydown', function (e) {
    if (!cur) return;
    var card = document.getElementById('tr-card');
    if (e.key === 'Escape') { e.preventDefault(); fin('cerrado'); return; }
    if (e.key === 'Tab' && card && card.contains(document.activeElement)) {
      var f = [].slice.call(card.querySelectorAll('button')), i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      return;
    }
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.target.closest && e.target.closest('input,textarea,select,[contenteditable],nwt-text-field,nwt-text-area,nwt-dropdown,nwt-date-field,nwt-tabs,nwt-tag-group,nwt-checkbox,nwt-radio-group')) return;
    e.preventDefault(); if (e.key === 'ArrowRight') siguiente(); else ir(-1);
  }, true);
  window.addEventListener('resize', reubicar);
  window.addEventListener('scroll', reubicar, true);
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.demo !== 'panel') return;
    ocupa = +e.data.ocupa || 0; reubicar();
  });

  /* ---------- arranque ---------- */
  function boot() {
    var id = qs.get('tour'), t = TOURS[id]; if (!t) return;
    /* Suelto (sin demo.html) se alinean rol y capas con los de la HU; si faltan, se recarga una vez. */
    if (!embebido) {
      var u = new URL(location.href), cambio = false;
      if (window.ROLES.actual !== t.rol || u.searchParams.get('rol') !== t.rol) { u.searchParams.set('rol', t.rol); cambio = true; }
      if (window.ROLES.deComite(t.rol) && u.searchParams.get('comite') !== '1') { u.searchParams.set('comite', '1'); cambio = true; }
      if (t.ver && u.searchParams.get('ver') !== t.ver) { u.searchParams.set('ver', t.ver); cambio = true; }
      if (t.hoy && u.searchParams.get('hoy') !== t.hoy) { u.searchParams.set('hoy', t.hoy); cambio = true; }
      if (!location.hash) u.hash = t.go;
      if (cambio) { location.replace(u.href); return; }
      if (!location.hash) location.hash = t.go;
    } else { try { window.parent.postMessage({ tour: 'listo' }, '*'); } catch (x) { /* sin padre */ } }
    iniciar(id);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.EventosTour = { iniciar: iniciar, catalogo: TOURS };
})();
