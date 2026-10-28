/* ═══════════════════════════════════════════════════════════════
   NAOWEE EVENTOS — Catálogo de deportes (cascada para "Crear evento")
   Subconjunto realista de la hoja `Listas` de las plantillas oficiales
   (EVENTOS-PLANTILLAS-CATALOGOS.md). Estructura:
     tipo de deporte → deporte → pruebas[]
   + catálogos planos: categoría, modalidad.
   Solo los deportes con pruebas más representativas (no las 221 pruebas
   ni los 1055 municipios — esto es el form de asociación, no el cargue).
   Fuente de valores: hoja `Listas` (Conjunto / Individual / Paradeporte).
   ═══════════════════════════════════════════════════════════════ */

/* Catálogos planos (hoja Listas — exactos). */
export const CATEGORIAS = ['Pre Infantil', 'Infantil', 'Pre Juvenil', 'Juvenil', 'Iniciación', 'Unica'];
export const MODALIDADES = ['INDIVIDUAL', 'DOBLES'];

/* tipo de deporte → deporte → pruebas
   `tipo` usa los 3 valores del catálogo `tipo de deporte`.
   `emoji` es decorativo (identificador de disciplina, paridad dashboard).
   `pruebas` = subconjunto realista del catálogo `prueba` por deporte. */
export const TIPOS_DEPORTE = ['Individual', 'Conjunto', 'Paradeporte'];

export const DEPORTES_POR_TIPO = {
  Individual: [
    {
      id: 'atletismo', label: 'Atletismo', emoji: '🏃',
      pruebas: ['100 MTS PLANOS', '200 MTRS PLANOS', '400 MTRS PLANOS', '800 MTRS PLANOS',
                '1500 MTRS PLANOS', '110 MTS VALLAS', '400 MTS VALLAS', 'SALTO LARGO',
                'SALTO ALTO', 'IMPULSO DE BALA', 'LANZAMIENTO DE JABALINA', 'RELEVO 4X100']
    },
    {
      id: 'natacion', label: 'Natación', emoji: '🏊',
      pruebas: ['50 MTS LIBRE', '100 MTS LIBRE', '200 MTS LIBRE', '50 MTS ESPALDA',
                '100 MTS ESPALDA', '50 MTS PECHO', '100 MTS PECHO', '50 MTS MARIPOSA',
                '100 MTS MARIPOSA', '200 MTS COMBINADO', 'RELEVO 4X100 LIBRE']
    },
    {
      id: 'ciclismo-ruta', label: 'Ciclismo Ruta', emoji: '🚴',
      pruebas: ['RUTA INDIVIDUAL DE 50 A 60', 'CRI. 12 A 15 KM', 'VUELTA AL CIRCUITO - RUTA']
    },
    {
      id: 'patinaje', label: 'Patinaje', emoji: '⛸️',
      pruebas: ['300 MTS META CONTRA META - PISTA', '500 MTS + DISTANCIA', '1000 MTS SPRINT',
                '3000 MTS RELEVOS', 'CIRCUITO RUTA 200 MTS']
    },
    {
      id: 'levantamiento-pesas', label: 'Levantamiento de Pesas', emoji: '🏋️',
      pruebas: ['ARRANQUE', 'ENVIÓN', 'TOTAL OLÍMPICO']
    },
    {
      id: 'taekwondo', label: 'Taekwondo', emoji: '🥋',
      pruebas: ['COMBATE -54 KG', 'COMBATE -58 KG', 'COMBATE -63 KG', 'COMBATE -68 KG',
                'COMBATE -74 KG', 'POOMSAE INDIVIDUAL']
    },
    {
      id: 'judo', label: 'Judo', emoji: '🥋',
      pruebas: ['COMBATE -60 KG', 'COMBATE -66 KG', 'COMBATE -73 KG', 'COMBATE -81 KG',
                'COMBATE -90 KG']
    },
    {
      id: 'karate-do', label: 'Karate Do', emoji: '🥋',
      pruebas: ['KATA INDIVIDUAL', 'KUMITE -55 KG', 'KUMITE -61 KG', 'KUMITE -68 KG']
    },
    {
      id: 'boxeo', label: 'Boxeo', emoji: '🥊',
      pruebas: ['COMBATE -49 KG', 'COMBATE -52 KG', 'COMBATE -56 KG', 'COMBATE -60 KG',
                'COMBATE -64 KG']
    },
    {
      id: 'badminton', label: 'Bádminton', emoji: '🏸',
      pruebas: ['INDIVIDUAL', 'DOBLES', 'DOBLES MIXTO', 'EQUIPOS']
    },
    {
      id: 'tenis-mesa', label: 'Tenis de Mesa', emoji: '🏓',
      pruebas: ['INDIVIDUAL', 'DOBLES', 'EQUIPOS']
    },
    {
      id: 'ajedrez', label: 'Ajedrez Integrado', emoji: '♟️',
      pruebas: ['CLÁSICO', 'ACTIVO', 'BLITZ']
    }
  ],
  Conjunto: [
    { id: 'futbol', label: 'Fútbol', emoji: '⚽', pruebas: ['EQUIPOS'] },
    { id: 'futbol-sala', label: 'Fútbol Sala', emoji: '⚽', pruebas: ['EQUIPOS'] },
    { id: 'futbol-salon', label: 'Fútbol Salón', emoji: '⚽', pruebas: ['EQUIPOS'] },
    { id: 'baloncesto', label: 'Baloncesto', emoji: '🏀', pruebas: ['EQUIPOS'] },
    { id: 'baloncesto-3x3', label: 'Baloncesto 3X3', emoji: '🏀', pruebas: ['EQUIPOS'] },
    { id: 'voleibol', label: 'Voleibol', emoji: '🏐', pruebas: ['EQUIPOS'] },
    { id: 'balonmano', label: 'Balonmano', emoji: '🤾', pruebas: ['EQUIPOS'] }
  ],
  Paradeporte: [
    {
      id: 'para-atletismo', label: 'Para Atletismo', emoji: '🏃',
      pruebas: ['100 MTS PLANOS', '200 MTRS PLANOS', '400 MTRS PLANOS', 'SALTO LARGO',
                'IMPULSO DE BALA', 'LANZAMIENTO DE JABALINA']
    },
    {
      id: 'para-natacion', label: 'Para Natación', emoji: '🏊',
      pruebas: ['50 MTS LIBRE', '100 MTS LIBRE', '50 MTS ESPALDA', '50 MTS PECHO',
                '50 MTS MARIPOSA']
    },
    {
      id: 'boccia', label: 'Boccia', emoji: '🎯',
      pruebas: ['INDIVIDUAL', 'PAREJAS', 'EQUIPOS']
    }
  ]
};

