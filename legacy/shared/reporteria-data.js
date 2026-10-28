/* ═══════════════════════════════════════════════════════════════════════
   REPORTERÍA — sintetizador de analítica POR EVENTO (determinista)
   ───────────────────────────────────────────────────────────────────────
   Diego (analítica) definió la arquitectura: 3 tableros por evento
   (Inscripciones · Resultados · Medallería). Aquí derivamos breakdowns
   coherentes a partir de los totales REALES de cada evento (insc/res/med
   {done,total} en events-data.js), sembrados por el id del evento → cada
   evento muestra números distintos pero estables, y los breakdowns SUMAN
   exactamente al total real. Eventos en borrador (done=0) → hasData=false
   y el tablero muestra empty states canónicos.
   ═══════════════════════════════════════════════════════════════════════ */
import { pct } from './events-data.js';
import { PAISES, PAIS_SEGUIDO, paisFlag, paisName, paisRegion } from './paises.js';

/* ── RNG determinista (FNV-1a → LCG) ─────────────────────────────────── */
function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/* ── Catálogo de dimensiones (organismos = ligas) ────────────────────── */
export const ORGANISMOS = [
  { name: 'Liga Antioqueña',    av: 'AN', c: '#d74009' },
  { name: 'Liga del Valle',     av: 'VA', c: '#1f78d1' },
  { name: 'Liga Bogotana',      av: 'BO', c: '#7c3aed' },
  { name: 'Liga de Santander',  av: 'SA', c: '#1f8923' },
  { name: 'Liga Atlántico',     av: 'AT', c: '#0891b2' },
  { name: 'Liga Bolívar',       av: 'BL', c: '#9333ea' },
  { name: 'Liga Nariño',        av: 'NA', c: '#c2410c' },
  { name: 'Liga Meta',          av: 'ME', c: '#065f46' },
  { name: 'Liga Boyacá',        av: 'BY', c: '#1e40af' },
  { name: 'Liga Córdoba',       av: 'CO', c: '#92400e' },
  { name: 'Liga Caldas',        av: 'CA', c: '#b45309' },
  { name: 'Liga Tolima',        av: 'TO', c: '#0d9488' }
];

/* ── Dimensión "equipo" internacional = PAÍS (Colombia = país seguido) ──
   En un evento internacional los "equipos" son países. Colombia siempre entra
   (es el país que se sigue) en la posición 0, y el resto son rivales sembrados
   (Fisher-Yates por el id del evento → set estable). Los items caben en el mismo
   shape que ORGANISMOS pero con `flag`/`isCol` (sin `av`/`c`: el panel pinta la
   bandera en vez del recuadro de iniciales). */
function participatingCountries(rnd, count, region) {
  /* Si el evento acota una región (p.ej. Panamericano → 'América'), el pool de
     países se filtra a esa región para que el medallero sea geográficamente
     coherente (nada de países de otro continente en unos Panamericanos). Colombia
     (país seguido) SIEMPRE entra, esté o no en la región. */
  const inRegion = region ? PAISES.filter((p) => paisRegion(p.value) === region) : PAISES;
  const pool = inRegion.length ? inRegion : PAISES;
  const colP = PAISES.find((p) => p.value === PAIS_SEGUIDO);
  const rivals = shuffled(pool.filter((p) => p.value !== PAIS_SEGUIDO), rnd);
  return [colP, ...rivals].slice(0, Math.max(0, count)).map((p) => ({
    name: paisName(p.value), flag: paisFlag(p.value), value: p.value, isCol: p.value === PAIS_SEGUIDO
  }));
}

const DISCIPLINAS_MULTI = ['Atletismo', 'Natación', 'Ciclismo', 'Patinaje', 'Taekwondo', 'Judo', 'Karate Do', 'Baloncesto', 'Fútbol Sala', 'Voleibol', 'Levantamiento', 'Boxeo', 'Tenis de Mesa', 'Gimnasia'];
const NOMBRES = ['Carlos Rodríguez', 'Luis Martínez', 'Sebastián Torres', 'Felipe Gutiérrez', 'Andrés Vargas', 'Daniel Morales', 'Camilo Herrera', 'Ricardo Sánchez', 'Mateo Jiménez', 'Santiago Ramírez', 'Valentina Ríos', 'Laura Castro', 'Mariana Díaz', 'Sofía Mejía'];

