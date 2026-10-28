/* ═══════════════════════════════════════════════════════════════
   NAOWEE EVENTOS — Datos mock compartidos (6 eventos del Ministerio)
   Mismo set que el dashboard (paridad visual y de contenido). Compartido
   por la lista "Eventos" (eventos.html) y la creación (evento-crear.html,
   que hace "push" del nuevo borrador a este array en sessionStorage para
   que aparezca al volver a la lista).
   ═══════════════════════════════════════════════════════════════ */

export const EVENTS = [
  /* ══════════════════════════════════════════════════════════════════════
     CASOS DEMO (feedback Doug) — cubren la matriz completa
     {nacional · internacional} × {multideporte · un solo deporte individual ·
     un solo deporte de conjunto}. Van PRIMERO y asignados a Andrea Salas
     (gestorId 'g-andrea'). Poblados con datos + catálogo deportivo (ev.deportes)
     para el modo "Libre · con datos".
     ══════════════════════════════════════════════════════════════════════ */
  {
    id: 'EV-2026-016', emoji: '🌎', name: 'Juegos Suramericanos Lima 2026',
    sport: 'Multideporte · 14 disciplinas', place: 'Internacional', org: 'ODESUR · Comité Olímpico Colombiano',
    start: '10 abr 2026', end: '20 abr 2026', status: 'finalizado', alcance: 'internacional', poolRegion: 'América',
    gestorId: 'g-andrea',
    insc: { done: 512, total: 512 }, res: { done: 430, total: 450 }, med: { done: 288, total: 288 },
    deportes: [
      { deporte: 'Atletismo', emoji: '🏃', competencias: ['100m Planos', '200m Planos', 'Salto Largo', 'Lanzamiento de Jabalina'] },
      { deporte: 'Natación', emoji: '🏊', competencias: ['50m Libre', '100m Libre', '100m Espalda', '100m Pecho'] },
      { deporte: 'Boxeo', emoji: '🥊', competencias: ['-52kg', '-57kg', '-63kg', '-69kg'] },
      { deporte: 'Taekwondo', emoji: '🥋', competencias: ['Kyorugi -54kg', 'Kyorugi -58kg', 'Poomsae'] },
      { deporte: 'Voleibol', emoji: '🏐', competencias: ['EQUIPOS'] },
      { deporte: 'Baloncesto', emoji: '🏀', competencias: ['EQUIPOS'] }
    ]
  },
  {
    id: 'EV-2026-017', emoji: '🏃', name: 'Campeonato Mundial de Atletismo 2026',
    sport: 'Atletismo · Pista y campo', place: 'Internacional', org: 'World Athletics',
    start: '02 jun 2026', end: '08 jun 2026', status: 'activo', alcance: 'internacional',
    gestorId: 'g-andrea',
    insc: { done: 72, total: 72 }, res: { done: 38, total: 90 }, med: { done: 21, total: 60 },
    deportes: [
      { deporte: 'Atletismo', emoji: '🏃', competencias: ['100m Planos', '200m Planos', '400m Planos', '1.500m', 'Salto Largo', 'Lanzamiento de Jabalina'] }
    ]
  },
  {
    id: 'EV-2026-018', emoji: '🏐', name: 'Copa Panamericana de Voleibol',
    sport: 'Voleibol · Conjunto', place: 'Internacional', org: 'Confederación Panamericana de Voleibol',
    start: '02 jun 2026', end: '09 jun 2026', status: 'activo', alcance: 'internacional', poolRegion: 'América',
    gestorId: 'g-andrea',
    insc: { done: 36, total: 36 }, res: { done: 8, total: 12 }, med: { done: 3, total: 6 },
    deportes: [{ deporte: 'Voleibol', emoji: '🏐', competencias: ['EQUIPOS'] }]
  },
  {
    id: 'EV-2026-019', emoji: '🏆', name: 'Juegos Deportivos Nacionales 2026',
    sport: 'Multideporte · 20 disciplinas', place: 'Cali, Valle del Cauca', org: 'Ministerio del Deporte',
    start: '14 jun 2026', end: '30 jun 2026', status: 'activo',
    gestorId: 'g-andrea',
    insc: { done: 2180, total: 2600 }, res: { done: 360, total: 1100 }, med: { done: 96, total: 540 },
    deportes: [
      { deporte: 'Atletismo', emoji: '🏃', competencias: ['100m Planos', '400m Planos', '1.500m', 'Salto Largo'] },
      { deporte: 'Natación', emoji: '🏊', competencias: ['50m Libre', '100m Libre', '200m Libre', '100m Pecho'] },
      { deporte: 'Levantamiento de Pesas', emoji: '🏋️', competencias: ['Arranque', 'Envión', 'Total Olímpico'] },
      { deporte: 'Judo', emoji: '🥋', competencias: ['-60kg', '-66kg', '-73kg'] },
      { deporte: 'Fútbol Sala', emoji: '⚽', competencias: ['EQUIPOS'] },
      { deporte: 'Baloncesto', emoji: '🏀', competencias: ['EQUIPOS'] }
    ]
  },
  {
    id: 'EV-2026-020', emoji: '⛸️', name: 'Campeonato Nacional de Patinaje de Velocidad',
    sport: 'Patinaje · Velocidad', place: 'Bucaramanga, Santander', org: 'Federación Colombiana de Patinaje',
    start: '05 mar 2026', end: '08 mar 2026', status: 'finalizado',
    gestorId: 'g-andrea',
    insc: { done: 168, total: 168 }, res: { done: 96, total: 96 }, med: { done: 36, total: 36 },
    deportes: [{ deporte: 'Patinaje', emoji: '⛸️', competencias: ['500m', '1.000m', '3.000m', 'Relevos'] }]
  },
  {
    id: 'EV-2026-021', emoji: '🏀', name: 'Liga Nacional de Baloncesto 2026',
    sport: 'Baloncesto · Conjunto', place: 'Medellín, Antioquia', org: 'Federación Colombiana de Baloncesto',
    start: '12 jun 2026', end: '26 jun 2026', status: 'activo',
    gestorId: 'g-andrea',
    insc: { done: 48, total: 48 }, res: { done: 8, total: 12 }, med: { done: 3, total: 6 },
    deportes: [{ deporte: 'Baloncesto', emoji: '🏀', competencias: ['EQUIPOS'] }]
  },
  {
    id: 'EV-2026-001', emoji: '🏆', name: 'Juegos Intercolegiados Nacionales 2026',
    sport: 'Multideporte · 14 disciplinas', place: 'Bogotá D.C.', org: 'Ministerio del Deporte',
    start: '15 jun 2026', end: '28 jun 2026', status: 'activo',
    insc: { done: 2840, total: 3200 }, res: { done: 410, total: 1200 }, med: { done: 38, total: 420 }
  },
  {
    id: 'EV-2026-002', emoji: '🏃', name: 'Festival Departamental de Atletismo',
    sport: 'Atletismo · Pista y campo', place: 'Medellín, Antioquia', org: 'Indeportes Antioquia',
    start: '03 jul 2026', end: '06 jul 2026', status: 'activo',
    insc: { done: 612, total: 640 }, res: { done: 188, total: 320 }, med: { done: 0, total: 96 }
  },
  {
    id: 'EV-2026-003', emoji: '🏊', name: 'Copa Nacional de Natación',
    sport: 'Natación · Piscina olímpica', place: 'Cali, Valle del Cauca', org: 'Federación Colombiana de Natación',
    start: '18 ago 2026', end: '22 ago 2026', status: 'borrador',
    insc: { done: 0, total: 0 }, res: { done: 0, total: 0 }, med: { done: 0, total: 0 }
  },
  {
    id: 'EV-2026-004', emoji: '⚽', name: 'Torneo Interligas de Fútbol Sala',
    sport: 'Fútbol Sala · Conjunto', place: 'Barranquilla, Atlántico', org: 'Liga de Fútbol de Salón del Atlántico',
    start: '05 sep 2026', end: '12 sep 2026', status: 'borrador',
    insc: { done: 24, total: 64 }, res: { done: 0, total: 0 }, med: { done: 0, total: 0 }
  },
  {
    id: 'EV-2026-005', emoji: '🥋', name: 'Campeonato Nacional de Taekwondo',
    sport: 'Taekwondo · Combate', place: 'Pereira, Risaralda', org: 'Federación Colombiana de Taekwondo',
    start: '20 mar 2026', end: '23 mar 2026', status: 'finalizado',
    insc: { done: 480, total: 480 }, res: { done: 480, total: 480 }, med: { done: 144, total: 144 }
  },
  {
    id: 'EV-2026-006', emoji: '🏋️', name: 'Liga Nacional de Levantamiento de Pesas',
    sport: 'Halterofilia · Marca', place: 'Bucaramanga, Santander', org: 'Federación Colombiana de Pesas',
    start: '08 feb 2026', end: '10 feb 2026', status: 'finalizado',
    insc: { done: 210, total: 210 }, res: { done: 210, total: 210 }, med: { done: 63, total: 63 }
  },
  /* ── Clúster jun 2026 — fechas solapadas para poblar el calendario ── */
  {
    id: 'EV-2026-007', emoji: '⚽', name: 'Copa Élite de Fútbol Femenino',
    sport: 'Fútbol · Conjunto', place: 'Cali, Valle del Cauca', org: 'Liga Vallecaucana de Fútbol',
    start: '15 jun 2026', end: '20 jun 2026', status: 'activo',
    insc: { done: 320, total: 384 }, res: { done: 40, total: 160 }, med: { done: 0, total: 36 }
  },
  {
    id: 'EV-2026-008', emoji: '🏐', name: 'Torneo Nacional de Voleibol Playa',
    sport: 'Voleibol playa · Dupla', place: 'Santa Marta, Magdalena', org: 'Federación Colombiana de Voleibol',
    start: '16 jun 2026', end: '19 jun 2026', status: 'activo',
    insc: { done: 96, total: 128 }, res: { done: 24, total: 64 }, med: { done: 0, total: 24 }
  },
  {
    id: 'EV-2026-009', emoji: '🚴', name: 'Clásico Ciclístico de Montaña',
    sport: 'Ciclismo · Ruta', place: 'Manizales, Caldas', org: 'Indeportes Caldas',
    start: '17 jun 2026', end: '21 jun 2026', status: 'borrador',
    insc: { done: 0, total: 0 }, res: { done: 0, total: 0 }, med: { done: 0, total: 0 }
  },
  {
    id: 'EV-2026-010', emoji: '🥊', name: 'Clasificatorio Internacional de Boxeo',
    sport: 'Boxeo · Combate', place: 'Internacional', org: 'Federación Colombiana de Boxeo',
    start: '18 jun 2026', end: '18 jun 2026', status: 'activo', alcance: 'internacional',
    insc: { done: 64, total: 64 }, res: { done: 20, total: 32 }, med: { done: 12, total: 18 }
  },
  {
    id: 'EV-2026-011', emoji: '🏓', name: 'Campeonato de Tenis de Mesa',
    sport: 'Tenis de mesa · Individual', place: 'Bogotá D.C.', org: 'Federación Colombiana de Tenis de Mesa',
    start: '16 jun 2026', end: '18 jun 2026', status: 'activo',
    insc: { done: 140, total: 160 }, res: { done: 60, total: 160 }, med: { done: 0, total: 12 }
  },
  {
    id: 'EV-2026-012', emoji: '🤸', name: 'Copa de Gimnasia Artística',
    sport: 'Gimnasia · Aparatos', place: 'Medellín, Antioquia', org: 'Liga Antioqueña de Gimnasia',
    start: '20 jun 2026', end: '24 jun 2026', status: 'borrador',
    insc: { done: 12, total: 90 }, res: { done: 0, total: 0 }, med: { done: 0, total: 0 }
  },
  {
    id: 'EV-2026-013', emoji: '🏸', name: 'Abierto Nacional de Bádminton',
    sport: 'Bádminton · Individual', place: 'Pereira, Risaralda', org: 'Federación Colombiana de Bádminton',
    start: '22 jun 2026', end: '25 jun 2026', status: 'activo',
    insc: { done: 88, total: 120 }, res: { done: 0, total: 80 }, med: { done: 0, total: 18 }
  },
  /* ── Eventos INTERNACIONALES (alcance='internacional') — dimensión = países,
     seguimiento a Colombia. Poblados para el showcase de la reportería intl. ── */
  {
    id: 'EV-2026-014', emoji: '🏅', name: 'Juegos Panamericanos Junior 2026',
    sport: 'Multideporte · 18 disciplinas', place: 'Internacional', org: 'Comité Olímpico Colombiano',
    start: '15 may 2026', end: '25 may 2026', status: 'finalizado', alcance: 'internacional', poolRegion: 'América',
    insc: { done: 520, total: 520 }, res: { done: 460, total: 480 }, med: { done: 306, total: 306 }
  },
  {
    id: 'EV-2026-015', emoji: '🏃', name: 'Campeonato Panamericano de Atletismo',
    sport: 'Atletismo · Pista y campo', place: 'Internacional', org: 'World Athletics · Panam',
    start: '02 abr 2026', end: '05 abr 2026', status: 'finalizado', alcance: 'internacional', poolRegion: 'América',
    insc: { done: 58, total: 58 }, res: { done: 90, total: 96 }, med: { done: 42, total: 42 }
  }
];

