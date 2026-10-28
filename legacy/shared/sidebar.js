/* ═══════════════════════════════════════════════════════════════
   NAOWEE EVENTOS — Shell: sidebar + header (profile-switcher)
   Adaptado de naowee-test-sidebar-shell/shared/sidebar.js, reducido
   al alcance del módulo Eventos LIGHT v0.1:
     - 3 roles: Usuario (lectura) · Administrador · Gestor
     - Menú por rol (Eventos). Items sin sub-niveles (light).
     - Colapsar sidebar + persistencia localStorage.
     - Drawer off-canvas en mobile (<1024px).
     - Navegación full-page-reload entre roles (NO SPA — decisión Naowee).
   ═══════════════════════════════════════════════════════════════ */

const COLLAPSED_KEY = 'naowee-eventos-sidebar-collapsed';

/* ─── Iconos inline (stroke currentColor, paridad shell canónico) ─── */
const ICONS = {
  home:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  list:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>',
  plus:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
  ticket:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 0 0 4v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 0 0-4z"/><line x1="12" y1="3" x2="12" y2="21" stroke-dasharray="2 2"/></svg>',
  ranking:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="20" x2="4" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="20" y1="20" x2="20" y2="14"/></svg>',
  medal:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12v3l2 1"/><path d="M8.5 9.5L6 3M15.5 9.5L18 3"/></svg>',
  athlete:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>',
  chart:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 4-5"/></svg>',
  chevron:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  check:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  user:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  gear:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logout:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  refresh:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  id:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c0-1.5 1.5-2.2 3-2.2s3 .7 3 2.2"/><line x1="15" y1="10" x2="18" y2="10"/><line x1="15" y1="13" x2="18" y2="13"/></svg>'
};
export function getIcon(name) { return ICONS[name] || ''; }

/* ─── Roles del módulo Eventos (light) ─── */
/* avatar: iniciales precomputadas para el pill demo (paridad IVC).
   userDoc: documento (CC) que se muestra SOLO en el chip de identidad. */
export const ROLES = {
  USER: {
    code: 'USER', label: 'Usuario del módulo',
    userName: 'Laura Méndez', userEmail: 'laura.mendez@mindeporte.gov.co',
    userDoc: 'CC 1.020.456.789', avatar: 'LM',
    color: '#1f78d1', short: 'Lectura · ve todos los eventos',
    group: 'Lectura'
  },
  ADMIN: {
    code: 'ADMIN', label: 'Administrador de eventos',
    userName: 'Carlos Restrepo', userEmail: 'carlos.restrepo@mindeporte.gov.co',
    userDoc: 'CC 79.345.112', avatar: 'CR',
    color: '#d74009', short: 'Crea y asigna eventos',
    group: 'Operación'
  },
  GESTOR: {
    code: 'GESTOR', label: 'Gestor de eventos',
    userName: 'Andrea Salas', userEmail: 'andrea.salas@mindeporte.gov.co',
    userDoc: 'CC 52.880.301', avatar: 'AS',
    color: '#1f8923', short: 'Carga inscripciones · resultados · medallería',
    group: 'Operación'
  },
  ORGANISMO: {
    code: 'ORGANISMO', label: 'Liga de Natación del Valle',
    userName: 'Diego Ospina', userEmail: 'dospina@liganatacionvalle.com',
    userDoc: 'CC 94.281.003', avatar: 'LN',
    color: '#7c3aed', short: 'Gestiona el calendario de eventos del organismo',
    group: 'Calendario'
  }
};

