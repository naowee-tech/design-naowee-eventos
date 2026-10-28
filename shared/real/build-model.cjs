#!/usr/bin/env node
// Genera shared/real/model.js (window.OLC_REAL) desde los fixtures del landing real. Sin dependencias.
// Uso: node shared/real/build-model.cjs
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const ev = JSON.parse(fs.readFileSync(path.join(DIR, 'event.json'), 'utf8')).data;

/* ---------- normalización de nombres (autocontenida: se serializa al model.js) ---------- */
/* Regla ÚNICA: «Apellido(s) Nombre(s)» en Camel Case. DUPLICADA idéntica en shared/data.js (generador
   sintético): cualquier cambio aquí se replica allá. Detalle y límites en SPEC.md > Datos. */
function normalizarNombre(raw) {
  var s = String(raw == null ? '' : raw).replace(/\s+/g, ' ').trim();
  if (!s) return '';
  var PART = { de: 1, da: 1, das: 1, do: 1, dos: 1, del: 1, la: 1, las: 1, los: 1, le: 1, van: 1, von: 1, di: 1 };
  var low = function (t) { return t.toLowerCase(); };
  var isPart = function (t) { return PART[low(t)] === 1; };
  var letters = function (t) { return t.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, ''); };
  var isUp = function (t) { var l = letters(t); return l.length >= 2 && l === l.toUpperCase(); };
  var cap = function (t) {
    return low(t).split(/([\'´’\-])/).map(function (p) { return p.charAt(0).toUpperCase() + p.slice(1); }).join('');
  };
  var camel = function (toks) { return toks.map(cap).join(' '); };
  var out = function (ape, nom) { return camel(ape.concat(nom)); };
  var toks = s.split(' ');
  if (toks.length === 1) return isUp(s) || s !== low(s) ? s : cap(s);
  var up = toks.map(isUp);
  var allLow = s === low(s);
  var allUp = up.every(Boolean);
  // A) «APELLIDO(S) Nombre»: corrida de mayúsculas al inicio y resto con nombre; el orden ya es el bueno
  if (up[0] && !allUp) {
    var k = 0;
    while (k < toks.length && up[k]) k++;
    if (k > 0 && k < toks.length) return out(toks.slice(0, k), toks.slice(k));
  }
  // B) «Nombre APELLIDO(S)» (apellido en mayúsculas al final): se mueve al frente
  if (!up[0] && up[toks.length - 1] && !allLow) {
    var j = toks.length - 1;
    while (j > 0 && up[j - 1]) j--;
    return out(toks.slice(j), toks.slice(0, j));
  }
  // C) todo minúscula o todo mayúscula «nombres apellidos»: por unidades (partícula se pega a la siguiente)
  if (allLow || allUp) {
    var units = [], pend = [];
    toks.forEach(function (t) {
      if (isPart(t)) { pend.push(t); } else { units.push(pend.concat([t])); pend = []; }
    });
    if (pend.length) { if (units.length) units[units.length - 1] = units[units.length - 1].concat(pend); else units.push(pend); }
    var n = units.length, nn = n === 1 ? 1 : n === 2 ? 1 : n === 3 ? 1 : 2;
    var flat = function (us) { return [].concat.apply([], us); };
    var nom = flat(units.slice(0, nn)), ape = flat(units.slice(nn));
    return out(ape, nom);
  }
  // otro (Title Case sin pista de apellido, p.ej. «Brasil (relevo)»): se deja, con espacios colapsados
  return s;
}

/* ---------- países ---------- */
const PAISES = {
  AR: 'Argentina', BO: 'Bolivia', BR: 'Brasil', CL: 'Chile', CO: 'Colombia', EC: 'Ecuador',
  GY: 'Guyana', PA: 'Panamá', PY: 'Paraguay', PE: 'Perú', SR: 'Surinam', UY: 'Uruguay',
  VE: 'Venezuela', AW: 'Aruba', TT: 'Trinidad y Tobago', CW: 'Curazao'
};
const strip = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const POR_NOMBRE = {};
Object.keys(PAISES).forEach((c) => { POR_NOMBRE[strip(PAISES[c])] = c; });
function resolverPais(code, nombre) {
  if (code && PAISES[code]) return code;
  if (code) return code; // código desconocido: se conserva
  return POR_NOMBRE[strip(nombre || '')] || null;
}
const paisNombre = (c) => (c ? PAISES[c] || c : null);

/* ---------- sexo / ronda / nombre de prueba ---------- */
const RE_M = /(?:^|[^A-Za-zÁÉÍÓÚáéíóúñ])(masculin[oa]s?|masc|men(?:'s|s's|´s|’s)?|male|hombres?)(?![A-Za-zÁÉÍÓÚáéíóúñ])/i;
const RE_F = /(?:^|[^A-Za-zÁÉÍÓÚáéíóúñ])(femenin[oa]s?|fem|women(?:'s|´s|’s)?|female|damas?)(?![A-Za-zÁÉÍÓÚáéíóúñ])/i;
const RE_X = /(?:^|[^A-Za-zÁÉÍÓÚáéíóúñ])(mixt[oa]s?|mixed)(?![A-Za-zÁÉÍÓÚáéíóúñ])/i;
const RE_SEX_ALL = /(^|[^A-Za-zÁÉÍÓÚáéíóúñ])(masculin[oa]s?|masc|men(?:'s|s's|´s|’s)?|male|hombres?|femenin[oa]s?|fem|women(?:'s|´s|’s)?|female|damas?|mixt[oa]s?|mixed)(?![A-Za-zÁÉÍÓÚáéíóúñ])/gi;
function derivarSexo(fase, id) {
  const m = RE_M.test(fase), f = RE_F.test(fase), x = RE_X.test(fase);
  if (x || (m && f)) return { sexo: 'X', via: 'texto' };
  if (m) return { sexo: 'M', via: 'texto' };
  if (f) return { sexo: 'F', via: 'texto' };
  const p = (id || '').slice(0, 2);
  if (p === 'M.') return { sexo: 'M', via: 'id' };
  if (p === 'W.') return { sexo: 'F', via: 'id' };
  if (p === 'X.') return { sexo: 'X', via: 'id' };
  return { sexo: 'X', via: 'fallo' };
}
const SEXO_NOMBRE = { F: 'Femenino', M: 'Masculino', X: 'Mixto' };
const RE_RONDA = /(^|[\s(\-–—])(serie|heat|grupo|ronda|final(?:es)?|cuartos|semifinal(?:es|s)?|combate|partido|match|repesca|medallas?|clasificaci[oó]n|clasificatoria|clasificatorias|eliminatori[ao]s?|preliminar(?:es)?|regata|round|main|programa|qualification|octavos|1\/8|1\/4|dressage|jumping|persecuci[oó]n\s+por\s+equipos\s+final)(?![A-Za-zÁÉÍÓÚáéíóúñ])/i;
function limpiar(t) {
  return t.replace(/\s+/g, ' ').replace(/^[\s,\-–—/]+|[\s,\-–—/]+$/g, '').replace(/\(\s*\)/g, '').trim();
}
// Categorías de peso legibles: «-68kg»→«Hasta 68 kg», «+80 Kg»→«Más de 80 kg» (DC-131).
function nombreLegible(n) {
  const r = n
    .replace(/(^|[\s(])\+\s*(?:de\s+)?(\d+(?:[.,]\d+)?)\s*kg\b/gi, '$1Más de $2 kg')
    .replace(/(^|[\s(])[-–—]\s*(\d+(?:[.,]\d+)?)\s*kg\b/gi, '$1Hasta $2 kg')
    .replace(/\bhasta\s+(\d+(?:[.,]\d+)?)\s*kg\b/gi, 'Hasta $1 kg')
    .replace(/(\d)\s*kg\b/gi, '$1 kg')
    .replace(/\s+/g, ' ').trim();
  return r || n;
}
function derivarNombreRonda(fase) {
  let t = limpiar(fase.replace(RE_SEX_ALL, '$1 '));
  // palabras repetidas consecutivas («Individual Individual General» -> «Individual General»)
  t = t.replace(/\b([A-Za-zÁÉÍÓÚáéíóúñ]+)\s+\1\b/gi, '$1');
  const m = RE_RONDA.exec(t);
  let nombre = t, ronda = '';
  if (m) {
    const idx = m.index + m[1].length;
    if (idx > 0) { nombre = limpiar(t.slice(0, idx)); ronda = limpiar(t.slice(idx)); }
  }
  if (!nombre) { nombre = t; ronda = ''; }
  return { nombre: nombreLegible(nombre), ronda };
}

/* ---------- marcas ---------- */
const TIEMPO = new Set(['AGU_ABI', 'NAT', 'SSK', 'CRD', 'CTR', 'BMX', 'CSL', 'CSP', 'SUP', 'REM', 'RCB', 'TRI', 'MTB', 'ESQ_NAU_T', 'ESC']);
const PUNTOS = new Set(['GAR', 'GRY', 'GTR', 'DIV', 'ASK', 'SWA', 'SKA', 'BMF', 'TIR_ARC', 'TIR_DEP', 'BOW', 'GOL', 'EDR', 'EVE', 'EJP', 'PEN_MOD', 'ESPORTS']);
function tipoMarca(sport, nombre, fase) {
  if (sport === 'LEV_PES') return 'kg';
  if (sport === 'ATL') {
    if (/salto|lanzamiento|impulsi|jabalina|disco|martillo|bala/i.test(nombre + ' ' + fase)) return 'm';
    if (/decatl|heptatl|pentatl/i.test(nombre)) return 'pts';
    return 's';
  }
  if (TIEMPO.has(sport)) return 's';
  if (PUNTOS.has(sport)) return 'pts';
  return '';
}
function formatearMarca(raw, tipo) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (s === '' || /^0+([.,]0+)?$/.test(s)) return null;
  if (!/^\d+([.:]\d+)*$/.test(s)) return s; // RET, WD, '000S2', '2.50/58/11.25': se conserva crudo
  const c = s.replace(/\./g, ',').replace(/(\d):(\d)/g, '$1:$2');
  const t = /:/.test(s) ? '' : tipo; // m:ss ya es tiempo: sin unidad
  const u = { s: ' s', m: ' m', kg: ' kg', pts: ' pts' }[t] || '';
  return c + u;
}

/* ---------- carga de resultados ---------- */
const nomDeporte = {};
ev.sports.forEach((s) => { nomDeporte[s.code] = s.name; });
const codDeporte = {};
ev.sports.forEach((s) => { codDeporte[strip(s.name)] = s.code; });

const dayFiles = fs.readdirSync(DIR).filter((f) => /^day-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
const pruebas = [];
const resIds = new Set();
const idsUsados = {};
const fechasConArchivo = [];
const truncados = {};
const sexoFallos = [];
const sexoViaId = [];
let dupRenombrados = 0;
let sinFilasN = 0;

const MEDAL = { 1: 'Oro', 2: 'Plata', 3: 'Bronce' };
// Parejas «A/B»: cada integrante se normaliza por separado (junto salía «Evaldo/tuchtenhagen Piedro BECKER»).
const normN = (n) => (/\//.test(n || '') ? String(n).split('/').map((x) => normalizarNombre(x)).join(' / ') : normalizarNombre(n));

function nuevoId(id) {
  if (!idsUsados[id]) { idsUsados[id] = 1; return id; }
  idsUsados[id]++; dupRenombrados++;
  return id + '~' + idsUsados[id];
}
function ganadorDeScore(score, medal) {
  if (medal === 1 || medal === 3) return 'a'; // summary = home y ganó
  if (medal === 2) return 'b';
  const m = /^\s*(\d+)\s*[–-]\s*(\d+)\s*$/.exec(score || '');
  if (m) { const a = +m[1], b = +m[2]; return a === b ? null : a > b ? 'a' : 'b'; }
  if (/^\s*W\s*[–-]\s*L\s*$/i.test(score || '')) return 'a';
  if (/^\s*L\s*[–-]\s*W\s*$/i.test(score || '')) return 'b';
  return null;
}

dayFiles.forEach((f) => {
  const fecha = f.slice(4, 14);
  const d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  fechasConArchivo.push(fecha);
  if (d.meta && d.meta.total > d.data.length) truncados[fecha] = { cargadas: d.data.length, total: d.meta.total };
  d.data.forEach((r) => {
    resIds.add(r.id);
    const sx = derivarSexo(r.phase, r.id);
    if (sx.via === 'fallo') sexoFallos.push(r.phase);
    if (sx.via === 'id') sexoViaId.push(r.phase);
    const nr = derivarNombreRonda(r.phase);
    const tm = tipoMarca(r.sport_code, nr.nombre, r.phase);
    const p = {
      id: nuevoId(r.id), deporte: r.sport_code, deporteNombre: r.sport || nomDeporte[r.sport_code] || r.sport_code,
      nombre: nr.nombre, fase: r.phase, ronda: nr.ronda, sexo: sx.sexo, sexoNombre: SEXO_NOMBRE[sx.sexo],
      fecha, estado: 'Finalizado', tipo: r.kind, tipoMarca: tm, filas: []
    };
    // Fase sin filas (GAR/VEL): Programado + sinResultado, como los días truncados; data.js ya lo degrada igual.
    const sinFilas = r.kind === 'ranking' && !((r.ranking && r.ranking.events[0] && r.ranking.events[0].entries) || []).length;
    if (sinFilas) {
      const sch = ev.schedule.find((s) => s.id === r.id);
      p.estado = 'Programado'; p.sinResultado = true; p.colombianos = []; p.participa = false;
      if (sch) { p.hora = sch.scheduled_at.slice(11, 16); if (sch.venue) p.escenario = sch.venue; }
      sinFilasN++; pruebas.push(p); return;
    }
    const sm = r.summary || {};
    if (r.kind === 'ranking') {
      const entries = (r.ranking && r.ranking.events[0] && r.ranking.events[0].entries) || [];
      // medallas: si la posición del deportista del summary == su medalla, la fase reparte medallas por puesto 1-3;
      // si no, solo se marca la del summary (no se inventan medallas).
      const se = entries.find((e) => e.delegation === sm.delegation && (e.country_code || null) === (sm.country_code || null));
      const porPuesto = !!(sm.medal && se && se.position === sm.medal);
      p.filas = entries.map((e) => {
        const pais = resolverPais(e.country_code, e.delegation);
        let medalla = null;
        if (porPuesto && e.position >= 1 && e.position <= 3) medalla = MEDAL[e.position];
        else if (sm.medal && e === se) medalla = MEDAL[sm.medal];
        return {
          puesto: e.position, deportista: normN(e.delegation), pais, paisNombre: paisNombre(pais),
          marca: formatearMarca(e.mark, tm), medalla
        };
      });
      p.colombianos = p.filas.filter((x) => x.pais === 'CO').map((x) => ({ puesto: x.puesto, deportista: x.deportista, marca: x.marca, medalla: x.medalla }));
      const co = p.filas.filter((x) => x.pais === 'CO').sort((a, b) => a.puesto - b.puesto)[0];
      const top = co || p.filas.slice().sort((a, b) => a.puesto - b.puesto)[0];
      p.resumen = top ? { deportista: top.deportista, pais: top.pais, marca: top.marca, medalla: top.medalla, colombiano: !!co }
        : { deportista: null, pais: null, marca: null, medalla: null, colombiano: false };
    } else {
      const h = r.match.home, a = r.match.away;
      const ph = resolverPais(h.country_code, h.name), pa = resolverPais(a.country_code, a.name);
      const g = ganadorDeScore(r.match.score, sm.medal);
      p.match = {
        a: { nombre: normN(h.name), pais: ph, paisNombre: paisNombre(ph) },
        b: { nombre: normN(a.name), pais: pa, paisNombre: paisNombre(pa) },
        marcador: r.match.score || '', ganador: g
      };
      // medalla del summary = del lado «a» (home); el rival: oro<->plata, el bronce no tiene perdedor con medalla
      const medA = sm.medal ? MEDAL[sm.medal] : null;
      const medB = sm.medal === 1 ? 'Plata' : sm.medal === 2 ? 'Oro' : null;
      p.colombianos = [];
      if (ph === 'CO') p.colombianos.push({ puesto: null, deportista: p.match.a.nombre, marca: null, medalla: medA });
      if (pa === 'CO') p.colombianos.push({ puesto: null, deportista: p.match.b.nombre, marca: null, medalla: medB });
      const coLado = ph === 'CO' ? 'a' : pa === 'CO' ? 'b' : null;
      const lado = coLado || g || 'a';
      p.resumen = {
        deportista: p.match[lado].nombre, pais: p.match[lado].pais,
        marca: p.match.marcador || null, medalla: lado === 'a' ? medA : medB, colombiano: !!coLado
      };
    }
    p.participa = p.colombianos.length > 0;
    pruebas.push(p);
  });
});

/* ---------- programadas (schedule sin resultado cargado) ---------- */
const sinResultadoPorDia = {};
ev.schedule.forEach((s) => {
  if (resIds.has(s.id)) return;
  const fecha = s.scheduled_at.slice(0, 10);
  const code = codDeporte[strip(s.sport)] || s.sport;
  const sx = derivarSexo(s.description, s.id);
  if (sx.via === 'fallo') sexoFallos.push(s.description + ' [prog]');
  if (sx.via === 'id') sexoViaId.push(s.description + ' [prog]');
  const nr = derivarNombreRonda(s.description);
  const esMatch = /combate|partido|match|@|\bvs\b/i.test(s.description);
  const conArchivo = fechasConArchivo.indexOf(fecha) >= 0;
  const p = {
    id: nuevoId(s.id), deporte: code, deporteNombre: s.sport, nombre: nr.nombre, fase: s.description, ronda: nr.ronda,
    sexo: sx.sexo, sexoNombre: SEXO_NOMBRE[sx.sexo], fecha, hora: s.scheduled_at.slice(11, 16), estado: 'Programado',
    tipo: esMatch ? 'match' : 'ranking', tipoMarca: tipoMarca(code, nr.nombre, s.description), filas: [],
    colombianos: [], participa: false
  };
  if (s.venue) p.escenario = s.venue;
  if (conArchivo) p.sinResultado = true; // día con resultados descargados pero esta fase no vino (truncado o sin resultado)
  sinResultadoPorDia[fecha] = (sinResultadoPorDia[fecha] || 0) + 1;
  pruebas.push(p);
});
pruebas.sort((a, b) => (a.fecha + (a.hora || '')).localeCompare(b.fecha + (b.hora || '')) || a.id.localeCompare(b.id));

/* ---------- medallero ---------- */
const mp = {};
pruebas.forEach((p) => {
  if (p.estado !== 'Finalizado') return;
  const cuenta = (pais, med) => {
    if (!med || !pais) return;
    const e = (mp[pais] = mp[pais] || { pais, paisNombre: paisNombre(pais), oro: 0, plata: 0, bronce: 0, total: 0 });
    if (med === 'Oro') e.oro++; else if (med === 'Plata') e.plata++; else e.bronce++;
    e.total++;
  };
  if (p.tipo === 'ranking') p.filas.forEach((x) => cuenta(x.pais, x.medalla));
});
// matches: se recalcula desde los datos fuente del summary (home = summary)
dayFiles.forEach((f) => {
  JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')).data.forEach((r) => {
    if (r.kind !== 'match' || !r.summary || !r.summary.medal) return;
    const h = resolverPais(r.match.home.country_code, r.match.home.name), a = resolverPais(r.match.away.country_code, r.match.away.name);
    const add = (pais, med) => {
      if (!pais || !med) return;
      const e = (mp[pais] = mp[pais] || { pais, paisNombre: paisNombre(pais), oro: 0, plata: 0, bronce: 0, total: 0 });
      if (med === 1) e.oro++; else if (med === 2) e.plata++; else e.bronce++;
      e.total++;
    };
    add(h, r.summary.medal);
    add(a, r.summary.medal === 1 ? 2 : r.summary.medal === 2 ? 1 : 0);
  });
});
const medallero = Object.values(mp).sort((a, b) => b.oro - a.oro || b.plata - a.plata || b.bronce - a.bronce);

const oficial = { oro: ev.medal_summary.gold, plata: ev.medal_summary.silver, bronce: ev.medal_summary.bronze };
const medallasColombiaPorDeporte = ev.medals_by_sport.map((m) => ({
  deporte: m.sport_code, deporteNombre: m.sport, participantes: m.participants,
  oro: m.gold, plata: m.silver, bronce: m.bronze, total: m.total, estado: m.status
}));
const suma = medallasColombiaPorDeporte.reduce((a, m) => ({ oro: a.oro + m.oro, plata: a.plata + m.plata, bronce: a.bronce + m.bronce }), { oro: 0, plata: 0, bronce: 0 });
const cuadra = suma.oro === oficial.oro && suma.plata === oficial.plata && suma.bronce === oficial.bronce;

const paisesUsados = new Set();
pruebas.forEach((p) => {
  p.filas.forEach((x) => x.pais && paisesUsados.add(x.pais));
  if (p.match) { if (p.match.a.pais) paisesUsados.add(p.match.a.pais); if (p.match.b.pais) paisesUsados.add(p.match.b.pais); }
});

const OLC_REAL = {
  evento: {
    code: 'suramericanos-sante-fe-2026', nombre: ev.name,
    descripcion: 'Juegos Suramericanos Santa Fe 2026: ' + ev.sports.length + ' deportes y ' + ev.facts.athletes_count + ' atletas colombianos (descripción derivada: el fixture no trae texto).',
    inicio: '2026-09-13', fin: '2026-09-26', lugar: ev.facts.venue_city || 'Santa Fe',
    organismo: 'ODESUR', // NO viene en el fixture: valor asumido
    alcance: 'INTERNACIONAL', paises: paisesUsados.size, sedes: [], ciclo: true,
    facts: { athletes_count: ev.facts.athletes_count, sports_count: ev.sports.length, disciplines_count: ev.facts.disciplines_count, start_date: ev.facts.start_date, end_date: ev.facts.end_date, venue_city: ev.facts.venue_city },
    externalCode: ev.external_code, slug: ev.slug
  },
  deportes: ev.sports.map((s) => ({ codigo: s.code, nombre: s.name, detalle: s.detail })),
  dias: ev.schedule_days.map((d) => d.date),
  pruebas,
  medallero,
  medalleroFuente: 'Sumado de filas con medalla en ' + fechasConArchivo.length + ' de ' + ev.schedule_days.length + ' jornadas descargadas (' + fechasConArchivo.join(', ') + '); NO cuadra con el oficial (medal_summary es solo Colombia). Las filas solo traen medalla del deportista del summary; el resto se infiere por puesto 1-3 cuando es consistente.',
  medallasColombiaPorDeporte,
  colombia: { oro: oficial.oro, plata: oficial.plata, bronce: oficial.bronce, total: oficial.oro + oficial.plata + oficial.bronce, atletas: ev.facts.athletes_count },
  resultsDays: ev.results_days.map((d) => ({ date: d.date, hasResults: d.has_results, cargado: fechasConArchivo.indexOf(d.date) >= 0 })),
  paisesNombres: PAISES
};
const out = 'window.OLC_REAL = ' + JSON.stringify(OLC_REAL) + ';\nwindow.OLC_REAL.normalizarNombre = ' + normalizarNombre.toString() + ';\n';
fs.writeFileSync(path.join(DIR, 'model.js'), out);

/* ---------- reporte ---------- */
const fin = pruebas.filter((p) => p.estado === 'Finalizado');
const porDia = {};
pruebas.forEach((p) => { const k = p.fecha; porDia[k] = porDia[k] || { fin: 0, prog: 0 }; porDia[k][p.estado === 'Finalizado' ? 'fin' : 'prog']++; });
console.log('model.js', (out.length / 1024 / 1024).toFixed(2) + ' MB');
console.log('pruebas total', pruebas.length, '| finalizadas', fin.length, '| programadas', pruebas.length - fin.length, '| ids duplicados renombrados', dupRenombrados);
console.log('por dia', JSON.stringify(porDia));
console.log('ranking', fin.filter((p) => p.tipo === 'ranking').length, 'match', fin.filter((p) => p.tipo === 'match').length, '| con colombianos', fin.filter((p) => p.participa).length);
console.log('fases sin filas -> Programado/sinResultado', sinFilasN);
console.log('truncados', JSON.stringify(truncados), '| programadas en dias con archivo (sinResultado)', JSON.stringify(sinResultadoPorDia));
console.log('sexo: fallos', sexoFallos.length, JSON.stringify(sexoFallos.slice(0, 20)), '| derivado por id', sexoViaId.length, JSON.stringify(sexoViaId.slice(0, 10)));
console.log('medals_by_sport suma', JSON.stringify(suma), 'oficial', JSON.stringify(oficial), cuadra ? 'CUADRA' : 'NO CUADRA');
console.log('medallero filas (top5)', JSON.stringify(medallero.slice(0, 5)));
console.log('paises', [...paisesUsados].join(','));