/* ─── Catálogos de ORGANIZACIONES por tipo (para "Organizaciones invitadas"
   en la edición del evento). Cada liga/club lleva su `depto` (dato canónico,
   NO se parsea del nombre) para poder ACOTAR el catálogo a la(s) sede(s) del
   evento: si el evento es en Antioquia, solo se ofrecen ligas/clubes de
   Antioquia. Multi-sede → unión de los departamentos del evento. ─── */
export const LIGAS = [
  { nombre: 'Liga del Valle', depto: 'Valle del Cauca' },
  { nombre: 'Liga Antioqueña', depto: 'Antioquia' },
  { nombre: 'Liga de Bogotá', depto: 'Bogotá D.C.' },
  { nombre: 'Liga de Santander', depto: 'Santander' },
  { nombre: 'Liga de Cundinamarca', depto: 'Cundinamarca' },
  { nombre: 'Liga del Atlántico', depto: 'Atlántico' },
  { nombre: 'Liga de Risaralda', depto: 'Risaralda' },
  { nombre: 'Liga de Nariño', depto: 'Nariño' },
  { nombre: 'Liga del Cauca', depto: 'Cauca' },
  { nombre: 'Liga de Boyacá', depto: 'Boyacá' },
  { nombre: 'Liga de Caldas', depto: 'Caldas' },
  { nombre: 'Liga del Tolima', depto: 'Tolima' },
  { nombre: 'Liga de Bolívar', depto: 'Bolívar' },
  { nombre: 'Liga del Meta', depto: 'Meta' },
  { nombre: 'Liga de Córdoba', depto: 'Córdoba' },
  { nombre: 'Liga de Sucre', depto: 'Sucre' },
  { nombre: 'Liga del Huila', depto: 'Huila' },
  { nombre: 'Liga del Quindío', depto: 'Quindío' },
  { nombre: 'Liga del Magdalena', depto: 'Magdalena' },
  { nombre: 'Liga de Norte de Santander', depto: 'Norte de Santander' }
];
export const CLUBES = [
  { nombre: 'Club Deportivo Cali', depto: 'Valle del Cauca' },
  { nombre: 'Atlético Nacional', depto: 'Antioquia' },
  { nombre: 'Millonarios FC', depto: 'Bogotá D.C.' },
  { nombre: 'Independiente Santa Fe', depto: 'Bogotá D.C.' },
  { nombre: 'América de Cali', depto: 'Valle del Cauca' },
  { nombre: 'Junior FC', depto: 'Atlántico' },
  { nombre: 'Club Aqua Valle', depto: 'Valle del Cauca' },
  { nombre: 'Atlético Bucaramanga', depto: 'Santander' },
  { nombre: 'Deportivo Pereira', depto: 'Risaralda' },
  { nombre: 'Once Caldas', depto: 'Caldas' },
  { nombre: 'Club Los Andes', depto: 'Cundinamarca' },
  { nombre: 'Club Náutico de Bogotá', depto: 'Bogotá D.C.' },
  { nombre: 'Club Halcones de Barranquilla', depto: 'Atlántico' },
  { nombre: 'Club Cóndores de Nariño', depto: 'Nariño' },
  { nombre: 'Club Titanes de Córdoba', depto: 'Córdoba' },
  { nombre: 'Club Deportivo Popular', depto: 'Antioquia' },
  { nombre: 'Club Sporting Medellín', depto: 'Antioquia' },
  { nombre: 'Club Real Cartagena', depto: 'Bolívar' }
];