/* ─── Items de menú (light — sin sub-niveles) ─── */
const ITEMS = {
  dashboard:        { id: 'dashboard',        label: 'Dashboard',                icon: 'home',     route: 'dashboard.html' },
  eventos:          { id: 'eventos',          label: 'Eventos',                  icon: 'list',     route: 'eventos.html' },
  calendarioEventos:{ id: 'calendario-eventos', label: 'Calendario',             icon: 'calendar', route: 'eventos.html?view=calendar', child: true },
  /* Cargues ADMIN oversight: mismas rutas que el gestor — el rol (ADMIN) activa el modo solo lectura */
  seguInscripciones:{ id: 'inscripciones',    label: 'Inscripciones',            icon: 'ticket',   route: 'cargue.html?tipo=inscripciones' },
  seguRanking:      { id: 'ranking',          label: 'Ranking / Resultados',     icon: 'ranking',  route: 'cargue.html?tipo=ranking' },
  seguMedalleria:   { id: 'medalleria',       label: 'Medallería',               icon: 'medal',    route: 'cargue.html?tipo=medalleria' },
  perfil:           { id: 'perfil',           label: 'Consulta deportistas',     icon: 'athlete',  route: 'perfil.html' },
  calendarioOrg:    { id: 'calendario',       label: 'Calendario de eventos',    icon: 'calendar', route: 'calendario.html' },
  reporteria:       { id: 'reporteria',       label: 'Reportería',               icon: 'chart',    route: 'reporteria.html' },
  usuarios:         { id: 'usuarios',         label: 'Usuarios',                 icon: 'user',     route: 'usuarios.html' }
};

/* ─── Menú por rol ─── */
const MENU_BY_ROLE = {
  USER: [
    { section: null,           items: [ITEMS.dashboard] },
    { section: 'EVENTOS',      items: [ITEMS.eventos, ITEMS.calendarioEventos] },
    /* Reportería: la analítica por evento de Diego es consumo de lectura,
       igual que el dashboard → el Usuario del módulo también la ve. */
    { section: 'ANALÍTICA',    items: [ITEMS.reporteria] },
    { section: 'CONSULTA',     items: [ITEMS.perfil] }
  ],
  ADMIN: [
    { section: null,           items: [ITEMS.dashboard] },
    /* "Crear evento" se quitó del sidebar: ya es el CTA dentro de eventos.html
       (reduce carga cognitiva — no duplicar la acción). */
    { section: 'EVENTOS',      items: [ITEMS.eventos, ITEMS.calendarioEventos] },
    /* SEGUIMIENTO: monitoreo de cargues por tipo — modo oversight (solo lectura) */
    { section: 'SEGUIMIENTO',  items: [ITEMS.seguInscripciones, ITEMS.seguRanking, ITEMS.seguMedalleria] },
    { section: 'CONSULTA',        items: [ITEMS.perfil] },
    { section: 'ANALÍTICA',       items: [ITEMS.reporteria] },
    { section: 'ADMINISTRACIÓN',  items: [ITEMS.usuarios] }
  ],
  GESTOR: [
    /* Operativo: NO ve el Dashboard analítico ni Reportería (eso es consumo de
       ADMIN/Usuario). Su home y única entrada es "Eventos asignados": al entrar
       a un evento ve el detalle + los 3 cargues (inscripciones · ranking ·
       medallería) como tabs dentro del evento. Ya no hay 3 páginas sueltas de
       cargue en el sidebar (decisión UX Doug 2026-06: un solo punto de entrada). */
    { section: 'EVENTOS',      items: [ITEMS.eventos, ITEMS.calendarioEventos] },
    { section: 'CONSULTA',     items: [ITEMS.perfil] }
  ],
  ORGANISMO: [
    { section: 'CALENDARIO',   items: [ITEMS.calendarioOrg] },
    { section: 'CONSULTA',     items: [ITEMS.perfil] }
  ]
};

export function getRoleFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('role');
  return ROLES[code] ? code : 'USER';
}
export function getMenuForRole(code) { return MENU_BY_ROLE[code] || MENU_BY_ROLE.USER; }

/* Home por rol: el Gestor (operativo) NO tiene Dashboard analítico → su home es
   "Eventos". Organismo aterriza en el Calendario. Admin y Usuario en el Dashboard. */
export function homeForRole(code) {
  if (code === 'GESTOR') return 'eventos.html';
  if (code === 'ORGANISMO') return 'calendario.html';
  return 'dashboard.html';
}

/* En la demo, las rutas internas (#…) son placeholders. Solo el Dashboard
   está construido en la Fase 1. Cambiar de rol preserva el activeId. */