export const STATUS_LABEL = { borrador: 'Borrador', activo: 'Activo', finalizado: 'Finalizado' };

export function pct(done, total) { return total > 0 ? Math.round((done / total) * 100) : 0; }

/* ═══════════════════════════════════════════════════════════════
   UBICACIÓN DEL EVENTO — multi-departamental / multi-municipal
   Fuente estructurada: ev.departamentos:[] + ev.municipios:[{depto,nombre}].
   `ev.place` se mantiene como STRING DERIVADO guardado (retro-compat: la
   lista/tabla/calendario/dashboard solo lo muestran). Los eventos base
   (solo `place`) y los borradores viejos (departamento/municipio singular)
   se normalizan aquí para que todo lea de un mismo helper.
   ═══════════════════════════════════════════════════════════════ */
export function eventDeptos(ev) {
  if (!ev) return [];
  if (Array.isArray(ev.departamentos)) return ev.departamentos;
  if (ev.departamento) return [ev.departamento];
  /* Legacy: parsear del place "Municipio, Departamento" (el depto es lo último).
     Un place de un solo token (ej. 'Bogotá D.C.') ES el departamento. */
  if (ev.place && ev.place !== 'Internacional' && ev.place !== 'Por definir') {
    const parts = ev.place.split(', ');
    return parts.length > 1 ? [parts[parts.length - 1]] : [ev.place];
  }
  return [];
}
export function eventMunicipios(ev) {
  if (!ev) return [];
  if (Array.isArray(ev.municipios)) return ev.municipios;
  if (ev.municipio) return [{ depto: ev.departamento || '', nombre: ev.municipio }];
  if (ev.place && ev.place.includes(', ') && ev.place !== 'Internacional') {
    const parts = ev.place.split(', ');
    return [{ depto: parts[parts.length - 1], nombre: parts.slice(0, -1).join(', ') }];
  }
  return [];
}
/** String de "Lugar" derivado de la ubicación estructurada (con fallback a ev.place). */
export function placeLabel(ev) {
  if (!ev) return '';
  if (ev.alcance === 'internacional') return 'Internacional';
  const deps = eventDeptos(ev);
  if (!deps.length) return ev.place || 'Por definir';
  const munis = eventMunicipios(ev);
  if (deps.length === 1) {
    const d = deps[0];
    const m = munis.filter((x) => (x.depto || '') === d || !x.depto).map((x) => x.nombre);
    if (m.length === 1) return `${m[0]}, ${d}`;
    if (m.length > 1) return `${m[0]} +${m.length - 1}, ${d}`;
    return d;
  }
  const totalMun = munis.length;
  return totalMun
    ? `${deps.length} departamentos · ${totalMun} municipio${totalMun > 1 ? 's' : ''}`
    : `${deps.length} departamentos`;
}
/** Detalle completo de la ubicación (para tooltip/title): lista deptos y municipios. */
export function placeTitle(ev) {
  if (!ev || ev.alcance === 'internacional') return placeLabel(ev);
  const deps = eventDeptos(ev);
  if (deps.length <= 1) return placeLabel(ev);
  const munis = eventMunicipios(ev);
  return deps.map((d) => {
    const m = munis.filter((x) => x.depto === d).map((x) => x.nombre);
    return m.length ? `${d} (${m.join(', ')})` : d;
  }).join(' · ');
}

