/* ═══════════════════════════════════════════════════════════════
   NAOWEE EVENTOS — Footer flotante canónico (mount + scroll-hide)
   Formato canónico (paridad naowee-ivc / Project v2.0.3):
     [logo naowee] | Todos los derechos reservados © 2026 | Eventos v0.1.0
   La versión va en ROJO/accent. Scroll-hide: el host de scroll real es
   .page (creado por el shell) y el evento scroll NO bubblea — por eso
   escuchamos en capture sobre document. Patrón DESIGN-PATTERNS §3.8.
   ═══════════════════════════════════════════════════════════════ */

const MODULE_NAME = 'Eventos';
/* Versión del módulo mostrada en la pill del footer. Es una CONSTANTE: hay que
   subirla aquí en cada release (no se deriva sola — por eso se mantenía en 0.3.0).
   v0.4.0 = vista Calendario (estilo Google Calendar) + eventos del organismo
   reflejados + refinamientos de formularios/modales.
   v0.6.0 = Reportería por evento (3 tableros de Diego: Inscripciones · Resultados
   · Medallería) + dashboard adelgazado a vista ejecutiva + RBAC del cargue.
   v0.6.1 = refinamiento UI Reportería: cards planas (sin sombra), tabs+filtros en
   gran container canónico, dropdowns .naowee-dropdown + botones DS en filtros.
   v0.6.2 = container sin canvas gris, "Limpiar" --ghost (disabled hasta filtrar),
   back canónico --ghost con chevron izquierdo.
   v0.6.3 = tabs con padding (no pegados), podio rediseñado (corona/medallas
   metálicas/pedestal con brillo), tablas → card-table canónica (.naowee-table-card),
   fix datos (atletas únicos + marcas monótonas).
   v0.6.4 = padding-top en tabs, GAP entre cards del panel (.rep-panel flex/gap),
   podio 3D (cara superior con perspective) + números sin sombra.
   v0.6.5 = podio ISOMÉTRICO completo (3 caras planas: frontal + superior + lateral,
   skew) estilo low-poly.
   v0.6.6 = podio look premium Dribbble: caras en gradiente (glossy), esquinas
   redondeadas, profundidad 16px y sombra de contacto suave (en el bloque, no en
   el número).
   v0.6.7 = podio: esquinas crispas (sin radius en caras skew → quita el artefacto)
   + se quita el disco/medalla sobre el avatar (redundante con el nº del pedestal).
   v0.6.8 = modal editar evento: notes (caution lock + finalizado) → .naowee-message
   canónico del DS (antes era .ev-modal__note bespoke).
   ── v0.7.x: feedback sesión de entrega a desarrollo (25-jun) ──
   v0.7.0 = progreso → conteos numéricos (insc·res·med, no %); "Ver analítica" por
   fila en eventos; "Perfil del deportista" → "Consulta deportistas"; ranking manual
   sin columna FASE.
   v0.7.1 = evento Nacional/Internacional: toggle (segmento) en crear evento — en
   internacional el lugar (depto/municipio) no aplica + nota; alcance persistido y
   mostrado como chip en el detalle (no editable).
   v0.7.2 = ranking/resultados INTERNACIONAL: si el evento es internacional, el
   cargue manual de ranking muestra la lista de colombianos + un drawer lateral
   para registrar su posición/marca y crear el podio de "ficticios" (país + nombre
   + marca). Evento demo EV-2026-010 marcado internacional.
   v0.7.3 = catálogo deportivo + organizaciones en la EDICIÓN (evento-detalle):
   secciones "Deportes y competencias" (deporte+competencias en chips) y
   "Organizaciones invitadas" (solo nacional), editables por ADMIN, persistidas.
   v0.7.4 = medallería manual rediseñada: buscar deportista → asignarle medalla
   (🥇🥈🥉) en su competencia (antes era por departamento); el medallero por
   organismo se calcula solo. + fix ícono gigante en heads de cargue.
   v0.7.5 = lote de quick-wins (feedback Juanma): (1) carga masiva por
   organización — columna "Organización" en las 3 plantillas + hint; (2) ranking
   manual con BUSCADOR (deporte/nombre) + PAGINADOR (6/pág) y estado por fila;
   (3) departamento OPCIONAL en inscripción manual (por extranjeros); (4) reorden
   dashboard — Próximos eventos como banner superior + Eventos por estado arriba,
   Eventos por mes conservado, Inscripciones agregadas al final con alcance
   aclarado; (5) calendario: super-admin (ADMIN) puede registrar eventos con
   fecha pasada (migración) — datepicker future-only para organismo + nota.
   v0.7.6 = refinamiento UI edición (evento-detalle, feedback Doug): (1) meta-strip
   de la cabecera a 5 columnas en desktop — 'Organismo' ya no queda huérfano bajo
   'Fecha de inicio' (se desbordaba desde que v0.7.1 agregó 'Alcance'); (2) fix
   dropdowns que salían por detrás de
   la card siguiente — la sección con el dropdown abierto se eleva (z-index) y el
   menú usa el z-index canónico (999); (3) CTA 'Agregar deporte'/'Invitar' e input
   a la altura del dropdown (--field-h 48px); (4) cada deporte es un acordeón
   colapsable (chevron + contador .naowee-badge) — ya no vuelca todas las
   competencias al agregarlo; (5) aviso de quitar organización → .naowee-message
   --caution canónico (antes era un <p> sin estilo); (6) "Agregar deporte" e
   "Invitar" arrancan disabled hasta que se elige deporte / se escribe nombre;
   (7) ranking internacional: botón "Registrar resultado" usaba .naowee-btn--outline
   (inexistente en el DS) → --ghost canónico; el drawer se monta en <body> para que
   position:fixed cubra el viewport + overlay (antes quedaba atrapado por un
   ancestro con transform); (8) toast: se quita el override verde/rojo inventado en
   flash() — usa el #evToast canónico (pill neutro del naowee-footer.css);
   (9) cargue masivo REAL (feedback Gustavo): se parsea el .xlsx subido con SheetJS
   y se valida de verdad contra TEMPLATE_COLS (encabezados + requeridos vacíos +
   formato email/número) — ya no inventa errores hardcodeados; archivo vacío / sin
   filas / estructura incorrecta → mensajes reales. "Descargar plantilla" genera un
   .xlsx real con los encabezados oficiales (antes era un link roto). (10) el × de
   quitar archivo deja de ser naranja (neutro, rojo al hover).
   ── v0.8.x: cierre de huecos de la entrega 25-jun (auditoría video+código) ──
   v0.8.0 = (1) MEDALLERÍA manual: persiste la data (addFileVersion → aparece en
   "Archivos cargados"), evita doble-guardado (reset tras guardar), muestra un
   "Medallero por organización" EN VIVO derivado de la organización de cada inscrito
   → hace real el "se calcula solo" (Juanma); + aviso .naowee-message--caution cuando
   el evento tiene deportes de CONJUNTO (la medalla de equipo es una, no N — mientras
   negocio define grupos). (2) RANKING manual: persiste posiciones/marcas como versión
   de archivo + evita doble-guardado. (3) DRAWER internacional: exige la posición del
   colombiano antes de guardar; persiste lo capturado (Editar reabre con datos y NO
   re-suma al contador); pre-carga 🇨🇴 + nombre en el slot del podio si quedó 1-3;
   handler de Escape único (ya no se acumula por render). (4) Modal EDITAR: respeta el
   alcance — en internacional Departamento/Municipio NO aplican (no se piden ni se
   validan ni pisan 'Internacional'). (5) Quitar organización invitada pide
   CONFIRMACIÓN (el aviso prometía validación y antes borraba directo).
   ── Accionables reunión de revisión 25-jul (uno por uno) ──
   v0.8.1 = [#1 Disciplina/Prueba] la inscripción ahora captura la PRUEBA
   (competencia) vinculada al deporte: en el form manual un dropdown Prueba en
   CASCADA desde Deporte (obligatorio, se resetea al cambiar de deporte) y en la
   plantilla masiva la columna 'Prueba' (obligatoria). La prueba se persiste en el
   roster → aparece en ranking/medallería, en la tabla de la cola y en las versiones
   de archivo. setupDropdown acepta opts como función (cascadas) y expone reset().
   v0.8.2 = resto de accionables 25-jul en la inscripción manual + ranking:
   [#2 Vista Inscritos] se elimina "Archivos cargados" de la inscripción y se
   reemplaza por "Deportistas inscritos" (lista del roster) con filtros deporte ·
   competencia · búsqueda por documento/correo/nombre. [#3 Organizaciones] el form
   de nuevo deportista agrega dropdown Organización (obligatorio en nacional) y el
   correo pasa a obligatorio. [#4 Flujo/borrador] se elimina la cola "Deportistas
   por inscribir"; registrar (nuevo o desde SUID) abre un MODAL de confirmación y
   queda inscrito directo (SUID pre-llena el form para completar prueba/organización).
   [#5 Eliminar] cada inscrito tiene ícono de eliminar (con confirmación) →
   removeInscrito en events-data + effectiveRoster lo excluye. [#6 Ranking] no se
   permiten posiciones repetidas dentro de una misma competencia (deporte+prueba):
   se marcan en rojo, se avisa y se bloquea Guardar hasta corregir.
   ── v0.8.3: GRUPOS / deportes de conjunto (reunión 03-jul) ──
   v0.8.3 = captura POR EQUIPO sin inscripción previa (renderManualEquipo) en Ranking y
   Medallería manual: equipo/organización + posición/marca o medalla + integrantes
   opcionales; medalla = UNA por equipo (medallero por org en vivo); multideporte con
   sub-segmento Individuales|Equipos (los atletas de conjunto se excluyen del individual);
   puro conjunto → equipos directo, masivo por-persona redirige a Manual. + fixes de
   auditoría (excluir conjunto del individual, conjunto>internacional, setupDropdown
   auto-limpieza, aria).
   ── v0.8.4: feedback revisión en vivo (Doug) ──
   v0.8.4 = (1) solo UN dropdown abierto a la vez (closeOtherDropdowns); (2) editar
   inscrito (lápiz + modal, updateInscrito); (3) el RESULTADO se etiqueta según
   deporte+prueba (resultMeta: kg en pesas, tiempo, distancia, sets, combate… no genérico
   "Marca") en grid, drawer internacional y equipos; (4) ranking internacional muestra los
   resultados registrados en TABLA de previsualización (sin tener que Editar) + puesto en
   la fila; (5) liga Resultados↔Medallería: la posición registrada (ledger result-pos)
   restringe la medalla — fuera de podio (>3) queda bloqueada, 1/2/3 solo su medalla.
   ── v0.8.5: alcance de catálogos por evento + fixes de dropdown (Doug) ──
   v0.8.5 = (1) "Organizaciones invitadas" (edición) = buscador de catálogo por TIPO
   (Liga→ligas del país · Club→clubes · Departamento/Municipio→sus catálogos), acento-
   insensible, resetea al cambiar tipo; (2) al inscribir, el DEPORTE se limita a los
   asociados al evento (fijo si es uno) y la ORGANIZACIÓN a las invitadas (fija si es una);
   (3) fix z-index: los menús de los dropdowns del formulario ya no quedan detrás de la card
   "Cargas realizadas" (#modeBody se apila sobre #filesMount); (4) fix setDD de openNewForm
   (selector .naowee-dropdown__value) que rompía el prellenado desde SUID; + LIGAS/CLUBES
   en catalogo.js. */