/* ─── Cascada Departamento → Municipio (hoja `Listas`: `departamento` 33 ·
   `municipio/localidad` 1055). Subconjunto representativo de municipios por
   depto (no los 1055). El "Lugar" guardado = "Municipio, Departamento". ─── */
export const DEPARTAMENTOS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar',
  'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
  'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada'
];

/* Municipios representativos por departamento (subconjunto). */
export const MUNICIPIOS_POR_DEPTO = {
  'Amazonas': ['Leticia', 'Puerto Nariño'],
  'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro', 'Apartadó'],
  'Arauca': ['Arauca', 'Saravena', 'Tame'],
  'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga'],
  'Bogotá D.C.': ['Bogotá D.C.'],
  'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'El Carmen de Bolívar'],
  'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá'],
  'Caldas': ['Manizales', 'La Dorada', 'Chinchiná', 'Villamaría'],
  'Caquetá': ['Florencia', 'San Vicente del Caguán'],
  'Casanare': ['Yopal', 'Aguazul', 'Villanueva'],
  'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada'],
  'Cesar': ['Valledupar', 'Aguachica', 'Codazzi'],
  'Chocó': ['Quibdó', 'Istmina', 'Tadó'],
  'Córdoba': ['Montería', 'Lorica', 'Cereté', 'Sahagún'],
  'Cundinamarca': ['Soacha', 'Facatativá', 'Zipaquirá', 'Girardot', 'Fusagasugá', 'Chía'],
  'Guainía': ['Inírida'],
  'Guaviare': ['San José del Guaviare'],
  'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata'],
  'La Guajira': ['Riohacha', 'Maicao', 'Uribia', 'Fonseca'],
  'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación'],
  'Meta': ['Villavicencio', 'Acacías', 'Granada'],
  'Nariño': ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario'],
  'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito'],
  'Quindío': ['Armenia', 'Calarcá', 'Montenegro', 'La Tebaida'],
  'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'],
  'San Andrés y Providencia': ['San Andrés', 'Providencia'],
  'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
  'Sucre': ['Sincelejo', 'Corozal', 'Sampués'],
  'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Buga'],
  'Vaupés': ['Mitú'],
  'Vichada': ['Puerto Carreño']
};

export function municipiosDeDepto(depto) {
  return MUNICIPIOS_POR_DEPTO[depto] || [];
}

