/* ═══════════════════════════════════════════════════════════════════════
   ROSTER — fuente EFECTIVA de inscritos por evento (determinista)
   ───────────────────────────────────────────────────────────────────────
   El flujo correcto (feedback Doug): un deportista solo puede recibir un
   RESULTADO o una MEDALLA si está INSCRITO en el evento. Por eso ranking y
   medallería leen de aquí, no de un roster global hardcodeado.

   effectiveRoster(ev) = capturas EN VIVO (events-data · getRoster) primero
   + un roster SINTETIZADO coherente con el DEPORTE real del evento (para que
   los eventos precargados del demo no arranquen vacíos). El sintetizado se
   siembra con el id del evento → estable entre renders, y respeta:
     · Atletismo → atletas de atletismo con sus pruebas
     · Boxeo internacional → boxeadores (no atletismo)
     · Multideporte → mezcla de disciplinas
     · evento nuevo sin inscripciones (insc.done = 0) → SIN roster (estado vacío)
   ═══════════════════════════════════════════════════════════════════════ */
import { DEPORTES_POR_TIPO, DEPARTAMENTOS } from './catalogo.js';
import { EVENTS, getDrafts, getRoster, getRemovedInscritos } from './events-data.js';

/* ── RNG determinista (FNV-1a → LCG), mismo patrón que reporteria-data.js ── */
function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/* ── Pools de nombres (colombianos) — combinados dan unicidad de sobra ── */
const NOMBRES_M = ['Santiago', 'Sebastián', 'Mateo', 'Nicolás', 'Samuel', 'Andrés', 'Daniel', 'Juan David', 'Diego', 'Camilo', 'Emmanuel', 'Tomás', 'Julián', 'Felipe', 'Alejandro', 'David', 'Miguel Ángel', 'Esteban', 'Simón', 'Carlos'];
const NOMBRES_F = ['Valentina', 'Isabella', 'María José', 'Sara', 'Laura', 'Mariana', 'Sofía', 'Gabriela', 'Daniela', 'Antonella', 'Luciana', 'Salomé', 'Juliana', 'Camila', 'Valeria', 'Manuela', 'Emily', 'Paula', 'Alejandra', 'Andrea'];
const APELLIDOS = ['Gómez', 'Rodríguez', 'Martínez', 'García', 'López', 'Hernández', 'Ramírez', 'Torres', 'Vargas', 'Jiménez', 'Moreno', 'Muñoz', 'Rojas', 'Herrera', 'Castro', 'Ortiz', 'Sánchez', 'Cárdenas', 'Quintero', 'Mejía', 'Ríos', 'Arango', 'Pinto', 'Salcedo', 'Peñaloza', 'Mancera', 'Bermúdez', 'Naranjo', 'Mosquera', 'Salas'];
const TIPOS_DOC = ['CC', 'TI', 'CE'];
/* Organizaciones (ligas) que el participante REPRESENTA — el medallero se agrupa
   por esto, no por el organismo que organiza el evento. */
const LIGAS_POOL = ['Liga del Valle', 'Liga Antioqueña', 'Liga de Bogotá', 'Liga de Santander', 'Liga de Cundinamarca', 'Liga del Atlántico', 'Liga de Risaralda', 'Liga de Nariño', 'Liga del Cauca', 'Liga de Boyacá'];

/* ── Catálogo aplanado (deporte → pruebas + tipo) y alias del ev.sport ── */
const ALL_DEPORTES = Object.entries(DEPORTES_POR_TIPO)
  .flatMap(([tipo, arr]) => arr.map((d) => ({ ...d, tipo })));

const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

/* Mapea el "encabezado" del ev.sport a un label del catálogo cuando difieren. */
const ALIAS = {
  'halterofilia': 'Levantamiento de Pesas',
  'levantamiento de pesas': 'Levantamiento de Pesas',
  'ciclismo': 'Ciclismo Ruta',
  'voleibol playa': 'Voleibol',
  'voleibol': 'Voleibol',
  'tenis de mesa': 'Tenis de Mesa',
  'futbol': 'Fútbol',
  'futbol sala': 'Fútbol Sala',
  'futbol salon': 'Fútbol Salón',
  'gimnasia': 'Gimnasia',           // no está en el catálogo → fallback con pruebas propias
  'ajedrez': 'Ajedrez Integrado'
};

/* Pruebas de respaldo para deportes fuera del catálogo (p.ej. Gimnasia). */
const PRUEBAS_FALLBACK = {
  'Gimnasia': ['ALL AROUND', 'SUELO', 'BARRA DE EQUILIBRIO', 'SALTO', 'BARRAS ASIMÉTRICAS'],
};

/**
 * Resuelve el/los deporte(s) del evento a partir de ev.sport.
 * Devuelve un array de { label, emoji, pruebas[] }.
 */
