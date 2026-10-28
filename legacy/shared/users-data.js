/* ═══════════════════════════════════════════════════════════════
   NAOWEE EVENTOS — Capa de datos de usuarios del módulo
   Patrón: sessionStorage CRUD (paridad IVC IVCStore).
   API: getUsers(), addUser(u), updateUser(id, patch), toggleUserStatus(id).
   ═══════════════════════════════════════════════════════════════ */

const USERS_KEY = 'naowee-eventos-users';

/* ─── Mock inicial ─── */
const MOCK_USERS = [
  {
    id: 'u-carlos',
    nombre: 'Carlos Restrepo',
    correo: 'carlos.restrepo@mindeporte.gov.co',
    rol: 'ADMIN',
    estado: 'activo',
    ultimoAcceso: '2026-06-03T08:14:00',
    avatar: 'CR',
    color: '#d74009'
  },
  {
    id: 'u-sofia',
    nombre: 'Sofía Bermúdez',
    correo: 'sofia.bermudez@mindeporte.gov.co',
    rol: 'ADMIN',
    estado: 'activo',
    ultimoAcceso: '2026-06-02T17:45:00',
    avatar: 'SB',
    color: '#d74009'
  },
  {
    id: 'u-andrea',
    nombre: 'Andrea Salas',
    correo: 'andrea.salas@mindeporte.gov.co',
    rol: 'GESTOR',
    estado: 'activo',
    ultimoAcceso: '2026-06-03T07:52:00',
    avatar: 'AS',
    color: '#1f8923'
  },
  {
    id: 'u-julian',
    nombre: 'Julián Mosquera',
    correo: 'julian.mosquera@mindeporte.gov.co',
    rol: 'GESTOR',
    estado: 'activo',
    ultimoAcceso: '2026-06-02T16:30:00',
    avatar: 'JM',
    color: '#1f78d1'
  },
  {
    id: 'u-paola',
    nombre: 'Paola Cárdenas',
    correo: 'paola.cardenas@mindeporte.gov.co',
    rol: 'GESTOR',
    estado: 'activo',
    ultimoAcceso: '2026-06-01T14:20:00',
    avatar: 'PC',
    color: '#7c3aed'
  },
  {
    id: 'u-diego',
    nombre: 'Diego Naranjo',
    correo: 'diego.naranjo@mindeporte.gov.co',
    rol: 'GESTOR',
    estado: 'pendiente',
    ultimoAcceso: null,
    avatar: 'DN',
    color: '#d74009'
  },
  {
    id: 'u-marcela',
    nombre: 'Marcela Rivas',
    correo: 'marcela.rivas@mindeporte.gov.co',
    rol: 'GESTOR',
    estado: 'pendiente',
    ultimoAcceso: null,
    avatar: 'MR',
    color: '#c0392b'
  },
  {
    id: 'u-laura',
    nombre: 'Laura Méndez',
    correo: 'laura.mendez@mindeporte.gov.co',
    rol: 'USER',
    estado: 'activo',
    ultimoAcceso: '2026-06-03T09:01:00',
    avatar: 'LM',
    color: '#1f78d1'
  },
  {
    id: 'u-miguel',
    nombre: 'Miguel Ángel Torres',
    correo: 'miguel.torres@mindeporte.gov.co',
    rol: 'USER',
    estado: 'activo',
    ultimoAcceso: '2026-05-30T11:15:00',
    avatar: 'MT',
    color: '#1f8923'
  },
  {
    id: 'u-natalia',
    nombre: 'Natalia Gómez',
    correo: 'natalia.gomez@mindeporte.gov.co',
    rol: 'USER',
    estado: 'inactivo',
    ultimoAcceso: '2026-04-15T10:30:00',
    avatar: 'NG',
    color: '#646587'
  }
];

/* ─── CRUD ─── */

/** Devuelve todos los usuarios (inicializa desde mock si no hay datos). */
export function getUsers() {
  try {
    const raw = sessionStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  const data = MOCK_USERS.map((u) => ({ ...u }));
  _save(data);
  return data;
}

/** Agrega un usuario nuevo. Devuelve el usuario creado. */
export function addUser(u) {
  const users = getUsers();
  const nuevo = {
    id: 'u-' + Date.now(),
    nombre: u.nombre || '',
    correo: u.correo || '',
    rol: u.rol || 'USER',
    estado: 'pendiente',
    ultimoAcceso: null,
    avatar: _initials(u.nombre),
    color: _colorForRol(u.rol)
  };
  users.push(nuevo);
  _save(users);
  return nuevo;
}

/** Actualiza campos de un usuario. Devuelve el usuario actualizado o null. */
export function updateUser(id, patch) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return null;
  if (patch.nombre) patch.avatar = _initials(patch.nombre);
  if (patch.rol) patch.color = _colorForRol(patch.rol);
  users[idx] = { ...users[idx], ...patch };
  _save(users);
  return users[idx];
}

/** Alterna el estado entre activo e inactivo. Devuelve el usuario actualizado. */
export function toggleUserStatus(id) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return null;
  const cur = users[idx].estado;
  users[idx].estado = cur === 'activo' ? 'inactivo' : 'activo';
  _save(users);
  return users[idx];
}

/* ─── Privados ─── */
function _save(data) {
  try { sessionStorage.setItem(USERS_KEY, JSON.stringify(data)); } catch (_) { /* ignore */ }
}

function _initials(nombre) {
  return (nombre || '?').split(/\s+/).filter(Boolean).slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase()).join('');
}

function _colorForRol(rol) {
  const MAP = { ADMIN: '#d74009', GESTOR: '#1f8923', USER: '#1f78d1' };
  return MAP[rol] || '#646587';
}
