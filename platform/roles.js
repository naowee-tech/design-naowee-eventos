/* Capa de roles de la demo. Una sola tabla decide qué ve cada rol: listado, acceso al evento y pestañas.
   Fuente: matriz de events-lite (front: helpers/permissions.ts; back: event-sport-orc, docs/roles-permisos-events-lite.md).
   Para cambiar lo que ve un rol se toca ESTE archivo y ningún otro. */
(function () {
  'use strict';

  /* lista: 'ninguna' (aviso de metodólogo) | 'todos' | 'ciclo' (solo eventos del Ciclo Olímpico) | 'alcance' (pestañas Mis eventos / Todos)
     pestanas: ids visibles dentro de un evento; `gestion` suma pestañas solo en eventos que el rol gestiona. */
  var ROLES = {
    admin: {
      codigo: 'EVENTS_LITE_ADMIN', etiqueta: 'Administrador de eventos', persona: 'Camila Torres', ini: 'CT',
      desc: 'Crea y edita eventos, asigna gestor y marca Ciclo Olímpico. Ve todos los eventos.',
      lista: 'todos', crea: 'suid', edita: true,
      pestanas: ['informacion', 'cargas', 'deportes', 'organizaciones', 'metodologos', 'analitica']
    },
    gestor: {
      codigo: 'EVENTS_LITE_MANAGER', etiqueta: 'Gestor de eventos', persona: 'Laura Marcela Ortiz', ini: 'LM',
      desc: 'Carga inscripciones, resultados y medallería de los eventos que tiene asignados.',
      lista: 'alcance', crea: false,
      pestanas: ['informacion', 'deportes', 'organizaciones', 'analitica'],
      gestion: ['cargas']
    },
    usuario: {
      codigo: 'EVENTS_LITE_MODULE_USER', etiqueta: 'Usuario del módulo', persona: 'Ricardo Peña', ini: 'RP',
      desc: 'Solo lectura: lista y detalle de eventos y su analítica.',
      lista: 'alcance', crea: false,
      pestanas: ['informacion', 'deportes', 'organizaciones', 'analitica']
    },
    metodologo: {
      codigo: 'EVENTS_LITE_METHODOLOGIST', etiqueta: 'Metodólogo', persona: 'Sofía Quintero', ini: 'SQ',
      desc: 'Califica desde su propia vista. No entra al módulo de eventos.',
      lista: 'ninguna', crea: false, pestanas: []
    },
    comite: {
      codigo: 'EVENTS_LITE_OLYMPIC_COMMITTEE', etiqueta: 'Comité Olímpico', persona: 'Paulo Restrepo', ini: 'PR',
      desc: 'Solo lectura sobre los eventos del Ciclo Olímpico, con deportistas.',
      lista: 'ciclo', crea: false,
      pestanas: ['informacion', 'inscripciones', 'deportes', 'organizaciones', 'analitica']
    },
    comite_manager: {
      codigo: 'EVENTS_LITE_OLYMPIC_COMMITTEE_MANAGER', etiqueta: 'Gestor del Comité', persona: 'Mariana Cifuentes', ini: 'MC',
      desc: 'Como el Comité, y además ve resultados y medallería y asigna metodólogos.',
      lista: 'ciclo', crea: false,
      pestanas: ['informacion', 'inscripciones', 'deportes', 'organizaciones', 'calendario-resultados', 'medalleria', 'boletines', 'metodologos', 'analitica']
    },
    /* Propuesto: no existe en backend (los roles del Comité no tienen event:create); por confirmar con Javi. */
    comite_admin: {
      codigo: 'PROPUESTO', etiqueta: 'Administrador del Comité (propuesto)', persona: 'Natalia Bermúdez', ini: 'NB',
      desc: 'Crea y edita eventos del Ciclo Olímpico. Consulta los demás.',
      lista: 'ciclo', crea: 'coc', edita: true,
      pestanas: ['informacion', 'inscripciones', 'deportes', 'organizaciones', 'calendario-resultados', 'medalleria', 'boletines', 'metodologos', 'analitica']
    },
    viewer: {
      codigo: 'OLYMPIC_COMMITTEE_VIEWER', etiqueta: 'Visualizador del Comité', persona: 'Héctor Salazar', ini: 'HS',
      desc: 'El de menos acceso: eventos del ciclo, solo Deportes y analítica.',
      lista: 'ciclo', crea: false,
      pestanas: ['informacion', 'deportes', 'organizaciones', 'analitica']
    }
  };
  /* Sidebar por rol (como en el demo original). Dashboards, reportería y seguimiento cuelgan del evento como pestañas. */
  var MENUS = {
    admin: ['eventos', 'calendario', 'deportistas', 'usuarios'], gestor: ['eventos', 'calendario', 'deportistas'], usuario: ['eventos', 'calendario', 'deportistas'],
    comite: ['eventos', 'calendario', 'deportistas'], comite_manager: ['eventos', 'calendario', 'deportistas'], comite_admin: ['eventos', 'calendario', 'deportistas'], viewer: ['eventos', 'calendario'], metodologo: []
  };
  Object.keys(MENUS).forEach(function (k) { ROLES[k].menu = MENUS[k]; });
  var ORDEN = ['admin', 'gestor', 'usuario', 'comite', 'comite_manager', 'comite_admin', 'viewer', 'metodologo'];
  var KEY = 'eventos.rol';

  /* Capas de la demo (panel): ver = alcance de los roles SUID (solo SUID por defecto, «todos» es a futuro); comite = flujos del Comité conectados (apagado por defecto). */
  var QS = new URLSearchParams(location.search);
  var VER = QS.get('ver') === 'todos' ? 'todos' : 'suid';
  var COMITE = QS.get('comite') === '1';
  var DE_COMITE = ['comite', 'comite_manager', 'comite_admin', 'viewer', 'metodologo'];
  function deComite(k) { return DE_COMITE.indexOf(k) >= 0; }

  function resolverRol() {
    var q = (location.search.match(/[?&]rol=(\w+)/) || [])[1], k = q;
    try { if (q && ROLES[q]) localStorage.setItem(KEY, q); else k = localStorage.getItem(KEY); } catch (e) { /* sin almacenamiento: queda el rol por defecto */ }
    return ROLES[k] && (COMITE || !deComite(k)) ? k : 'admin';
  }
  var ACTUAL = resolverRol();

  /* El gestor administra los eventos que tiene asignados; el administrador, todos. */
  /* Misma regla que OLC.tipoDe (roles.js carga sin data.js): estricta por event_type; null = FULL. */
  function tipoDe(ev) {
    if (ev.event_type === 'LITE') return ev.ciclo ? 'coc' : 'suid';
    return ev.event_type === 'ULTRA_LITE' ? 'liga' : 'full';
  }
  /* Cada rol edita solo el origen que crea (suid o coc); full y liga son de consulta para todos. */
  function puedeEditar(ev) { var r = ROLES[ACTUAL]; return !!r.edita && !!ev && !!r.crea && r.crea === tipoDe(ev); }
  /* v2 del backend solo sirve Información y Deportes de un FULL; el resto da 501. */
  var SOLO_LECTURA_FULL = ['informacion', 'deportes'];
  /* Con rol SUID un evento coc es de consulta simplificada; organizaciones la filtra app.js según el alcance. */
  var SUID_EN_COC = ['informacion', 'deportes', 'organizaciones', 'analitica'];
  var SOLO_CICLO = ['metodologos', 'calendario-resultados', 'medalleria', 'boletines'];
  function gestiona(ev) {
    var r = ROLES[ACTUAL];
    if (tipoDe(ev) !== 'suid') return false;
    if (ACTUAL === 'admin') return true;
    return !!r.gestion && ev.gestor && ev.gestor.nombre === r.persona;
  }
  /* El backend filtra solo al Comité: devuelve únicamente LITE con ciclo (coc); FULL con ciclo, suid y liga dan 404. */
  function puedeVer(ev) {
    var r = ROLES[ACTUAL];
    if (r.lista === 'ninguna') return false;
    if (r.lista === 'ciclo') return tipoDe(ev) === 'coc';
    return VER !== 'suid' || tipoDe(ev) === 'suid';
  }
  function pestanasDe(ev) {
    var r = ROLES[ACTUAL], ids = r.pestanas.slice();
    if (tipoDe(ev) === 'full') return SOLO_LECTURA_FULL.slice();
    if (tipoDe(ev) === 'liga') return ['informacion'];
    if (r.gestion && gestiona(ev)) ids = ids.concat(r.gestion);
    /* Cargas es solo de eventos SUID: coc y full nunca (decisión Jorge 29-oct-2026). */
    if (tipoDe(ev) !== 'suid') ids = ids.filter(function (id) { return id !== 'cargas'; });
    if (tipoDe(ev) === 'coc' && r.lista !== 'ciclo') ids = ids.filter(function (id) { return SUID_EN_COC.indexOf(id) >= 0; });
    /* Control del Ciclo Olímpico: solo roles del ciclo; los roles SUID no lo ven ni en eventos suid (decisión Jorge 30-oct). */
    if (r.lista !== 'ciclo') ids = ids.filter(function (id) { return SOLO_CICLO.indexOf(id) < 0; });
    /* Sin resultados ni medallería en un evento SUID no competitivo: no hay cargas. */
    if (tipoDe(ev) === 'suid' && ev.tipo_programa && ev.tipo_programa !== 'competitivo') ids = ids.filter(function (id) { return id !== 'cargas'; });
    return ids;
  }

  window.ROLES = { ver: VER, comite: COMITE, deComite: deComite, tabla: ROLES, orden: ORDEN, actual: ACTUAL, rol: ROLES[ACTUAL], gestiona: gestiona, puedeEditar: puedeEditar, tipoDe: tipoDe, puedeVer: puedeVer, pestanasDe: pestanasDe, key: KEY };
})();
