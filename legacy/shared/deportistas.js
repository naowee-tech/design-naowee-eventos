/* ═══════════════════════════════════════════════════════════════
   NAOWEE EVENTOS — Catálogo de deportistas (fuente única)
   Lo consumen el directorio (perfil.html) y el detalle (perfil-detalle.html).
   Cada atleta tiene su trazabilidad (inscripciones · resultados · medallería)
   y un bloque `x` con los datos del perfil ampliado (biometría, ubicación, etc.).
   `buildAtletaDetalle(d)` mapea un atleta al shape que consume el detalle v2.
   ═══════════════════════════════════════════════════════════════ */

export const DEPORTISTAS = [
  {
    id: 'd1', nombre: 'Valentina Ríos', doc: 'CC 1.032.987.456', sexo: 'F',
    avatar: 'VR', deporte: '🏊 Natación', tier: 'olimpico',
    club: 'Club Aqua Valle', liga: 'Liga de Natación del Valle', federacion: 'Fedecua',
    x: { nac: '14 mar 1998', edad: 28, sangre: 'O+', alt: 168, peso: 61, ciudad: 'Cali', depto: 'Valle del Cauca' },
    inscripciones: [
      { evento: 'Copa Nacional de Natación 2025', deporte: 'Natación', prueba: '100m Libre', fecha: '2025-03-14', estado: 'finalizado' },
      { evento: 'Juegos Regionales Valle 2025', deporte: 'Natación', prueba: '200m Estilo', fecha: '2025-07-10', estado: 'finalizado' },
      { evento: 'Copa Colombia Deportes Acuáticos 2026', deporte: 'Natación', prueba: '100m Libre', fecha: '2026-02-20', estado: 'activo' }
    ],
    resultados: [
      { evento: 'Copa Nacional de Natación 2025', prueba: '100m Libre', ranking: 2, fecha: '2025-03-14' },
      { evento: 'Juegos Regionales Valle 2025', prueba: '200m Estilo', ranking: 1, fecha: '2025-07-10' }
    ],
    medalleria: [
      { evento: 'Copa Nacional de Natación 2025', prueba: '100m Libre', medalla: 'Plata', fecha: '2025-03-14' },
      { evento: 'Juegos Regionales Valle 2025', prueba: '200m Estilo', medalla: 'Oro', fecha: '2025-07-10' }
    ]
  },
  {
    id: 'd2', nombre: 'Andrés Mora', doc: 'CC 79.654.231', sexo: 'M',
    avatar: 'AM', deporte: '⚽ Fútbol', tier: 'profesional',
    club: 'Deportivo Cali Amateur', liga: 'Liga de Fútbol del Valle', federacion: 'Difútbol',
    x: { nac: '03 jun 1996', edad: 29, sangre: 'A+', alt: 178, peso: 74, ciudad: 'Cali', depto: 'Valle del Cauca' },
    inscripciones: [
      { evento: 'Campeonato Departamental de Fútbol 2025', deporte: 'Fútbol', prueba: 'Fútbol 11', fecha: '2025-04-05', estado: 'finalizado' },
      { evento: 'Festival Deportivo SUID 2026', deporte: 'Fútbol', prueba: 'Fútbol 11', fecha: '2026-05-15', estado: 'activo' }
    ],
    resultados: [{ evento: 'Campeonato Departamental de Fútbol 2025', prueba: 'Fútbol 11', ranking: 3, fecha: '2025-04-05' }],
    medalleria: [{ evento: 'Campeonato Departamental de Fútbol 2025', prueba: 'Fútbol 11', medalla: 'Bronce', fecha: '2025-04-05' }]
  },
  {
    id: 'd3', nombre: 'Sofía Castro', doc: 'CC 1.040.112.882', sexo: 'F',
    avatar: 'SC', deporte: '🤸 Atletismo', tier: 'olimpico',
    club: 'Club Atletismo Valle', liga: 'Liga Atletismo Antioquia', federacion: 'Fedeatletas',
    x: { nac: '21 sep 1999', edad: 26, sangre: 'O-', alt: 171, peso: 58, ciudad: 'Medellín', depto: 'Antioquia' },
    inscripciones: [
      { evento: 'Copa Nacional de Atletismo Indoor 2025', deporte: 'Atletismo', prueba: '100m planos', fecha: '2025-08-22', estado: 'finalizado' },
      { evento: 'Copa Nacional de Atletismo Indoor 2025', deporte: 'Atletismo', prueba: '200m planos', fecha: '2025-08-22', estado: 'finalizado' }
    ],
    resultados: [
      { evento: 'Copa Nacional de Atletismo Indoor 2025', prueba: '100m planos', ranking: 1, fecha: '2025-08-22' },
      { evento: 'Copa Nacional de Atletismo Indoor 2025', prueba: '200m planos', ranking: 4, fecha: '2025-08-22' }
    ],
    medalleria: [{ evento: 'Copa Nacional de Atletismo Indoor 2025', prueba: '100m planos', medalla: 'Oro', fecha: '2025-08-22' }]
  },
  {
    id: 'd4', nombre: 'Carlos Jiménez', doc: 'CC 94.221.003', sexo: 'M',
    avatar: 'CJ', deporte: '🏀 Baloncesto', tier: 'juvenil',
    club: 'Club Baloncesto Bogotá', liga: 'Liga de Baloncesto de Cundinamarca', federacion: 'Fecoba',
    x: { nac: '10 feb 2007', edad: 19, sangre: 'B+', alt: 192, peso: 82, ciudad: 'Bogotá', depto: 'Cundinamarca' },
    inscripciones: [
      { evento: 'Copa Colombia Deportes Acuáticos 2026', deporte: 'Baloncesto', prueba: 'Baloncesto 5×5', fecha: '2026-02-20', estado: 'activo' },
      { evento: 'Festival Deportivo SUID 2026', deporte: 'Baloncesto', prueba: 'Baloncesto 5×5', fecha: '2026-05-15', estado: 'activo' }
    ],
    resultados: [], medalleria: []
  },
  {
    id: 'd5', nombre: 'María Gómez', doc: 'CC 52.112.776', sexo: 'F',
    avatar: 'MG', deporte: '🥋 Judo', tier: 'profesional',
    club: 'Dojo Pacífico', liga: 'Liga Colombiana de Judo', federacion: 'Fedjudo',
    x: { nac: '17 nov 1995', edad: 30, sangre: 'A+', alt: 162, peso: 57, ciudad: 'Buenaventura', depto: 'Valle del Cauca' },
    inscripciones: [{ evento: 'Juegos Regionales Valle 2025', deporte: 'Judo', prueba: 'Judo −57kg (F)', fecha: '2025-07-10', estado: 'finalizado' }],
    resultados: [{ evento: 'Juegos Regionales Valle 2025', prueba: 'Judo −57kg (F)', ranking: 1, fecha: '2025-07-10' }],
    medalleria: [{ evento: 'Juegos Regionales Valle 2025', prueba: 'Judo −57kg (F)', medalla: 'Oro', fecha: '2025-07-10' }]
  },
  {
    id: 'd6', nombre: 'Pedro Suárez', doc: 'CC 79.003.445', sexo: 'M',
    avatar: 'PS', deporte: '🏊 Natación', tier: 'amateur',
    club: 'Club Aqua Valle', liga: 'Liga de Natación del Valle', federacion: 'Fedecua',
    x: { nac: '29 jul 1992', edad: 33, sangre: 'O+', alt: 175, peso: 70, ciudad: 'Cali', depto: 'Valle del Cauca' },
    inscripciones: [
      { evento: 'Copa Nacional de Natación 2025', deporte: 'Natación', prueba: '50m Libre', fecha: '2025-03-14', estado: 'finalizado' },
      { evento: 'Copa Colombia Deportes Acuáticos 2026', deporte: 'Natación', prueba: '100m Libre', fecha: '2026-02-20', estado: 'activo' }
    ],
    resultados: [{ evento: 'Copa Nacional de Natación 2025', prueba: '50m Libre', ranking: 5, fecha: '2025-03-14' }],
    medalleria: []
  },
  {
    id: 'd7', nombre: 'Laura Martínez', doc: 'CC 1.053.778.112', sexo: 'F',
    avatar: 'LM', deporte: '🏐 Voleibol', tier: 'profesional',
    club: 'Club Volcanes Medellín', liga: 'Liga de Voleibol de Antioquia', federacion: 'Fedevol',
    x: { nac: '08 abr 1997', edad: 28, sangre: 'AB+', alt: 180, peso: 68, ciudad: 'Medellín', depto: 'Antioquia' },
    inscripciones: [
      { evento: 'Campeonato Nacional de Voleibol 2025', deporte: 'Voleibol', prueba: 'Voleibol Femenino', fecha: '2025-06-12', estado: 'finalizado' },
      { evento: 'Copa Interclubes 2026', deporte: 'Voleibol', prueba: 'Voleibol Femenino', fecha: '2026-03-18', estado: 'activo' }
    ],
    resultados: [{ evento: 'Campeonato Nacional de Voleibol 2025', prueba: 'Voleibol Femenino', ranking: 2, fecha: '2025-06-12' }],
    medalleria: [{ evento: 'Campeonato Nacional de Voleibol 2025', prueba: 'Voleibol Femenino', medalla: 'Plata', fecha: '2025-06-12' }]
  },
  {
    id: 'd8', nombre: 'Juan Pablo Torres', doc: 'CC 1.018.455.302', sexo: 'M',
    avatar: 'JT', deporte: '🚴 Ciclismo', tier: 'olimpico',
    club: 'Team Ciclismo Cundinamarca', liga: 'Liga Ciclismo Cundinamarca', federacion: 'Fedeciclismo',
    x: { nac: '12 ene 2002', edad: 24, sangre: 'O+', alt: 176, peso: 66, ciudad: 'Bogotá', depto: 'Cundinamarca' },
    inscripciones: [{ evento: 'Vuelta a Colombia Sub-23 2025', deporte: 'Ciclismo', prueba: 'Ruta Individual', fecha: '2025-05-20', estado: 'finalizado' }],
    resultados: [{ evento: 'Vuelta a Colombia Sub-23 2025', prueba: 'Ruta Individual', ranking: 1, fecha: '2025-05-20' }],
    medalleria: [{ evento: 'Vuelta a Colombia Sub-23 2025', prueba: 'Ruta Individual', medalla: 'Oro', fecha: '2025-05-20' }]
  },
  {
    id: 'd9', nombre: 'Camila Herrera', doc: 'CC 1.061.890.445', sexo: 'F',
    avatar: 'CH', deporte: '🏋️ Levantamiento de Pesas', tier: 'juvenil',
    club: 'Club Halterofilia Cali', liga: 'Liga Halterofilia del Valle', federacion: 'Fedehalterofilia',
    x: { nac: '25 mar 2006', edad: 19, sangre: 'A-', alt: 158, peso: 59, ciudad: 'Cali', depto: 'Valle del Cauca' },
    inscripciones: [
      { evento: 'Campeonato Juvenil de Halterofilia 2025', deporte: 'Levantamiento de Pesas', prueba: '59kg (F)', fecha: '2025-09-15', estado: 'finalizado' },
      { evento: 'Juegos Nacionales Juveniles 2026', deporte: 'Levantamiento de Pesas', prueba: '59kg (F)', fecha: '2026-04-10', estado: 'activo' }
    ],
    resultados: [{ evento: 'Campeonato Juvenil de Halterofilia 2025', prueba: '59kg (F)', ranking: 3, fecha: '2025-09-15' }],
    medalleria: [{ evento: 'Campeonato Juvenil de Halterofilia 2025', prueba: '59kg (F)', medalla: 'Bronce', fecha: '2025-09-15' }]
  },
  {
    id: 'd10', nombre: 'Sebastián Vargas', doc: 'CC 1.007.221.834', sexo: 'M',
    avatar: 'SV', deporte: '🥋 Taekwondo', tier: 'profesional',
    club: 'Dojang Bogotá', liga: 'Liga Taekwondo Bogotá', federacion: 'Fedataekwondo',
    x: { nac: '06 oct 1994', edad: 31, sangre: 'B+', alt: 182, peso: 80, ciudad: 'Bogotá', depto: 'Cundinamarca' },
    inscripciones: [{ evento: 'Open Nacional de Taekwondo 2025', deporte: 'Taekwondo', prueba: '80kg (M)', fecha: '2025-10-04', estado: 'finalizado' }],
    resultados: [{ evento: 'Open Nacional de Taekwondo 2025', prueba: '80kg (M)', ranking: 1, fecha: '2025-10-04' }],
    medalleria: [{ evento: 'Open Nacional de Taekwondo 2025', prueba: '80kg (M)', medalla: 'Oro', fecha: '2025-10-04' }]
  },
  {
    id: 'd11', nombre: 'Daniela Ospina', doc: 'CC 1.036.654.991', sexo: 'F',
    avatar: 'DO', deporte: '🤸 Atletismo', tier: 'amateur',
    club: 'Club Atletismo Medellín', liga: 'Liga Atletismo Antioquia', federacion: 'Fedeatletas',
    x: { nac: '19 dic 2000', edad: 25, sangre: 'O+', alt: 169, peso: 60, ciudad: 'Medellín', depto: 'Antioquia' },
    inscripciones: [{ evento: 'Copa Departamental Antioquia 2026', deporte: 'Atletismo', prueba: '400m planos', fecha: '2026-01-25', estado: 'activo' }],
    resultados: [], medalleria: []
  },
  {
    id: 'd12', nombre: 'Miguel Ángel Reyes', doc: 'CC 80.445.123', sexo: 'M',
    avatar: 'MR', deporte: '⚽ Fútbol', tier: 'amateur',
    club: 'Club Unión Barranquilla', liga: 'Liga de Fútbol del Atlántico', federacion: 'Difútbol',
    x: { nac: '02 may 1993', edad: 32, sangre: 'A+', alt: 174, peso: 72, ciudad: 'Barranquilla', depto: 'Atlántico' },
    inscripciones: [{ evento: 'Festival Deportivo SUID 2026', deporte: 'Fútbol', prueba: 'Fútbol 11', fecha: '2026-05-15', estado: 'activo' }],
    resultados: [], medalleria: []
  },
  {
    id: 'd13', nombre: 'Natalia Cárdenas', doc: 'CC 1.022.381.567', sexo: 'F',
    avatar: 'NC', deporte: '🏀 Baloncesto', tier: 'juvenil',
    club: 'Club Baloncesto Pereira', liga: 'Liga Baloncesto Risaralda', federacion: 'Fecoba',
    x: { nac: '14 ago 2006', edad: 19, sangre: 'O-', alt: 184, peso: 70, ciudad: 'Pereira', depto: 'Risaralda' },
    inscripciones: [
      { evento: 'Campeonato Juvenil Baloncesto 2025', deporte: 'Baloncesto', prueba: 'Baloncesto 5×5 (F)', fecha: '2025-11-08', estado: 'finalizado' },
      { evento: 'Festival Deportivo SUID 2026', deporte: 'Baloncesto', prueba: 'Baloncesto 5×5 (F)', fecha: '2026-05-15', estado: 'activo' }
    ],
    resultados: [{ evento: 'Campeonato Juvenil Baloncesto 2025', prueba: 'Baloncesto 5×5 (F)', ranking: 2, fecha: '2025-11-08' }],
    medalleria: [{ evento: 'Campeonato Juvenil Baloncesto 2025', prueba: 'Baloncesto 5×5 (F)', medalla: 'Plata', fecha: '2025-11-08' }]
  },
  {
    id: 'd14', nombre: 'Cristian Rojas', doc: 'CC 1.045.992.037', sexo: 'M',
    avatar: 'CR', deporte: '🚴 Ciclismo', tier: 'juvenil',
    club: 'Team Ciclismo Boyacá', liga: 'Liga Ciclismo Boyacá', federacion: 'Fedeciclismo',
    x: { nac: '27 feb 2005', edad: 21, sangre: 'B+', alt: 173, peso: 63, ciudad: 'Tunja', depto: 'Boyacá' },
    inscripciones: [{ evento: 'Clásico de Boyacá Sub-23 2025', deporte: 'Ciclismo', prueba: 'Contrarreloj Individual', fecha: '2025-08-30', estado: 'finalizado' }],
    resultados: [{ evento: 'Clásico de Boyacá Sub-23 2025', prueba: 'Contrarreloj Individual', ranking: 4, fecha: '2025-08-30' }],
    medalleria: []
  }
];