function resolveDeportes(ev) {
  const sport = ev.sport || '';
  if (norm(sport).startsWith('multideporte')) {
    /* Multideporte → mezcla determinista de disciplinas del catálogo. */
    const rng = makeRng(seedFrom(ev.id + '·multi'));
    const pool = ALL_DEPORTES.slice();
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    return pool.slice(0, 8);
  }
  const head = sport.split('·')[0].trim();                 // "Atletismo · Pista y campo" → "Atletismo"
  const target = norm(ALIAS[norm(head)] || head);
  const found = ALL_DEPORTES.find((d) => norm(d.label) === target);
  if (found) return [found];
  /* Deporte no catalogado → mantén el deporte del evento (coherencia) con pruebas de respaldo. */
  const label = ALIAS[norm(head)] || head || 'General';
  return [{ label, emoji: '🏅', pruebas: PRUEBAS_FALLBACK[label] || ['FINAL', 'CLASIFICATORIA'] }];
}

/* Inscritos DECLARADOS de base (pre-cargados en la data del demo), sin los
   deltas de cargue en vivo. 0 → evento nuevo → no se sintetiza roster. */
function baseInscDone(ev) {
  const draft = getDrafts().find((e) => e.id === ev.id);
  const raw = draft || EVENTS.find((e) => e.id === ev.id);
  return (raw && raw.insc && raw.insc.done) ? raw.insc.done : 0;
}

const SEED_CAP = 24;   // muestra de trabajo para la captura manual (el total real vive en insc.done)

/** Roster SINTETIZADO coherente con el deporte del evento (vacío si base = 0). */
function synthRoster(ev) {
  const base = baseInscDone(ev);
  if (!base) return [];
  const n = Math.min(base, SEED_CAP);
  const rng = makeRng(seedFrom(ev.id));
  const deportes = resolveDeportes(ev);
  const depto = (ev.place && ev.place.includes(',')) ? ev.place.split(',').pop().trim()
    : DEPARTAMENTOS[Math.floor(rng() * DEPARTAMENTOS.length)];
  /* Subconjunto de ligas (4-6) seedeado por evento → medallero variado pero estable. */
  const nLigas = 4 + Math.floor(rng() * 3);
  const ligas = LIGAS_POOL.slice().sort(() => rng() - 0.5).slice(0, nLigas);
  const usedName = new Set();
  const usedDoc = new Set();
  const out = [];
  for (let i = 0; i < n; i++) {
    const dep = deportes[Math.floor(rng() * deportes.length)];
    const prueba = dep.pruebas[Math.floor(rng() * dep.pruebas.length)];
    const sexo = rng() < 0.5 ? 'F' : 'M';
    /* Nombre único (nombre + 2 apellidos), reintenta hasta encontrar combinación libre. */
    let nombre = '';
    for (let t = 0; t < 12; t++) {
      const first = (sexo === 'F' ? NOMBRES_F : NOMBRES_M)[Math.floor(rng() * (sexo === 'F' ? NOMBRES_F : NOMBRES_M).length)];
      const a1 = APELLIDOS[Math.floor(rng() * APELLIDOS.length)];
      const a2 = APELLIDOS[Math.floor(rng() * APELLIDOS.length)];
      nombre = `${first} ${a1} ${a2}`;
      if (!usedName.has(nombre)) break;
    }
    usedName.add(nombre);
    /* Documento único. */
    let nroDoc = '';
    do { nroDoc = String(1000000000 + Math.floor(rng() * 99999999)); } while (usedDoc.has(nroDoc));
    usedDoc.add(nroDoc);
    const tipoDoc = TIPOS_DOC[Math.floor(rng() * TIPOS_DOC.length)];
    out.push({
      id: `S-${ev.id}-${i}`,
      tipoDoc, nroDoc, nombre, sexo,
      deporte: dep.label, prueba,
      depto, organizacion: ligas[Math.floor(rng() * ligas.length)],
      correo: `${norm(nombre).replace(/\s+/g, '.')}@correo.com`,
      origen: 'Precargado', seed: true
    });
  }
  return out;
}

/** Clave de dedup persona+deporte (idéntica a la del store). */
function key(p) {
  return `${norm(p.tipoDoc)}·${String(p.nroDoc || '').trim()}·${norm(p.deporte)}`;
}

/**
 * Roster EFECTIVO del evento = inscritos en vivo + roster sintetizado, deduplicado.
 * Los inscritos en vivo van PRIMERO (lo que el gestor acaba de cargar es lo más
 * relevante para darles resultado/medalla).
 * @param {Object} ev  evento (de allEvents())
 * @returns {Array<Object>}
 */
export function effectiveRoster(ev) {
  if (!ev) return [];
  const removed = new Set(getRemovedInscritos(ev.id));   // eliminados por el gestor
  const live = getRoster(ev.id).map((p, i) => ({ prueba: '', ...p, id: p.id || `L-${ev.id}-${i}` }));
  const merged = [...live, ...synthRoster(ev)];
  const seen = new Set();
  const out = [];
  merged.forEach((p) => { if (removed.has(p.id)) return; const k = key(p); if (seen.has(k)) return; seen.add(k); out.push(p); });
  return out;
}