/* ═══════════════════════════════════════════════════════════════
   MODELO DE ASIGNACIÓN — Gestor ↔ Evento
   Fuente única compartida por eventos.html, evento-detalle.html y
   cargue.html (oversight). evento-detalle.html ya importa GESTORES
   de catalogo.js; aquí se centraliza el MAPA y los helpers.
   ═══════════════════════════════════════════════════════════════ */

/** Mapa determinístico: eventId → gestorId (base) */
export const GESTOR_MAP = {
  'EV-2026-001': 'g-marcela',
  'EV-2026-002': 'g-andrea',
  'EV-2026-003': 'g-andrea',
  'EV-2026-004': 'g-julian',
  'EV-2026-005': 'g-paola',
  'EV-2026-006': 'g-diego'
};

/**
 * Resuelve el gestorId de un evento (override > draft.gestorId > GESTOR_MAP).
 * @param {{ id: string, gestorId?: string }} ev
 * @returns {string|undefined}
 */
export function resolveGestorId(ev) {
  return ev.gestorId || GESTOR_MAP[ev.id];
}

/**
 * Devuelve los eventos asignados a un gestor concreto.
 * @param {string} gestorId  (ej. 'g-andrea')
 * @returns {Array} subset de allEvents()
 */
export function eventsForGestor(gestorId) {
  return allEvents().filter((ev) => resolveGestorId(ev) === gestorId);
}