export function getDeportista(id) {
  return DEPORTISTAS.find((d) => d.id === id) || DEPORTISTAS[0];
}

/* ─── Mapea un atleta del catálogo al shape que consume el detalle v2 ─── */
const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const TIER_LABEL = { olimpico: 'Olímpico', profesional: 'Profesional', juvenil: 'Juvenil', amateur: 'Amateur' };

function slugCorreo(n, a) {
  return `${n}.${a}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z.]/g, '');
}
function fmtFecha(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return iso || '';
  return `${m[3]} ${MESES[+m[2] - 1]} ${m[1]}`;
}
function anio(iso) { const m = /(\d{4})/.exec(iso || ''); return m ? m[1] : (iso || ''); }

export function buildAtletaDetalle(d) {
  const w = d.nombre.trim().split(/\s+/);
  let nombre = w[0] || '', segundoNombre = '', apellido = '', segundoApellido = '';
  if (w.length >= 4) { segundoNombre = w[1]; apellido = w[2]; segundoApellido = w.slice(3).join(' '); }
  else if (w.length === 3) { segundoNombre = w[1]; apellido = w[2]; }
  else { apellido = w.slice(1).join(' '); }

  const tipo = d.doc.startsWith('CC') ? 'Cédula de ciudadanía' : 'Documento de identidad';
  const numero = d.doc.replace(/^[A-Za-z]+\s*/, '');
  const dm = /^(\S+)\s+(.*)$/.exec(d.deporte) || [];
  const deporteEmoji = dm[1] || '🏅', deporte = dm[2] || d.deporte;
  const x = d.x || {};
  const imc = (x.alt && x.peso) ? (x.peso / Math.pow(x.alt / 100, 2)).toFixed(1) : '—';
  const compl = Math.min(96, 64 + d.medalleria.length * 9 + d.inscripciones.length * 4);
  const slug = slugCorreo(nombre, apellido);
  const oros = d.medalleria.filter((m) => m.medalla === 'Oro').length;

  return {
    nombre, segundoNombre, apellido, segundoApellido,
    avatar: d.avatar, tier: d.tier, tierLabel: TIER_LABEL[d.tier],
    deporteEmoji, deporte,
    doc: { tipo, numero },
    nacimiento: x.nac || '—', edad: x.edad || '—',
    sexo: d.sexo === 'F' ? 'Femenino' : 'Masculino',
    genero: d.sexo === 'F' ? 'Femenino' : 'Masculino',
    sangre: x.sangre || '—',
    nacionalidad: { pais: 'Colombia', iso: 'co' },
    club: d.club, liga: d.liga, federacion: d.federacion,
    manoHabil: 'Derecha', aniosPractica: x.edad ? Math.max(2, x.edad - 12) : '—',
    ubicacion: { depto: x.depto || '—', municipio: x.ciudad || '—', zona: 'Urbana', barrio: 'Centro', direccion: 'Por definir' },
    contacto: {
      correo: `${slug}@correo.com`,
      telefono: `+57 31${d.id.replace(/\D/g, '')} 555 0${(100 + d.medalleria.length * 7).toString().slice(-3)}`,
      emergenciaNombre: 'Contacto familiar',
      emergenciaTel: '+57 320 555 0142'
    },
    biometria: { altura: (x.alt || '—') + ' cm', peso: (x.peso || '—') + ' kg', sangre: x.sangre || '—', imc },
    completitud: compl,
    documentos: [
      { nombre: 'Cédula de ciudadanía', sub: 'Verificada', estado: 'verificado', subido: true },
      { nombre: 'Certificado médico deportivo', sub: 'Vigente', estado: 'vigente', subido: true },
      { nombre: 'Afiliación EPS', sub: 'Documento requerido — aún no lo has subido', estado: 'requerido', subido: false },
      { nombre: 'Consentimiento de tratamiento de datos', sub: 'Falta firmar', estado: 'pendiente', subido: true }
    ],
    inscripciones: d.inscripciones.map((e) => ({ evento: e.evento, prueba: e.prueba, fecha: fmtFecha(e.fecha), estado: e.estado })),
    resultados: d.resultados.map((r) => ({ evento: r.evento, prueba: r.prueba, ranking: r.ranking, fecha: anio(r.fecha) })),
    medalleria: d.medalleria.map((m) => ({ evento: m.evento, prueba: m.prueba, medalla: m.medalla, fecha: anio(m.fecha) }))
  };
}