/* Pruebas representativas por deporte (para single-sport y mejor marca). */
const PRUEBAS_POR_DEPORTE = {
  'Atletismo': ['100m Planos', '200m Planos', '400m Planos', '1.500m', 'Salto Largo', 'Maratón'],
  'Natación':  ['50m Libre', '100m Libre', '200m Libre', '100m Espalda', '100m Pecho'],
  'Ciclismo':  ['Ruta 120 km', 'Contrarreloj', 'Montaña 40 km'],
  'Taekwondo': ['Kyorugi -54kg', 'Kyorugi -58kg', 'Poomsae'],
  'Voleibol':  ['Masculino', 'Femenino'],
  'Fútbol Sala': ['Masculino', 'Femenino'],
  'Levantamiento': ['Arranque -73kg', 'Envión -81kg', 'Total Olímpico'],
  'Boxeo':     ['-52kg', '-60kg', '-69kg'],
  'Tenis de Mesa': ['Individual M', 'Individual F', 'Dobles'],
  'Gimnasia':  ['All Around', 'Suelo', 'Barra de equilibrio']
};
/* Marcas MONÓTONAS por familia de deporte: pos 1 = la mejor. Para tiempos
   (atletismo/natación/ciclismo) ascendente (menor = mejor); para kg/puntos
   descendente (mayor = mejor). Devuelve un array ordenado de n marcas. */