/**
 * Resuelve el gestorId del rol GESTOR logueado (demo: siempre g-andrea / Andrea Salas).
 * Si en el futuro el sistema autentica personas reales, se pasa el claim aquí.
 * @param {string} roleCode
 * @returns {string|null}
 */
export function gestorIdForRole(roleCode) {
  if (roleCode === 'GESTOR') return 'g-andrea';
  return null;
}

/* Borradores recién creados en la demo (persisten en sessionStorage para
   que el flujo "Crear → Guardar → vuelvo a la lista" muestre el evento). */
const DRAFTS_KEY = 'naowee-eventos-drafts';
export function getDrafts() {
  try { return JSON.parse(sessionStorage.getItem(DRAFTS_KEY) || '[]'); }
  catch { return []; }
}
export function addDraft(draft) {
  const drafts = getDrafts();
  drafts.unshift(draft);
  sessionStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}
/* Lista combinada: borradores de la demo primero, luego el set base.
   Adjunta assignedGestorId a cada evento (fuente única de verdad). */
export function allEvents() {
  const drafts = getDrafts();
  const deltas = getCargueDeltas();
  const overrides = getOverrides();
  const base = [...drafts, ...EVENTS];
  return base.map((ev) => {
    const d = deltas[ev.id];
    const ov = overrides[ev.id];
    /* Primero aplica override de edición, luego deltas de cargue. */
    const merged = ov ? { ...ev, ...ov } : ev;
    const withGestor = { ...merged, assignedGestorId: resolveGestorId(merged) };
    if (!d) return withGestor;
    return {
      ...withGestor,
      insc: { done: Math.min((merged.insc.done || 0) + (d.insc || 0), merged.insc.total || Infinity), total: merged.insc.total },
      res:  { done: Math.min((merged.res.done  || 0) + (d.res  || 0), merged.res.total  || Infinity), total: merged.res.total  },
      med:  { done: Math.min((merged.med.done  || 0) + (d.med  || 0), merged.med.total  || Infinity), total: merged.med.total  }
    };
  });
}

/* ═══════════════════════════════════════════════════════════════
   OVERRIDES STORE — Edición de eventos
   sessionStorage key: 'naowee-eventos-overrides'
   Shape: { [eventId]: { name?, start?, end?, place?, gestorId?, descripcion?, ... } }

   Funciones exportadas:
     getOverrides()         → lee el mapa completo
     updateEvent(id, patch) → guarda un override (evento base) o actualiza draft
   ═══════════════════════════════════════════════════════════════ */
const OVERRIDES_KEY = 'naowee-eventos-overrides';

export function getOverrides() {
  try { return JSON.parse(sessionStorage.getItem(OVERRIDES_KEY) || '{}'); }
  catch { return {}; }
}

/**
 * Persiste cambios sobre un evento.
 * - Si el id es un borrador (está en getDrafts), actualiza ese draft in-place.
 * - Si es un evento base (EVENTS), guarda un override en OVERRIDES_KEY.
 * @param {string} id - ID del evento
 * @param {Object} patch - Campos a actualizar (name, start, end, place, gestorId, descripcion…)
 */
export function updateEvent(id, patch) {
  const drafts = getDrafts();
  const draftIdx = drafts.findIndex((e) => e.id === id);
  if (draftIdx !== -1) {
    /* Borrador: actualizar el draft completo. */
    drafts[draftIdx] = { ...drafts[draftIdx], ...patch };
    sessionStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } else {
    /* Evento base: guardar override. */
    const overrides = getOverrides();
    overrides[id] = { ...(overrides[id] || {}), ...patch };
    sessionStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  }
}

/* ═══════════════════════════════════════════════════════════════
   CARGUE STORE — Fase 4
   sessionStorage key: 'naowee-eventos-cargue-deltas'
   Shape: { [eventId]: { insc: number, res: number, med: number } }

   Funciones exportadas:
     getCargueDeltas()                → lee el mapa completo
     applyUpload(eventId, tipo, n)    → aplica +n al tipo (insc|res|med)
     getUploadHistory(eventId)        → lista de registros previos del evento
     addUploadRecord(eventId, record) → persiste un registro histórico (audit)
   ═══════════════════════════════════════════════════════════════ */