const MODULE_VERSION = 'v0.9.10';

(function () {
  function mount() {
    if (document.querySelector('.naowee-footer')) return;
    const year = new Date().getFullYear();
    const el = document.createElement('div');
    el.className = 'naowee-footer';
    el.setAttribute('role', 'contentinfo');
    el.setAttribute('aria-label', 'Pie de página Naowee');
    el.innerHTML = `
      <img src="shared/logos/naowee.svg" alt="Naowee" class="naowee-footer__logo" onerror="this.style.display='none'"/>
      <div class="naowee-footer__sep"></div>
      <span class="naowee-footer__text">Todos los derechos reservados <strong>&copy; ${year}</strong></span>
      <div class="naowee-footer__sep"></div>
      <span class="naowee-footer__version" aria-label="Versión del módulo: ${MODULE_NAME} ${MODULE_VERSION}">
        ${MODULE_NAME} <strong>${MODULE_VERSION}</strong>
      </span>`;
    document.body.appendChild(el);
    setupScrollHide(el);
  }

  function setupScrollHide(footer) {
    let lastY = null;
    /* Capture phase sobre document: el scroll de .page no bubblea. */
    document.addEventListener('scroll', (e) => {
      const target = e.target;
      const y = (target && typeof target.scrollTop === 'number')
        ? target.scrollTop
        : (window.scrollY || window.pageYOffset || 0);
      if (lastY === null) { lastY = y; return; }
      const dy = y - lastY;
      if (Math.abs(dy) < 60 && y > 0) { return; } // threshold 60px (scroll down>60 oculta)
      if (dy > 0 && y > 60) footer.classList.add('is-hidden');
      else footer.classList.remove('is-hidden');
      lastY = y;
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

/* ═══════════════════════════════════════════════════════════════
   Snackbar canónico (DS .naowee-snackbar): pill navy con BADGE de icono
   semántico — verde=éxito/confirmación (feedback Doug), rojo=error,
   azul=info, ámbar=aviso. Global reusado por TODAS las pantallas para no
   duplicar la lógica del toast. Estilos en naowee-footer.css (#evToast).
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.5" r="1.15" fill="currentColor" stroke="none"/></svg>',
    caution: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16.5" r="1.15" fill="currentColor" stroke="none"/></svg>'
  };
  var timer = null;
  window.naoweeToast = function (msg, type) {
    type = ICONS[type] ? type : 'success';
    var el = document.getElementById('evToast');
    if (!el) { el = document.createElement('div'); el.id = 'evToast'; document.body.appendChild(el); }
    el.className = 'evtoast evtoast--' + type;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    /* El badge ya comunica el estado → quita el "✓" redundante de mensajes de éxito. */
    var text = (msg == null ? '' : String(msg)).replace(/^\s*[✓✔]\s*/, '');
    el.innerHTML = '<span class="evtoast__badge">' + ICONS[type] + '</span><span class="evtoast__text"></span>';
    el.querySelector('.evtoast__text').textContent = text;
    void el.offsetWidth;                 /* reinicia la animación si ya estaba visible */
    el.classList.add('is-visible');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { el.classList.remove('is-visible'); }, 3200);
  };
})();