function genMarcas(sport, n, rnd) {
  const s = sport.toLowerCase();
  const out = [];
  if (s.includes('atlet')) { let v = 10.0 + rnd() * 0.5; for (let i = 0; i < n; i++) { out.push(v.toFixed(2) + ' s'); v += 0.06 + rnd() * 0.16; } }
  else if (s.includes('nataci')) { let v = 22 + rnd() * 1.5; for (let i = 0; i < n; i++) { out.push(v.toFixed(2) + ' s'); v += 0.15 + rnd() * 0.4; } }
  else if (s.includes('ciclis')) { let m = 188 + Math.floor(rnd() * 10); for (let i = 0; i < n; i++) { out.push('3h ' + String(m % 60).padStart(2, '0') + 'm'); m += 1 + Math.floor(rnd() * 3); } }
  else if (s.includes('levant') || s.includes('pesas')) { let v = 248 - Math.floor(rnd() * 16); for (let i = 0; i < n; i++) { out.push(v + ' kg'); v -= 3 + Math.floor(rnd() * 5); } }
  else { let v = 96 - Math.floor(rnd() * 5); for (let i = 0; i < n; i++) { out.push(v + ' pts'); v -= 2 + Math.floor(rnd() * 4); } } // combate/jueces/default
  return out;
}
/* Fisher-Yates sembrado → orden estable por evento (para nombres ÚNICOS). */
function shuffled(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const initials = (nm) => nm.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/* ── Reparto entero determinista según pesos (suma exacta al total) ──── */
function splitTotal(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const out = weights.map((w) => Math.max(0, Math.round((total * w) / sum)));
  const drift = total - out.reduce((a, b) => a + b, 0);
  /* Corrige el redondeo en el bucket MAYOR: puede absorber ±drift sin volverse
     negativo. (out[0] NO siempre es el mayor — p.ej. la curva diaria en campana:
     sumarle un drift negativo lo clampaba a 0 y la suma no cerraba al total.) */
  if (out.length) {
    let mi = 0;
    for (let i = 1; i < out.length; i++) if (out[i] > out[mi]) mi = i;
    out[mi] = Math.max(0, out[mi] + drift);
  }
  return out;
}
/* Pesos decrecientes con jitter sembrado (para rankings realistas). */
function decayWeights(n, rnd) {
  return Array.from({ length: n }, (_, i) => (n - i) + rnd() * 1.6);
}
/* Pesos de medallas para el medallero internacional: Colombia (país seguido) NO
   se fuerza a #1 — recibe el peso de un rango top sembrado (1.º–3.º) y el resto de
   países se reparten los demás pesos en orden aleatorio. Así "Posición de Colombia"
   y "brecha con el líder" son realistas y varían por evento. Si no hay país seguido
   (medallero nacional por ligas), devuelve decayWeights alineado por índice (idéntico
   al comportamiento previo → nacional intacto). */
function medalWeights(teams, rnd, fixedTarget) {
  const n = teams.length;
  const w = decayWeights(n, rnd);                 // valores descendentes por rango
  const ci = teams.findIndex((t) => t.isCol);
  if (ci < 0 || n === 0) return w;                // nacional (ligas): alineado por índice
  /* Colombia se ancla al MISMO rango (fixedTarget) en oro/plata/bronce → su posición
     en el medallero es coherente (no #1 en oro y #8 en plata). Los rivales se barajan
     por metal, así el líder varía pero Colombia mantiene un puesto realista top-3. */
  const target = (fixedTarget != null) ? Math.min(fixedTarget, n - 1) : Math.floor(rnd() * Math.min(3, n));
  const rest = w.filter((_, i) => i !== target);
  const others = shuffled(teams.map((_, i) => i).filter((i) => i !== ci), rnd);
  const out = new Array(n);
  out[ci] = w[target];
  others.forEach((idx, k) => { out[idx] = rest[k]; });
  return out;
}

const num = (n) => (n || 0).toLocaleString('es-CO');

/* ═══════════════════════════════════════════════════════════════════════
   buildReporteria(ev) — objeto consumido por reporteria.html
   ═══════════════════════════════════════════════════════════════════════ */
export function buildReporteria(ev, scope) {
  /* Ámbito del reporte: por defecto sigue al `ev.alcance`, pero el segment de la
     página puede forzarlo (para previsualizar el otro encuadre con la misma data).
     En internacional la dimensión "equipo" pasa de ligas (ORGANISMOS) a PAÍSES. */
  const isIntl = scope ? scope === 'internacional' : (ev.alcance === 'internacional');
  /* Salt del seed SOLO en internacional: nacional queda byte-idéntico (ev.id + ''
     === ev.id) y el reencuadre internacional muestra una distribución distinta,
     no los mismos números relabeleados. */
  const rnd = makeRng(seedFrom(ev.id + (isIntl ? '|intl' : '')));
  const insc = ev.insc || { done: 0, total: 0 };
  const res = ev.res || { done: 0, total: 0 };
  const med = ev.med || { done: 0, total: 0 };

  /* Deportes del evento: multideporte → disciplinas; single → 1 deporte. */
  const isMulti = /multideporte/i.test(ev.sport || '');
  const baseSport = (ev.sport || 'Deporte').split('·')[0].trim();
  const disciplinas = isMulti
    ? DISCIPLINAS_MULTI.slice(0, Math.max(6, parseInt((ev.sport.match(/(\d+)/) || [])[1] || '14', 10)))
    : [baseSport];

  /* Nº de equipos participantes (sembrado): ligas (nacional) o países (internacional). */
  const orgCount = insc.done > 0
    ? (isIntl ? Math.min(PAISES.length, Math.max(8, 8 + Math.floor(rnd() * 8)))
              : Math.min(ORGANISMOS.length, Math.max(3, 4 + Math.floor(rnd() * 8))))
    : 0;
  const poolRegion = ev.poolRegion;   // p.ej. 'América' para Panamericanos (acota el pool de países)
  const orgs = isIntl ? participatingCountries(rnd, orgCount, poolRegion) : ORGANISMOS.slice(0, orgCount);

  /* ── INSCRIPCIONES ─────────────────────────────────────────────────── */
  const pruebasTotal = isMulti ? disciplinas.length * 6 : (PRUEBAS_POR_DEPORTE[baseSport] || ['Final']).length * 2;
  const inscData = {
    hasData: insc.done > 0,
    isIntl,
    inscritos: insc.done,
    cupo: insc.total,
    pctCupo: pct(insc.done, insc.total),
    organismosCount: orgCount,
    paisesCount: orgCount,
    deportesCount: disciplinas.length,
    pruebasCount: pruebasTotal,
    pruebasConInscritos: Math.round(pruebasTotal * (0.55 + rnd() * 0.35)),
    daily: dailyCurve(insc.done, rnd),
    porOrganismo: isIntl ? [] : orgs.map((o, i) => ({ ...o })),
    porRegion: [],
    porDeporte: [],
    tipo: []
  };
  if (!isIntl) {
    // NACIONAL: reparto de inscritos por organismo (liga).
    splitTotal(insc.done, decayWeights(orgCount, rnd)).forEach((v, i) => { if (inscData.porOrganismo[i]) inscData.porOrganismo[i].v = v; });
    inscData.porOrganismo.sort((a, b) => b.v - a.v);
  } else {
    /* INTERNACIONAL: en un evento internacional solo se sigue a Colombia → los
       inscritos SON la delegación de Colombia (no se reparten entre países; los
       rivales no se inscriben en el módulo). El eje país vive en Medallería y en
       el podio de Resultados. Aquí interesa el tamaño de NUESTRA delegación y la
       amplitud de la justa (cuántos países/regiones enfrenta). */
    inscData.colDelegacion = insc.done;
    // Participación por región: nº de países participantes por región (amplitud de la justa).
    const regionCount = {};
    orgs.forEach((o) => { const r = paisRegion(o.value); if (r) regionCount[r] = (regionCount[r] || 0) + 1; });
    inscData.porRegion = Object.keys(regionCount).map((r) => ({ lbl: r, v: regionCount[r] })).sort((a, b) => b.v - a.v);
    inscData.regionesCount = inscData.porRegion.length;
  }
  // por deporte (multi) o por prueba (single)
  const depLabels = isMulti ? disciplinas : (PRUEBAS_POR_DEPORTE[baseSport] || ['Final']);
  inscData.porDeporteLabel = isMulti ? 'Por deporte' : 'Por prueba';
  inscData.porDeporte = depLabels.map((l) => ({ lbl: l })).slice(0, 8);
  splitTotal(insc.done, decayWeights(inscData.porDeporte.length, rnd)).forEach((v, i) => { if (inscData.porDeporte[i]) inscData.porDeporte[i].v = v; });
  inscData.porDeporte.sort((a, b) => b.v - a.v);
  // tipo (Individual/Conjunto/Paradeporte)
  const tw = isMulti ? [0.55, 0.33, 0.12] : [/sala|voleibol|balonc/i.test(baseSport) ? 0.1 : 0.8, /sala|voleibol|balonc/i.test(baseSport) ? 0.85 : 0.12, 0.08];
  const tvals = splitTotal(insc.done, tw);
  inscData.tipo = [
    { lbl: 'Individual', val: tvals[0], c: '#1f78d1' },
    { lbl: 'Conjunto', val: tvals[1], c: '#d74009' },
    { lbl: 'Paradeporte', val: tvals[2], c: '#7c3aed' }
  ].filter((t) => t.val > 0);

  /* ── RESULTADOS ────────────────────────────────────────────────────── */
  const prueba = (PRUEBAS_POR_DEPORTE[isMulti ? 'Atletismo' : baseSport] || ['Final'])[0];
  const depShown = isMulti ? 'Atletismo' : baseSport;
  const tabla = [];
  if (res.done > 0) {
    const n = Math.min(8, NOMBRES.length);
    const names = shuffled(NOMBRES, rnd).slice(0, n);      // atletas ÚNICOS
    const marcas = genMarcas(depShown, n, rnd);           // marcas MONÓTONAS (pos 1 = mejor)
    if (isIntl) {
      /* Internacional: cada fila es de un PAÍS (Colombia en un puesto de podio
         sembrado, rivales distintos). El "organismo" pasa a ser el país. */
      const pool = orgs.length ? orgs : participatingCountries(rnd, Math.min(PAISES.length, n + 2), poolRegion);
      const col = pool.find((p) => p.isCol) || pool[0];
      const rivals = pool.filter((p) => !p.isCol);
      const colSlot = Math.min(n - 1, Math.floor(rnd() * 3)); // 0..2 → sube al podio
      let ri = 0;
      for (let i = 0; i < n; i++) {
        const c = (i === colSlot) ? col : (rivals.length ? rivals[ri++ % rivals.length] : col);
        tabla.push({ pos: i + 1, dep: names[i], org: c ? c.name : '—', flag: c ? c.flag : '', isCol: !!(c && c.isCol), av: initials(names[i]), marca: marcas[i] });
      }
    } else {
      const ligas = ORGANISMOS.slice(0, n);                 // ligas distintas por fila
      for (let i = 0; i < n; i++) {
        tabla.push({ pos: i + 1, dep: names[i], org: ligas[i].name, av: initials(names[i]), marca: marcas[i] });
      }
    }
  }
  const colBestRow = isIntl ? tabla.find((r) => r.isCol) : null;
  const resData = {
    hasData: res.done > 0,
    isIntl,
    cargados: res.done,
    total: res.total,
    pctCargado: pct(res.done, res.total),
    deportistasConRes: res.done,
    mejorMarca: tabla.length ? tabla[0].marca : '—',
    deporteCtx: depShown,
    pruebaLbl: prueba,
    podio: tabla.slice(0, 3),
    tabla,
    colBestPos: colBestRow ? colBestRow.pos : null,
    colBestMarca: colBestRow ? colBestRow.marca : null
  };

  /* ── MEDALLERÍA ────────────────────────────────────────────────────── */
  const totMed = med.done;
  // oro≈plata≈bronce (cada prueba reparte 3); split casi parejo
  const [oro, plata, bronce] = splitTotal(totMed, [0.34, 0.34, 0.32]);
  const medOrgs = orgs.map((o) => ({ ...o }));
  /* Rango de Colombia en el medallero: sembrado UNA vez (solo intl) y reusado en los
     tres metales → posición coherente y realista (no siempre #1). Nacional: null (no
     consume rnd → secuencia intacta). */
  const colTarget = isIntl ? Math.floor(rnd() * Math.min(3, Math.max(1, medOrgs.length))) : null;
  const oroSplit = splitTotal(oro, medalWeights(medOrgs, rnd, colTarget));
  const plataSplit = splitTotal(plata, medalWeights(medOrgs, rnd, colTarget));
  const bronceSplit = splitTotal(bronce, medalWeights(medOrgs, rnd, colTarget));
  medOrgs.forEach((o, i) => { o.oro = oroSplit[i] || 0; o.plata = plataSplit[i] || 0; o.bronce = bronceSplit[i] || 0; });
  medOrgs.sort((a, b) => (b.oro - a.oro) || (b.plata - a.plata) || (b.bronce - a.bronce));
  const medPor = medOrgs.filter((o) => o.oro + o.plata + o.bronce > 0);
  const medData = {
    hasData: totMed > 0,
    isIntl,
    oro, plata, bronce, total: totMed,
    pruebas: med.total,
    paisesCount: medPor.length,
    porOrganismo: medPor
  };
  // internacional: posición de Colombia en el medallero + su cosecha (métrica estrella)
  if (isIntl) {
    const ci = medPor.findIndex((o) => o.isCol);
    medData.colRank = ci >= 0 ? ci + 1 : null;
    medData.colMedals = ci >= 0
      ? { oro: medPor[ci].oro, plata: medPor[ci].plata, bronce: medPor[ci].bronce, total: medPor[ci].oro + medPor[ci].plata + medPor[ci].bronce }
      : { oro: 0, plata: 0, bronce: 0, total: 0 };
    // Brecha de oros con el líder del medallero (0 si Colombia lidera).
    medData.brechaOroLider = medPor.length ? Math.max(0, medPor[0].oro - medData.colMedals.oro) : 0;
  }

  /* Entidades del filtro "Organismo/País" (fuente del dropdown fOrg en la página):
     nacional → ligas con inscritos; internacional → países participantes (con bandera). */
  const filterEntities = isIntl
    ? orgs.map((o) => ({ value: o.name, label: (o.flag ? o.flag + ' ' : '') + o.name }))
    : inscData.porOrganismo.map((o) => ({ value: o.name, label: o.name }));
  const dim = {
    entity: isIntl ? 'País' : 'Organismo',
    entityAll: isIntl ? 'Todos los países' : 'Todos los organismos'
  };

  return { ev, scope: isIntl ? 'internacional' : 'nacional', isIntl, dim, filterEntities, insc: inscData, res: resData, med: medData, num };
}

/* Curva diaria sembrada (campana sesgada) que suma exactamente al total. */
function dailyCurve(total, rnd) {
  const DAYS = 30;
  if (total <= 0) return Array.from({ length: DAYS }, (_, i) => ({ i, d: 0, a: 0 }));
  const weights = Array.from({ length: DAYS }, (_, i) => {
    const x = (i - DAYS * 0.55) / (DAYS * 0.28);
    return Math.exp(-x * x) * (0.7 + rnd() * 0.6);
  });
  const daily = splitTotal(total, weights);
  let acc = 0;
  return daily.map((d, i) => { acc += d; return { i, d, a: acc }; });
}