const DELTAS_KEY   = 'naowee-eventos-cargue-deltas';
const HISTORY_KEY  = 'naowee-eventos-cargue-history';

export function getCargueDeltas() {
  try { return JSON.parse(sessionStorage.getItem(DELTAS_KEY) || '{}'); }
  catch { return {}; }
}

/**
 * Aplica un cargue al store de deltas de un evento.
 * @param {string} eventId - ID del evento (ej. 'EV-2026-001')
 * @param {'insc'|'res'|'med'} tipo - tipo de cargue
 * @param {number} n - cantidad de filas válidas cargadas
 */
export function applyUpload(eventId, tipo, n) {
  const deltas = getCargueDeltas();
  if (!deltas[eventId]) deltas[eventId] = { insc: 0, res: 0, med: 0 };
  deltas[eventId][tipo] = (deltas[eventId][tipo] || 0) + n;
  sessionStorage.setItem(DELTAS_KEY, JSON.stringify(deltas));
}

/**
 * Recupera el historial de cargues de un evento (para audit trail en la UI).
 * @param {string} eventId
 * @returns {Array<{tipo, n, timestamp, modeLabel}>}
 */
export function getUploadHistory(eventId) {
  try {
    const all = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '{}');
    return all[eventId] || [];
  } catch { return []; }
}

/**
 * Persiste un registro de cargue para el historial del evento.
 * @param {string} eventId
 * @param {{ tipo: string, n: number, timestamp: string, modeLabel: string }} record
 */
export function addUploadRecord(eventId, record) {
  let all;
  try { all = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '{}'); }
  catch { all = {}; }
  if (!all[eventId]) all[eventId] = [];
  all[eventId].unshift(record);
  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(all));
}

/* ═══════════════════════════════════════════════════════════════
   ARCHIVOS CARGADOS — versionado por (evento, tipo)
   sessionStorage key: 'naowee-eventos-cargue-files'
   Shape: { [eventId]: { insc:[...], res:[...], med:[...] } }
   Cada registro: { version, fileName, n, modeLabel, timestamp, columns, rows }
   Permite mostrar "el archivo subido versionado con su data tipo tabla".
   ═══════════════════════════════════════════════════════════════ */
const FILES_KEY = 'naowee-eventos-cargue-files';

/** Lista de versiones de archivo de un (evento, tipo). Más reciente primero. */
export function getFileVersions(eventId, tipo) {
  try {
    const all = JSON.parse(sessionStorage.getItem(FILES_KEY) || '{}');
    return (all[eventId] && all[eventId][tipo]) ? all[eventId][tipo] : [];
  } catch { return []; }
}

/**
 * Persiste una nueva versión de archivo cargado y devuelve su número de versión.
 * @param {string} eventId
 * @param {'insc'|'res'|'med'} tipo
 * @param {{ fileName:string, n:number, modeLabel:string, timestamp:string, columns:Array, rows:Array }} record
 * @returns {number} version asignada (autoincremental por evento+tipo)
 */
export function addFileVersion(eventId, tipo, record) {
  let all;
  try { all = JSON.parse(sessionStorage.getItem(FILES_KEY) || '{}'); }
  catch { all = {}; }
  if (!all[eventId]) all[eventId] = {};
  if (!all[eventId][tipo]) all[eventId][tipo] = [];
  const version = all[eventId][tipo].length + 1;
  all[eventId][tipo].unshift({ version, ...record });
  sessionStorage.setItem(FILES_KEY, JSON.stringify(all));
  return version;
}

/** Elimina UNA fila de una versión (carga). Ajusta n y el contador del evento
 *  (delta −1). Si la versión queda sin filas, se elimina completa. */
export function removeFileRow(eventId, tipo, version, rowIdx) {
  let all;
  try { all = JSON.parse(sessionStorage.getItem(FILES_KEY) || '{}'); } catch { return false; }
  const list = all[eventId] && all[eventId][tipo];
  if (!list) return false;
  const v = list.find((x) => x.version === version);
  if (!v || !Array.isArray(v.rows) || rowIdx < 0 || rowIdx >= v.rows.length) return false;
  v.rows.splice(rowIdx, 1);
  v.n = v.rows.length;
  if (v.rows.length === 0) list.splice(list.indexOf(v), 1);
  sessionStorage.setItem(FILES_KEY, JSON.stringify(all));
  applyUpload(eventId, tipo, -1);   // el evento pierde ese registro en su conteo
  return true;
}

/** Reemplaza los valores (por columna) de UNA fila de una versión. n no cambia. */
export function updateFileRow(eventId, tipo, version, rowIdx, patch) {
  let all;
  try { all = JSON.parse(sessionStorage.getItem(FILES_KEY) || '{}'); } catch { return false; }
  const list = all[eventId] && all[eventId][tipo];
  if (!list) return false;
  const v = list.find((x) => x.version === version);
  if (!v || !Array.isArray(v.rows) || rowIdx < 0 || rowIdx >= v.rows.length) return false;
  v.rows[rowIdx] = { ...v.rows[rowIdx], ...patch };
  sessionStorage.setItem(FILES_KEY, JSON.stringify(all));
  return true;
}