/* ─── Scoping por sede del evento (multi-departamental) ───
   Todos aceptan un array de departamentos; con array vacío devuelven el
   catálogo completo (evento sin ubicación definida = sin acotar). */
export function ligasDeDeptos(deptos) {
  const set = new Set(deptos || []);
  return (set.size ? LIGAS.filter((l) => set.has(l.depto)) : LIGAS).map((l) => l.nombre);
}
export function clubesDeDeptos(deptos) {
  const set = new Set(deptos || []);
  return (set.size ? CLUBES.filter((c) => set.has(c.depto)) : CLUBES).map((c) => c.nombre);
}
export function municipiosDeDeptos(deptos) {
  if (!deptos || !deptos.length) {
    return [...new Set(Object.values(MUNICIPIOS_POR_DEPTO).flat())].sort((a, b) => a.localeCompare(b, 'es'));
  }
  const out = [];
  deptos.forEach((d) => municipiosDeDepto(d).forEach((m) => out.push(m)));
  return out;
}
/* Resolución inversa (para marcar organizaciones fuera del alcance geográfico). */
export function deptoDeLiga(nombre) { const l = LIGAS.find((x) => x.nombre === nombre); return l ? l.depto : ''; }
export function deptoDeClub(nombre) { const c = CLUBES.find((x) => x.nombre === nombre); return c ? c.depto : ''; }
export function deptoDeMunicipio(nombre) {
  for (const [d, list] of Object.entries(MUNICIPIOS_POR_DEPTO)) { if (list.includes(nombre)) return d; }
  return '';
}

/* Helpers de cascada. */
export function deportesDeTipo(tipo) {
  return DEPORTES_POR_TIPO[tipo] || [];
}
export function deportePorId(tipo, id) {
  return deportesDeTipo(tipo).find((d) => d.id === id) || null;
}
export function pruebasDeDeporte(tipo, id) {
  const d = deportePorId(tipo, id);
  return d ? d.pruebas : [];
}

/* Lista mock de gestores (asignación · §3). Iniciales precomputadas.
   `role` = rol que el perfil tiene HOY en la plataforma. `esGestor` marca
   si ya es gestor de eventos (si no, al asignarlo se le invita como tal). */
export const GESTORES = [
  { id: 'g-andrea', name: 'Andrea Salas',    role: 'Gestor de eventos',  area: 'Atletismo y natación',       avatar: 'AS', color: '#1f8923', esGestor: true },
  { id: 'g-julian', name: 'Julián Mosquera', role: 'Gestor de eventos',  area: 'Deportes de conjunto',       avatar: 'JM', color: '#1f78d1', esGestor: true },
  { id: 'g-paola',  name: 'Paola Cárdenas',  role: 'Gestor de eventos',  area: 'Combate y paradeporte',      avatar: 'PC', color: '#7c3aed', esGestor: true },
  { id: 'g-diego',  name: 'Diego Naranjo',   role: 'Gestor de eventos',  area: 'Ciclismo y patinaje',        avatar: 'DN', color: '#d74009', esGestor: true },
  { id: 'g-marcela', name: 'Marcela Rivas',  role: 'Gestor de eventos',  area: 'Multideporte · escolares',   avatar: 'MR', color: '#c0392b', esGestor: true }
];

/* Perfiles de la plataforma que un administrador puede asignar como gestor de
   un evento. NO todos son gestores hoy: al asignar a un Usuario del módulo (o
   un administrador) se le INVITA como gestor de ese evento. El campo `role`
   refleja el rol actual del perfil en la plataforma; `esGestor=false` dispara
   la nota de invitación en el formulario de creación. Superconjunto de
   GESTORES → cualquier id aquí resuelve en el detalle del evento. */
export const PERFILES_ASIGNABLES = [
  ...GESTORES,
  { id: 'u-laura',  name: 'Laura Méndez',          role: 'Usuario del módulo',        avatar: 'LM', color: '#1f78d1', esGestor: false },
  { id: 'u-miguel', name: 'Miguel Ángel Torres',   role: 'Usuario del módulo',        avatar: 'MT', color: '#1f8923', esGestor: false },
  { id: 'u-sofia',  name: 'Sofía Bermúdez',        role: 'Administrador de eventos',  avatar: 'SB', color: '#d74009', esGestor: false }
];