function hrefForItem(item, roleCode) {
  if (item.route && item.route.includes('.html')) {
    /* Preserva query params existentes en la ruta (ej. cargue.html?tipo=inscripciones). */
    const sep = item.route.includes('?') ? '&' : '?';
    return `${item.route}${sep}role=${roleCode}`;
  }
  return null; // placeholder — no navega aún
}

/* ─── Sidebar ─── */
export function mountSidebar({ rootEl, roleCode, activeId }) {
  const role = ROLES[roleCode] || ROLES.USER;
  const sections = getMenuForRole(role.code);
  const isCollapsed = localStorage.getItem(COLLAPSED_KEY) === '1';
  rootEl.innerHTML = renderSidebar({ sections, activeId, isCollapsed, roleCode: role.code });
  bindSidebarEvents(rootEl);
  setupTooltips(rootEl);
  return { role, sections };
}

function renderSection(section, activeId, roleCode) {
  return `
    ${section.section ? `<div class="nav-section">${section.section}</div>` : ''}
    ${section.items.map((it) => renderRow(it, activeId, roleCode)).join('')}
  `;
}

function renderRow(item, activeId, roleCode) {
  const isActive = item.id === activeId;
  const href = hrefForItem(item, roleCode);
  const tag = href ? 'a' : 'div';
  const hrefAttr = href ? ` href="${href}"` : '';
  return `
    <${tag} class="nav-row ${item.child ? 'nav-row--child' : ''} ${isActive ? 'active' : ''}" data-id="${item.id}"${hrefAttr}>
      ${isActive && !item.child ? '<span class="active-bar" aria-hidden="true"></span>' : ''}
      <span class="icon">${getIcon(item.icon)}</span>
      <span class="lbl">${item.label}</span>
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    </${tag}>
  `;
}

function renderSidebar({ sections, activeId, isCollapsed, roleCode }) {
  return `
    <aside class="sidebar ${isCollapsed ? 'collapsed' : ''}" id="naoweeSidebar">
      <div class="sidebar-logo">
        <button class="burger-btn" id="sidebarToggle" type="button" aria-label="Colapsar menú">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="#282834" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
        <img src="shared/logos/ministerio.svg" alt="Ministerio del Deporte" class="sb-logo-img"/>
        <div class="logo-sep"></div>
        <img src="shared/logos/suid.png" alt="SUID" class="sb-logo-img"/>
      </div>
      <nav class="sidebar-nav" id="sidebarNav" role="navigation" aria-label="Menú principal">
        ${sections.map((s) => renderSection(s, activeId, roleCode)).join('')}
      </nav>
    </aside>
  `;
}

function bindSidebarEvents(rootEl) {
  const sidebar = rootEl.querySelector('.sidebar');
  const toggle = rootEl.querySelector('#sidebarToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem(COLLAPSED_KEY, sidebar.classList.contains('collapsed') ? '1' : '0');
    });
  }
  /* Placeholders (div sin href): feedback "próximamente" sin navegar */
  rootEl.querySelectorAll('.nav-row:not([href])').forEach((row) => {
    row.addEventListener('click', () => {
      if (row.classList.contains('active')) return;
      flashPlaceholder(row.querySelector('.lbl')?.textContent || 'Esta sección');
      closeDrawer();
    });
  });
  /* Links reales: cerrar drawer antes de navegar */
  rootEl.querySelectorAll('.nav-row[href]').forEach((row) => {
    row.addEventListener('click', closeDrawer);
  });
}