/* ═══════════════════════════════════════════════════════════════
   ROSTER STORE — INSCRITOS por evento (fuente de verdad de participantes)
   sessionStorage key: 'naowee-eventos-roster'
   Shape: { [eventId]: [ participante, ... ] }
   participante: { id, tipoDoc, nroDoc, nombre, sexo, deporte, prueba?, depto,
                   organizacion?, correo?, origen ('SUID'|'Nuevo'|'Masivo') }

   REGLA DE FLUJO (feedback Doug): las INSCRIPCIONES (masivo o manual) ESCRIBEN
   aquí; RANKING/RESULTADOS y MEDALLERÍA LEEN de aquí. Solo se puede dar un
   resultado o una medalla a un deportista que ya está inscrito en el evento.
   Nunca un roster global/hardcodeado. Los eventos precargados del demo
   complementan este store con un roster sintetizado COHERENTE con su deporte
   (ver roster-data.js); un evento nuevo sin inscripciones arranca vacío.
   ═══════════════════════════════════════════════════════════════ */
const ROSTER_KEY = 'naowee-eventos-roster';

/** Inscritos capturados EN VIVO para un evento (los que el gestor cargó en la sesión). */
export function getRoster(eventId) {
  try {
    const all = JSON.parse(sessionStorage.getItem(ROSTER_KEY) || '{}');
    return Array.isArray(all[eventId]) ? all[eventId] : [];   // blinda contra storage corrupto/no-array
  } catch { return []; }
}

/** Clave de dedup: misma persona + mismo deporte = un solo cupo en el evento. */
function rosterKey(p) {
  return `${String(p.tipoDoc || '').trim().toUpperCase()}·${String(p.nroDoc || '').trim()}·${String(p.deporte || '').trim().toLowerCase()}`;
}

/**
 * Agrega inscritos al roster de un evento (dedup por persona+deporte).
 * @param {string} eventId
 * @param {Array<Object>} list  participantes { tipoDoc, nroDoc, nombre, sexo, deporte, ... }
 * @returns {number} cuántos se agregaron realmente (sin contar duplicados)
 */
export function addInscritos(eventId, list) {
  if (!eventId || !Array.isArray(list) || !list.length) return 0;
  let all;
  try { all = JSON.parse(sessionStorage.getItem(ROSTER_KEY) || '{}'); }
  catch { all = {}; }
  const cur = all[eventId] || [];
  const seen = new Set(cur.map(rosterKey));
  let added = 0;
  list.forEach((p) => {
    const k = rosterKey(p);
    if (seen.has(k)) return;               // ya inscrito en este deporte → no duplicar
    seen.add(k);
    cur.push({ id: `L-${eventId}-${cur.length}`, origen: 'Masivo', prueba: '', ...p });
    added++;
  });
  all[eventId] = cur;
  sessionStorage.setItem(ROSTER_KEY, JSON.stringify(all));
  return added;
}

/* Inscritos ELIMINADOS por el gestor (feedback 25-jul: el gestor puede eliminar
   inscripciones). Guarda los ids removidos para que effectiveRoster los excluya —
   sirve tanto para los capturados en vivo como para los sintetizados del demo. */
const ROSTER_REMOVED_KEY = 'naowee-eventos-roster-removed';
export function getRemovedInscritos(eventId) {
  try { const all = JSON.parse(sessionStorage.getItem(ROSTER_REMOVED_KEY) || '{}'); return Array.isArray(all[eventId]) ? all[eventId] : []; }
  catch { return []; }
}
/** Elimina un inscrito del evento (por id). Lo quita del roster en vivo y lo marca
 *  como removido (para los sintetizados que effectiveRoster regenera). */
export function removeInscrito(eventId, id) {
  if (!eventId || !id) return false;
  try {
    const all = JSON.parse(sessionStorage.getItem(ROSTER_KEY) || '{}');
    if (Array.isArray(all[eventId])) { all[eventId] = all[eventId].filter((p) => p.id !== id); sessionStorage.setItem(ROSTER_KEY, JSON.stringify(all)); }
  } catch { /* noop */ }
  try {
    const rm = JSON.parse(sessionStorage.getItem(ROSTER_REMOVED_KEY) || '{}');
    rm[eventId] = rm[eventId] || [];
    if (!rm[eventId].includes(id)) rm[eventId].push(id);
    sessionStorage.setItem(ROSTER_REMOVED_KEY, JSON.stringify(rm));
  } catch { /* noop */ }
  return true;
}

/**
 * Actualiza un inscrito del roster (edición desde la vista "Deportistas inscritos").
 * Entrada EN VIVO → merge en sitio (conserva id). Sintetizada (demo) → se materializa:
 * marca la original como removida y agrega la versión editada al roster en vivo.
 */
export function updateInscrito(eventId, id, patch) {
  if (!eventId || !id || !patch) return false;
  let all;
  try { all = JSON.parse(sessionStorage.getItem(ROSTER_KEY) || '{}'); } catch { all = {}; }
  const list = Array.isArray(all[eventId]) ? all[eventId] : [];
  const idx = list.findIndex((p) => p.id === id);
  if (idx !== -1) {
    /* Entrada EN VIVO: rechaza si el nuevo doc+deporte colisiona con OTRO inscrito
       (evita un duplicado oculto por dedup de effectiveRoster). */
    const newKey = rosterKey(patch);
    if (list.some((p, i) => i !== idx && rosterKey(p) === newKey)) return false;
    list[idx] = { ...list[idx], ...patch, id };   // conserva id y origen si no se pasa
    all[eventId] = list;
    sessionStorage.setItem(ROSTER_KEY, JSON.stringify(all));
    return true;
  }
  /* Sintetizada → materializar: agrega PRIMERO la editada; si el dedup la rechaza
     (colisión doc+deporte con otro inscrito en vivo) NO borres la original y reporta
     el conflicto — evita el borrado silencioso (hallazgo auditoría v0.8.4). */
  const added = addInscritos(eventId, [{ origen: 'Editado', ...patch }]);
  if (!added) return false;
  removeInscrito(eventId, id);
  return true;
}

