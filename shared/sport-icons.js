/* Íconos de deporte por código real (revisión COC, 11): trazo 24×24 que hereda currentColor. Sin ícono propio, el monograma del código. */
(function () {
  var RUN = '<circle cx="14" cy="5" r="2"/><path d="M13 8l-3 4 3 2 1 5M10 12l-4 1M13 8l4 3 3-1M14 14l4 5"/>';
  var SWIM = '<circle cx="16" cy="6" r="2"/><path d="M4 13l5-3 4 2 2-2M3 17c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1M3 21c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1"/>';
  var BIKE = '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-8h5l3 8M10 8l3 8M9 6h3"/>';
  var WEIGHT = '<path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/>';
  var BALL = '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5v17M6 6c3 3 3 9 0 12M18 6c-3 3-3 9 0 12"/>';
  var VOLLEY = '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5c-1 4 0 7 4 9.5M5 8c4 0 7 2 9 6M20 14c-4-2-8-1-10 3"/>';
  var SOCCER = '<circle cx="12" cy="12" r="8.5"/><path d="M12 8l3.5 2.5-1.3 4H9.800l-1.300-4zM12 3.500V8M15.500 10.500L20 9M14.200 14.500l2.800 3.800M9.800 14.500L7 18.300M8.500 10.500L4 9"/>';
  var HANDBALL = '<circle cx="12" cy="12" r="8.5"/><path d="M12 7l4 3-1.5 5h-5L8 10z"/>';
  var RACKET = '<ellipse cx="10" cy="9" rx="5.5" ry="6.5" transform="rotate(-30 10 9)"/><path d="M13.500 14.500L20 21M7 6l6 6"/>';
  var PINGPONG = '<circle cx="10" cy="10" r="6"/><path d="M14.500 14.500L20 20M18 7a1.500 1.500 0 110 .1"/>';
  var GLOVE = '<path d="M7 11V8a4 4 0 018 0v1h2a2 2 0 012 2v3a6 6 0 01-6 6h-1a5 5 0 01-5-5z"/><path d="M7 14h8"/>';
  var GYM = '<circle cx="12" cy="4.500" r="1.800"/><path d="M4 8h16M12 8v6M9 21l3-7 3 7"/>';
  var JUDO = '<circle cx="8" cy="5" r="2"/><circle cx="17" cy="7" r="2"/><path d="M8 8v5l-3 6M8 13l4 2 5-6M17 9l2 5M12 15l-1 5"/>';
  var WRESTLE = '<circle cx="8" cy="5" r="2"/><circle cx="16" cy="5" r="2"/><path d="M8 8l2 5-3 6M16 8l-2 5 3 6M10 13h4"/>';
  var KICK = '<circle cx="9" cy="5" r="2"/><path d="M9 8v6l-3 6M9 14l4 5M9 10l9-3M9 10l-4 2"/>';
  var FENCE = '<path d="M4 20L18 6M14 4l6 6M6 14l4 4M18 20L6 8M4 10l6-6"/>';
  var ARCHERY = '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12l8-8M17 4h3v3"/>';
  var SHOOT = '<circle cx="12" cy="12" r="7"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/>';
  var BOAT = '<path d="M3 15h18l-3 4H6zM12 4v9M12 5l5 7h-5"/>';
  var ROW = '<path d="M3 17c1.500 0 1.500-1 3-1s1.500 1 3 1 1.500-1 3-1 1.500 1 3 1 1.500-1 3-1 1.500 1 3 1M5 13l14-6M16 5l4 4"/>';
  var SURF = '<path d="M3 18c1.500 0 1.500-1 3-1s1.500 1 3 1 1.500-1 3-1 1.500 1 3 1 1.500-1 3-1 1.500 1 3 1M6 14c4-1 7-4 9-9 2 4 2 8 0 11"/>';
  var HORSE = '<path d="M6 21V11a6 6 0 0112 0v10M9 21v-6h6v6M9 11h.01"/>';
  var SKATE = '<rect x="3" y="12" width="18" height="3" rx="1.500"/><circle cx="7" cy="18.500" r="1.500"/><circle cx="17" cy="18.500" r="1.500"/><path d="M12 12V6M9 8l3-2 3 2"/>';
  var CLIMB = '<path d="M3 20l6-11 3 5 3-4 6 10zM9 9l1.500 2.500"/>';
  var GOLF = '<path d="M9 21V3l8 4-8 4M5 21h8"/><circle cx="16" cy="19" r="1.500"/>';
  var HOCKEY = '<path d="M5 3l10 15c1 1.500 3 1.500 4 0M12 21h8"/><circle cx="7" cy="20" r="1.200"/>';
  var RUGBY = '<ellipse cx="12" cy="12" rx="9" ry="5.500" transform="rotate(-35 12 12)"/><path d="M9 9l6 6M10.500 12.500L13 10"/>';
  var BASE = '<circle cx="12" cy="12" r="8.500"/><path d="M7 5c3 3 3 11 0 14M17 5c-3 3-3 11 0 14"/>';
  var PIN = '<circle cx="12" cy="14" r="7"/><circle cx="10" cy="11" r=".6"/><circle cx="13.500" cy="11" r=".6"/><circle cx="12" cy="14" r=".6"/><path d="M12 3v2"/>';
  var GAME = '<rect x="3" y="8" width="18" height="10" rx="5"/><path d="M8 11v4M6 13h4M15.500 12.500h.01M17.500 14.500h.01"/>';
  var SAIL = '<path d="M12 3v14M12 4c4 3 6 7 6 11h-6M10 8c-3 2-4 5-4 7h4M4 19h16l-2 2H6z"/>';

  var MAP = {
    AGU_ABI: SWIM, ATL: RUN, BAD: RACKET, BALM: HANDBALL, BOU: PIN, BOW: PIN, BOX: GLOVE, CSL: BOAT, CSP: BOAT,
    BMF: BIKE, BMX: BIKE, MTB: BIKE, CTR: BIKE, CRD: BIKE, DIV: SWIM, EDR: HORSE, EVE: HORSE, EJP: HORSE,
    ESC: CLIMB, ESG: FENCE, ESPORTS: GAME, ESQ_NAU: SURF, FBA: PINGPONG, FRN: PINGPONG, FUT: SOCCER,
    GAR: GYM, GRY: GYM, GTR: GYM, GOL: GOLF, HOC: HOCKEY, JUD: JUDO, KAR: KICK, LEV_PES: WEIGHT, LUC: WRESTLE,
    NAT: SWIM, SWA: SWIM, PAD: RACKET, ASK: SKATE, SSK: SKATE, FGT: PINGPONG, PEN_MOD: RUN, POL_ACU: SWIM,
    RAQ: RACKET, REM: ROW, RCB: ROW, RUG: RUGBY, SKA: SKATE, SOF: BASE, SQU: RACKET, SUP: SURF, SUR: SURF,
    TAE: KICK, TEN: RACKET, TEN_MES: PINGPONG, TIR_ARC: ARCHERY, TIR_DEP: SHOOT, TRI: RUN, VEL: SAIL,
    VVO: VOLLEY, VBV: VOLLEY,
    /* Claves del fixture sintético */
    atletismo: RUN, natacion: SWIM, ciclismo: BIKE, pesas: WEIGHT, baloncesto: BALL, voleibol: VOLLEY, balonmano: HANDBALL,
    'futbol-sala': SOCCER, boxeo: GLOVE, 'tenis-mesa': PINGPONG, gimnasia: GYM, judo: JUDO, lucha: WRESTLE, taekwondo: KICK
  };

  window.OLC = window.OLC || {};
  /* Devuelve el SVG completo; `cls` es la clase del contenedor de cada prototipo. */
  window.OLC.iconoDeporte = function (codigo, cls, size) {
    var inner = MAP[codigo], s = size || 24;
    if (!inner) inner = '<text x="12" y="15.500" text-anchor="middle" font-size="8.500" font-weight="700" fill="currentColor" stroke="none" font-family="inherit">' + String(codigo || '?').replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase() + '</text>';
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + inner + '</svg>';
  };
})();