let _toastTimer = null;
function flashPlaceholder(label) {
  let toast = document.getElementById('evToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'evToast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = `${label}: pantalla disponible en una próxima fase de la demo.`;
  toast.classList.add('is-visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

/* ─── Tooltips para sidebar colapsado ─── */
let _tooltipEl = null;
function setupTooltips(rootEl) {
  const sidebar = rootEl.querySelector('.sidebar');
  if (!sidebar) return;
  if (!_tooltipEl) {
    _tooltipEl = document.createElement('div');
    _tooltipEl.className = 'nav-tooltip';
    document.body.appendChild(_tooltipEl);
  }
  function show(row) {
    if (!sidebar.classList.contains('collapsed') || window.innerWidth < 1024) return;
    const lbl = row.querySelector('.lbl');
    if (!lbl) return;
    _tooltipEl.textContent = lbl.textContent.trim();
    const r = row.getBoundingClientRect();
    _tooltipEl.style.left = `${r.right + 12}px`;
    _tooltipEl.style.top = `${r.top + r.height / 2}px`;
    _tooltipEl.classList.add('is-visible');
  }
  function hide() { if (_tooltipEl) _tooltipEl.classList.remove('is-visible'); }
  rootEl.querySelectorAll('.nav-row').forEach((row) => {
    row.addEventListener('mouseenter', () => show(row));
    row.addEventListener('mouseleave', hide);
  });
  new MutationObserver(hide).observe(sidebar, { attributes: true, attributeFilter: ['class'] });
}

/* ─── Drawer (mobile) ─── */
function openDrawer() { document.body.classList.add('has-mobile-drawer-open'); }
function closeDrawer() { document.body.classList.remove('has-mobile-drawer-open'); }

/* ─── Header (branding/burger + chip de identidad) ────────────────
   La barra superior queda con el branding/logos (en el sidebar, +
   burger en mobile) a la izquierda y el chip de identidad a la
   derecha. El título de cada página vive en el H1 del contenido
   (no se repite en el top-header). Doug feedback Fase 3.
   El chip es SOLO identidad (avatar + nombre + rol + chevron →
   mini-dropdown con nombre + CC + rol). NO cambia de rol — eso vive
   en el pill demo inferior (mountDemoSwitcher). Los params
   `title`/`subtitle` se aceptan pero ya no se renderizan (compat). */
export function mountHeader({ headerEl, role, title, subtitle }) {
  const initials = role.avatar || (role.userName || role.label).split(/\s+/).filter(Boolean)
    .slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  headerEl.innerHTML = `
    <button class="header-burger" id="headerBurger" type="button" aria-label="Abrir menú">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
    <div class="profile-switcher" id="profileSwitcher">
      <div class="user-chip" id="userChipTrigger" role="button" tabindex="0" aria-haspopup="menu" aria-label="Mi cuenta">
        <div class="ava">
          <div class="ava-ring" style="background:${role.color}22;color:${role.color}">${initials}</div>
          <div class="ava-dot"></div>
        </div>
        <div class="user-info">
          <span class="user-name">${role.userName}</span>
          <span class="user-role">${role.label}</span>
        </div>
        <button class="user-chip__chevron" type="button" tabindex="-1" aria-hidden="true">${getIcon('chevron')}</button>
      </div>
      <div class="profile-dd profile-dd--identity-only" role="menu">
        <div class="profile-dd__header">
          <span class="ava-ring" style="width:42px;height:42px;font-size:14px;background:${role.color}22;color:${role.color}">${initials}</span>
          <div class="profile-dd__user">
            <strong>${role.userName}</strong>
            <span class="profile-dd__doc">${getIcon('id')}${role.userDoc || '—'}</span>
            <span class="profile-dd__current-role" style="color:${role.color}">
              <span class="profile-dd__check-ico">${getIcon('check')}</span>${role.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
  bindHeaderEvents(headerEl);
}

function bindHeaderEvents(headerEl) {
  const switcher = headerEl.querySelector('#profileSwitcher');
  const trigger = headerEl.querySelector('#userChipTrigger');
  const burger = headerEl.querySelector('#headerBurger');
  if (burger) burger.addEventListener('click', openDrawer);
  if (!switcher || !trigger) return;
  const toggle = (e) => { e.stopPropagation(); switcher.classList.toggle('open'); };
  trigger.addEventListener('click', toggle);
  trigger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(e); } });
  document.addEventListener('click', (e) => { if (!switcher.contains(e.target)) switcher.classList.remove('open'); });
}

/* ─── Backdrop del drawer: click cierra. ESC cierra todo. ─── */
export function mountBackdrop() {
  let bd = document.querySelector('.shell-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'shell-backdrop';
    document.body.appendChild(bd);
  }
  bd.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      document.getElementById('profileSwitcher')?.classList.remove('open');
      document.getElementById('demoSwitcher')?.classList.remove('is-open');
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════
   DEMO ROLE SWITCHER — pill flotante INFERIOR centrada (solo sandbox)
   Patrón canónico IVC #1 (prototype/shared/shell.js renderDemoSwitcher).
   Contiene: roles AGRUPADOS por categoría + toggle MODO DEMO
   (Guiado·vacío / Libre·con datos) + Reiniciar tour / Reiniciar demo.
   Cambiar de rol recarga la página con ?role=X → el shell/menú cambian.
   ═══════════════════════════════════════════════════════════════════ */
const MODE_KEY = 'naowee-eventos-demo-mode';   // 'blank' | 'demo'
const TOUR_KEY = 'naowee-eventos-tour-seen';

export function getDemoMode() {
  const m = localStorage.getItem(MODE_KEY);
  return m === 'blank' || m === 'demo' ? m : 'demo';
}

/* Roles agrupados por categoría operativa (sugerencia Doug). */
const ROLE_GROUPS = [
  { label: 'Operación',  codes: ['USER', 'ADMIN', 'GESTOR'] },
  { label: 'Calendario', codes: ['ORGANISMO'] }
];

/* DEMO_ONLY ya no incluye ORGANISMO (ahora es rol real en ROLES). */
const DEMO_ONLY = {};

function demoToast(msg) {
  let toast = document.getElementById('evToast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'evToast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

export function mountDemoSwitcher({ roleCode }) {
  const current = ROLES[roleCode] || ROLES.USER;
  const allByCode = { ...ROLES, ...DEMO_ONLY };

  const renderItem = (p) => {
    const isActive = p.code === current.code;
    const disabled = p.enabled === false;
    const ini = p.avatar || (p.userName || p.label).split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    return `
      <a class="demo-role-switcher__item ${isActive ? 'is-active' : ''} ${disabled ? 'is-disabled' : ''}"
         href="#" data-perfil="${p.code}" ${disabled ? 'aria-disabled="true"' : ''}>
        <span class="demo-role-switcher__item-avatar" style="background:${p.color}22;color:${p.color}">${ini}</span>
        <span class="demo-role-switcher__item-meta">
          <span class="demo-role-switcher__item-name">${p.userName || p.label}</span>
          <span class="demo-role-switcher__item-role">${p.label}</span>
        </span>
        ${p.hint ? `<span class="demo-role-switcher__item-stage">${p.hint}</span>` : ''}
        ${isActive ? `<span class="demo-role-switcher__check">${getIcon('check')}</span>` : ''}
      </a>`;
  };

  const listHtml = ROLE_GROUPS.map((g) => {
    const items = g.codes.map((c) => allByCode[c]).filter(Boolean).map(renderItem).join('');
    if (!items) return '';
    return `<div class="demo-role-switcher__group-label">${g.label}</div>${items}`;
  }).join('');

  const root = document.createElement('div');
  root.className = 'demo-role-switcher';
  root.id = 'demoSwitcher';
  root.innerHTML = `
    <button class="demo-role-switcher__toggle" id="demoSwitcherToggle" type="button" aria-haspopup="true" aria-expanded="false">
      <span class="demo-role-switcher__badge">DEMO</span>
      <span class="demo-role-switcher__avatar" style="background:${current.color}22;color:${current.color}">${current.avatar || 'EV'}</span>
      <span>Cambiar perfil</span>
      <span class="demo-role-switcher__chev">${getIcon('chevron')}</span>
    </button>
    <div class="demo-role-switcher__panel" id="demoSwitcherPanel" role="menu">
      <div class="demo-role-switcher__panel-label">CAMBIAR DE PERFIL (SIMULADO)</div>
      <div class="demo-role-switcher__list">${listHtml}</div>
      <div class="demo-role-switcher__mode-section">
        <div class="demo-role-switcher__mode-label">MODO DEMO</div>
        <div class="demo-role-switcher__mode-switch" role="group" aria-label="Modo demo">
          <button type="button" class="demo-role-switcher__mode-btn" data-mode="blank" title="Dashboard vacío — los datos llegan cuando reportería los carga">Guiado · vacío</button>
          <button type="button" class="demo-role-switcher__mode-btn" data-mode="demo" title="Datos de ejemplo cargados para explorar">Libre · con datos</button>
        </div>
      </div>
      <div class="demo-role-switcher__panel-footer">
        <button type="button" class="demo-role-switcher__action" id="demoRestartTourBtn">${getIcon('refresh')}<span>Reiniciar tour</span></button>
        <button type="button" class="demo-role-switcher__action demo-role-switcher__action--quiet" id="demoResetBtn" title="Limpia el state de la demo">Reiniciar demo</button>
      </div>
    </div>
  `;
  document.body.appendChild(root);
  bindDemoSwitcher(root);
}

function bindDemoSwitcher(root) {
  const toggle = root.querySelector('#demoSwitcherToggle');
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = root.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => { if (!root.contains(e.target)) root.classList.remove('is-open'); });

  /* Cambio de perfil → recarga con ?role=X (cambia shell + menú). */
  root.querySelectorAll('[data-perfil]').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if (item.classList.contains('is-disabled')) {
        const name = item.querySelector('.demo-role-switcher__item-name')?.textContent || 'Este perfil';
        demoToast(`${name}: disponible en una próxima fase de la demo.`);
        return;
      }
      const next = item.getAttribute('data-perfil');
      if (!ROLES[next]) return;
      const params = new URLSearchParams(window.location.search);
      if (params.get('role') === next) { root.classList.remove('is-open'); return; }
      window.location.href = `${homeForRole(next)}?role=${next}`;
    });
  });

  /* MODO DEMO (Guiado·vacío / Libre·con datos) — persiste en localStorage. */
  const syncMode = () => {
    const cur = getDemoMode();
    root.querySelectorAll('.demo-role-switcher__mode-btn').forEach((b) => {
      b.setAttribute('aria-pressed', b.dataset.mode === cur ? 'true' : 'false');
    });
  };
  syncMode();
  root.querySelectorAll('.demo-role-switcher__mode-btn').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = b.dataset.mode;
      if (mode === getDemoMode()) return;
      localStorage.setItem(MODE_KEY, mode);
      syncMode();
      root.classList.remove('is-open');
      window.dispatchEvent(new CustomEvent('eventos:demo-mode', { detail: { mode } }));
      setTimeout(() => demoToast(
        mode === 'demo'
          ? 'Modo libre: datos de ejemplo cargados.'
          : 'Modo guiado: dashboard vacío. Reportería aún no carga datos.'
      ), 160);
    });
  });

  /* Reiniciar tour */
  root.querySelector('#demoRestartTourBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    localStorage.removeItem(TOUR_KEY);
    root.classList.remove('is-open');
    demoToast('Tour reiniciado — se mostrará en tu próxima visita.');
  });

  /* Reiniciar demo (full reset → borra TODO el state de la demo y vuelve al selector).
     Antes solo limpiaba modo+tour, por eso los eventos/usuarios/cargues creados
     seguían apareciendo. Ahora barre todas las claves 'naowee-eventos-*' en ambos
     storages (drafts, overrides, cargue-deltas/history/files, users, calendario,
     events-view, modo, tour, sidebar-collapsed). */
  root.querySelector('#demoResetBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.confirm('¿Reiniciar la demo? Se borran los eventos, usuarios y cargues que creaste y se restablecen el modo y el tour.')) {
      [sessionStorage, localStorage].forEach((store) => {
        for (let i = store.length - 1; i >= 0; i--) {
          const k = store.key(i);
          if (k && k.startsWith('naowee-eventos-')) store.removeItem(k);
        }
      });
      window.location.href = 'index.html';
    }
  });
}