/* ═══════════════════════════════════════════════════════════════
   RESULTADOS — posición por (evento · persona · competencia)
   Liga Resultados ↔ Medallería (feedback Doug): la medalla debe RESPETAR el
   puesto del podio — un puesto > 3 no recibe medalla; 1/2/3 → oro/plata/bronce.
   Lo ESCRIBE el ranking manual (individual + internacional); lo LEE la medallería.
   key: 'naowee-eventos-result-pos' → { [eventId]: { [posKey]: {posicion, deportista, deporte, prueba} } }
   ═══════════════════════════════════════════════════════════════ */
const RESULT_POS_KEY = 'naowee-eventos-result-pos';
/** Clave persona+competencia (documento · deporte · prueba, normalizada). */
export function positionKey(p) {
  const n = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  return `${String(p.nroDoc || '').trim()}·${n(p.deporte)}·${n(p.prueba)}`;
}
export function getResultPositions(eventId) {
  try { const all = JSON.parse(sessionStorage.getItem(RESULT_POS_KEY) || '{}'); return all[eventId] || {}; }
  catch { return {}; }
}
export function setResultPosition(eventId, rec) {
  if (!eventId || !rec || !rec.nroDoc) return;
  let all;
  try { all = JSON.parse(sessionStorage.getItem(RESULT_POS_KEY) || '{}'); } catch { all = {}; }
  if (!all[eventId]) all[eventId] = {};
  all[eventId][positionKey(rec)] = { posicion: rec.posicion, marca: rec.marca || '', deportista: rec.deportista || rec.nombre || '', deporte: rec.deporte || '', prueba: rec.prueba || '' };
  sessionStorage.setItem(RESULT_POS_KEY, JSON.stringify(all));
}
/** Quita el resultado registrado de una persona+competencia (para volver a capturarlo). */
export function removeResultPosition(eventId, key) {
  let all;
  try { all = JSON.parse(sessionStorage.getItem(RESULT_POS_KEY) || '{}'); } catch { return; }
  if (all[eventId] && all[eventId][key]) { delete all[eventId][key]; sessionStorage.setItem(RESULT_POS_KEY, JSON.stringify(all)); }
}

/* ═══════════════════════════════════════════════════════════════
   CALENDARIO DEL ORGANISMO (liga/entidad)
   Los eventos que el organismo publica en calendario.html se guardan en
   sessionStorage bajo esta misma clave; aquí se exponen para que el
   CALENDARIO del módulo (eventos.html) también los refleje.
   Shape persistido: { id, emoji, titulo, fecha(ISO), fechaFin?(ISO), hora?, link? }
   ═══════════════════════════════════════════════════════════════ */
export const ORGANISMO_CAL_KEY = 'naowee-eventos-calendario';
export const ORGANISMO_CAL_SEED = [
  { id: 'c1', emoji: '🏊', titulo: 'Copa Departamental de Natación Categorías Menores 2026', fecha: '2026-07-12', fechaFin: '2026-07-14', hora: '08:00', link: 'https://liganatacionvalle.com/copa-departamental-2026' },
  { id: 'c2', emoji: '🌊', titulo: 'Festival Acuático Interligas Valle del Cauca', fecha: '2026-09-05', fechaFin: '2026-09-06', hora: '09:30', link: '' },
  { id: 'c3', emoji: '🤽', titulo: 'Campeonato Zonal de Natación Artística 2026', fecha: '2026-10-22', hora: '', link: 'https://liganatacionvalle.com/artistica-2026' }
];

export function getOrganismoCal() {
  try { const raw = sessionStorage.getItem(ORGANISMO_CAL_KEY); if (raw) return JSON.parse(raw); }
  catch (_) { /* noop */ }
  return [...ORGANISMO_CAL_SEED];
}

export function saveOrganismoCal(list) {
  try { sessionStorage.setItem(ORGANISMO_CAL_KEY, JSON.stringify(list)); } catch (_) { /* noop */ }
}

const _CAL_MES_ABBR = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function _isoToCalDate(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-');
  return `${parseInt(d, 10)} ${_CAL_MES_ABBR[parseInt(m, 10) - 1]} ${y}`;
}

/* Eventos del organismo mapeados al shape que consume el calendario del módulo
   (name + start/end en 'DD mmm YYYY' + status 'organismo' + link externo). */
export function organismoEventsForCalendar() {
  return getOrganismoCal().map((e) => ({
    id: 'ORG-' + e.id,
    emoji: e.emoji || '📅',
    name: e.titulo,
    start: _isoToCalDate(e.fecha),
    end: _isoToCalDate(e.fechaFin || e.fecha),
    status: 'organismo',
    org: e.org || 'Liga de Natación del Valle',
    link: e.link || '',
    hora: e.hora || '',
    kind: 'organismo'
  })).filter((e) => e.start);
}

/* ═══════════════════════════════════════════════════════════════
   SEMILLA DE LA DEMO "Libre · con datos" — cargue simulado de Andrea
   ───────────────────────────────────────────────────────────────
   Los INDIVIDUALES ya los sintetiza effectiveRoster (roster-data.js) en
   cuanto insc.done>0. Aquí pre-cargamos los EQUIPOS de los eventos de
   CONJUNTO activos (el flujo por equipos no usa el roster individual), para
   demostrar la UX de equipos sin que el gestor tenga que capturarlos.
   · countedRes/countedMed = true → ya contados (no re-suman al re-guardar).
   · Corre UNA vez por sesión (flag); "Reiniciar demo" borra el flag y las
     claves naowee-eventos-*, así que se re-siembra en la próxima carga.
   · Solo en modo 'demo' (Libre · con datos); en 'blank' (Guiado · vacío) no.
   ═══════════════════════════════════════════════════════════════ */
