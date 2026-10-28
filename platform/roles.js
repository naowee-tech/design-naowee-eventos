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
      lista: 'todos', crea: true, edita: true,
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
    comite: ['eventos', 'calendario', 'deportistas'], comite_manager: ['eventos', 'calendario', 'deportistas'], viewer: ['eventos', 'calendario'], metodologo: []
  };
  Object.keys(MENUS).forEach(function (k) { ROLES[k].menu = MENUS[k]; });
  var ORDEN = ['admin', 'gestor', 'usuario', 'comite', 'comite_manager', 'viewer', 'metodologo'];
  var KEY = 'eventos.rol';

  function resolverRol() {
    var q = (location.search.match(/[?&]rol=(\w+)/) || [])[1], k = q;
    try { if (q && ROLES[q]) localStorage.setItem(KEY, q); else k = localStorage.getItem(KEY); } catch (e) { /* sin almacenamiento: queda el rol por defecto */ }
    return ROLES[k] ? k : 'admin';
  }
  var ACTUAL = resolverRol();

  /* El gestor administra los eventos que tiene asignados; el administrador, todos. */
  function gestiona(ev) {
    var r = ROLES[ACTUAL];
    if (ACTUAL === 'admin') return true;
    return !!r.gestion && ev.gestor && ev.gestor.nombre === r.persona;
  }
  /* El Comité no distingue por qué un evento no está: fuera del ciclo es "no disponible" (404 en el back, a propósito). */
  function puedeVer(ev) {
    var r = ROLES[ACTUAL];
    if (r.lista === 'ninguna') return false;
    if (r.lista === 'ciclo') return !!ev.ciclo;
    return true;
  }
  function pestanasDe(ev) {
    var r = ROLES[ACTUAL], ids = r.pestanas.slice();
    if (r.gestion && gestiona(ev)) ids = ids.concat(r.gestion);
    return ids;
  }

  window.ROLES = { tabla: ROLES, orden: ORDEN, actual: ACTUAL, rol: ROLES[ACTUAL], gestiona: gestiona, puedeVer: puedeVer, pestanasDe: pestanasDe, key: KEY };
})();