const EQ_TEAMS_KEY = 'naowee-eventos-equipos';
const SEED_FLAG_KEY = 'naowee-eventos-demo-seeded';
const SEED_VERSION = 'v1';
const _vTeam = (o) => ({ organizacion: '', pais: '', deporte: '', prueba: 'EQUIPOS', posicion: '', marca: '', medalla: '', integrantes: [], countedRes: true, countedMed: !!o.medalla, ...o });
/* EV-018 Voleibol (internacional) → equipos = países (Colombia + rivales de América). */
const _voleiIntl = [
  { organizacion: 'Selección Brasil', pais: 'BR', deporte: 'Voleibol', posicion: '1', marca: '3-0', medalla: 'oro' },
  { organizacion: 'Selección Colombia', pais: 'CO', deporte: 'Voleibol', posicion: '2', marca: '3-1', medalla: 'plata' },
  { organizacion: 'Selección Argentina', pais: 'AR', deporte: 'Voleibol', posicion: '3', marca: '3-2', medalla: 'bronce' },
  { organizacion: 'Selección Perú', pais: 'PE', deporte: 'Voleibol', posicion: '4', marca: '2-3' },
  { organizacion: 'Selección Chile', pais: 'CL', deporte: 'Voleibol', posicion: '5', marca: '2-3' },
  { organizacion: 'Selección México', pais: 'MX', deporte: 'Voleibol', posicion: '6', marca: '1-3' },
  { organizacion: 'Selección Rep. Dominicana', pais: 'DO', deporte: 'Voleibol', posicion: '7', marca: '1-3' },
  { organizacion: 'Selección Puerto Rico', pais: 'PR', deporte: 'Voleibol', posicion: '8', marca: '0-3' }
];
/* EV-021 Baloncesto (nacional) → equipos = ligas colombianas. */
const _baloncNac = [
  { organizacion: 'Liga Antioqueña', deporte: 'Baloncesto', posicion: '1', marca: '82-70', medalla: 'oro' },
  { organizacion: 'Liga del Valle', deporte: 'Baloncesto', posicion: '2', marca: '75-68', medalla: 'plata' },
  { organizacion: 'Liga de Bogotá', deporte: 'Baloncesto', posicion: '3', marca: '80-72', medalla: 'bronce' },
  { organizacion: 'Liga de Santander', deporte: 'Baloncesto', posicion: '4', marca: '66-71' },
  { organizacion: 'Liga del Atlántico', deporte: 'Baloncesto', posicion: '5', marca: '59-70' },
  { organizacion: 'Liga de Risaralda', deporte: 'Baloncesto', posicion: '6', marca: '61-77' },
  { organizacion: 'Liga de Cundinamarca', deporte: 'Baloncesto', posicion: '7', marca: '55-80' },
  { organizacion: 'Liga de Boyacá', deporte: 'Baloncesto', posicion: '8', marca: '58-84' }
];
/* EV-019 Juegos Nacionales (multideporte) → equipos de sus deportes de conjunto
   (Fútbol Sala + Baloncesto). Los individuales del evento ya salen del roster. */
const _conjNac = [
  { organizacion: 'Liga Antioqueña', deporte: 'Fútbol Sala', posicion: '1', marca: '4-2', medalla: 'oro' },
  { organizacion: 'Liga de Bogotá', deporte: 'Fútbol Sala', posicion: '2', marca: '3-1', medalla: 'plata' },
  { organizacion: 'Liga del Valle', deporte: 'Fútbol Sala', posicion: '3', marca: '5-3', medalla: 'bronce' },
  { organizacion: 'Liga del Atlántico', deporte: 'Baloncesto', posicion: '1', marca: '88-79', medalla: 'oro' },
  { organizacion: 'Liga de Santander', deporte: 'Baloncesto', posicion: '2', marca: '77-70', medalla: 'plata' },
  { organizacion: 'Liga de Risaralda', deporte: 'Baloncesto', posicion: '3', marca: '69-66', medalla: 'bronce' }
];
const DEMO_TEAMS = { 'EV-2026-018': _voleiIntl, 'EV-2026-021': _baloncNac, 'EV-2026-019': _conjNac };

export function seedDemoData() {
  try {
    if (typeof sessionStorage === 'undefined') return;
    if (localStorage.getItem('naowee-eventos-demo-mode') === 'blank') return;   // Guiado · vacío → no sembrar
    if (sessionStorage.getItem(SEED_FLAG_KEY) === SEED_VERSION) return;         // ya sembrado esta sesión
    const all = JSON.parse(sessionStorage.getItem(EQ_TEAMS_KEY) || '{}');
    Object.entries(DEMO_TEAMS).forEach(([eid, teams]) => {
      if (!Array.isArray(all[eid]) || all[eid].length === 0) {                  // no pisar equipos ya capturados
        all[eid] = teams.map((t, i) => ({ id: 'eqt-' + (i + 1), ..._vTeam(t) }));
      }
    });
    sessionStorage.setItem(EQ_TEAMS_KEY, JSON.stringify(all));
    sessionStorage.setItem(SEED_FLAG_KEY, SEED_VERSION);
  } catch (e) { /* noop: la demo funciona sin la semilla */ }
}

/* Sembrar al cargar el módulo (todas las páginas importan events-data.js → corre
   una vez por sesión gracias al flag; el orden es antes de cualquier render). */
seedDemoData();
