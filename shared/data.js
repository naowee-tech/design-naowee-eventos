/* Datos COMPARTIDOS por plataforma y landing (mismo dataset, dos pieles). Sin red.
   Evento principal `suramericanos-sante-fe-2026`: datos REALES de window.OLC_REAL (shared/real/model.js, cargar ANTES).
   Los demás eventos son sintéticos y deterministas, con la MISMA forma de prueba (ver SPEC.md > Datos).
   Uso: OLC.eventos(), OLC.datosDe(code) → { evento, estado, colombia, deportes, pruebas, dias, paises, medallero() } */
(function () {
  /* ?hoy=AAAA-MM-DD simula otra fecha (configuraciones de demo.html). */
  var HOY = ((window.location.search.match(/[?&]hoy=(\d{4}-\d{2}-\d{2})/) || [])[1]) || '2026-09-18';
  var CODE_REAL = 'suramericanos-sante-fe-2026';
  var REAL = window.OLC_REAL || null;

  function mulberry(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(s) { var h = 13; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

  /* [ISO-2, nombre, gentilicio plural] */
  var PAISES = [
    ['BR', 'Brasil'], ['AR', 'Argentina'], ['MX', 'México'], ['CL', 'Chile'], ['VE', 'Venezuela'],
    ['EC', 'Ecuador'], ['PE', 'Perú'], ['UY', 'Uruguay'], ['PY', 'Paraguay'], ['BO', 'Bolivia']
  ];
  var COLOMBIA = ['CO', 'Colombia'];
  var NOMBRE_PAIS = { CO: 'Colombia' };
  PAISES.forEach(function (p) { NOMBRE_PAIS[p[0]] = p[1]; });

  /* Nombres plausibles por país: [femeninos, masculinos, apellidos] */
  var ES_F = ['Andrea', 'Camila', 'Valentina', 'Daniela', 'Mariana', 'Laura', 'Sofía', 'Natalia', 'Paula', 'Juliana'];
  var ES_M = ['Santiago', 'Mateo', 'Andrés', 'Sebastián', 'Daniel', 'Felipe', 'Nicolás', 'Camilo', 'Julián', 'Diego'];
  var PT_F = ['Beatriz', 'Larissa', 'Fernanda', 'Gabriela', 'Letícia', 'Juliana', 'Amanda', 'Bruna'];
  var PT_M = ['Lucas', 'Gabriel', 'Rafael', 'Thiago', 'Gustavo', 'Bruno', 'Mateus', 'Vinícius'];
  var NOMBRES = {
    CO: [ES_F, ES_M, ['MOSQUERA', 'RAMÍREZ', 'CASTRO', 'ARIZA', 'PALACIOS', 'OSPINA', 'VELÁSQUEZ', 'RESTREPO', 'CUESTA', 'HURTADO']],
    BR: [PT_F, PT_M, ['SILVA', 'OLIVEIRA', 'SOUZA', 'PEREIRA', 'COSTA', 'ALMEIDA', 'FERREIRA', 'RODRIGUES']],
    AR: [ES_F, ES_M, ['FERNÁNDEZ', 'GONZÁLEZ', 'ROMERO', 'ACOSTA', 'BENÍTEZ', 'MOLINA', 'SOSA', 'PAZ']],
    MX: [ES_F, ES_M, ['HERNÁNDEZ', 'LÓPEZ', 'MARTÍNEZ', 'GARCÍA', 'CHÁVEZ', 'MENDOZA', 'RUIZ', 'AGUILAR']],
    CL: [ES_F, ES_M, ['MUÑOZ', 'ROJAS', 'DÍAZ', 'PÉREZ', 'SOTO', 'CONTRERAS', 'SILVA', 'ARAYA']],
    VE: [ES_F, ES_M, ['RODRÍGUEZ', 'GÓMEZ', 'BRICEÑO', 'PARRA', 'MARÍN', 'URBANO', 'QUINTERO', 'ROJAS']],
    EC: [ES_F, ES_M, ['CHILA', 'CARRILLO', 'VERA', 'MACÍAS', 'ZAMBRANO', 'ESPINOZA', 'TORRES', 'CEDEÑO']],
    PE: [ES_F, ES_M, ['QUISPE', 'HUAMÁN', 'FLORES', 'CHÁVEZ', 'ROJAS', 'MAMANI', 'VARGAS', 'SALAZAR']],
    UY: [ES_F, ES_M, ['TECHERA', 'PEREIRA', 'RODRÍGUEZ', 'SILVA', 'CABRERA', 'MÉNDEZ', 'FERREIRA', 'ACOSTA']],
    PY: [ES_F, ES_M, ['BENÍTEZ', 'GIMÉNEZ', 'VERA', 'DUARTE', 'AQUINO', 'ROLÓN', 'ORTIZ', 'LIUZZI']],
    BO: [ES_F, ES_M, ['MAMANI', 'CONDORI', 'VARGAS', 'CRUZ', 'ROJAS', 'GUTIÉRREZ', 'APAZA', 'CALLE']]
  };
  /* Regla ÚNICA «Apellido(s) Nombre(s)» en Camel Case: copia IDÉNTICA de normalizarNombre de
     shared/real/build-model.cjs (no se comparte código entre ambos); mantener las dos iguales. */
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

  /* Nombre «Apellido Nombre» determinista (k = índice de pool, sexo F|M; X → alterna). */
  function nombreDeportista(pais, sexo, k) {
    var pool = NOMBRES[pais] || NOMBRES.CO, sx = sexo === 'F' ? 0 : sexo === 'M' ? 1 : (k % 2);
    var nom = pool[sx], ape = pool[2];
    return normalizarNombre(ape[(k * 3 + sx + 1) % ape.length] + ' ' + nom[k % nom.length]);
  }

  /* [código, nombre, escenario, [[prueba, sexos('FM'|'X'|'F'|'M'), tipoMarca('t'|'d'|'p'|'k'|'-'), ronda]]] */
  var DEPORTES = [
    ['atletismo', 'Atletismo', 'Estadio Metropolitano', [['100 m', 'FM', 't', 'Final'], ['400 m', 'FM', 't', 'Final'], ['1.500 m', 'FM', 't', 'Final'], ['Salto largo', 'FM', 'd', 'Final'], ['Salto alto', 'FM', 'd', 'Final'], ['Lanzamiento de bala', 'FM', 'd', 'Final'], ['Relevo 4 × 100 m', 'X', 't', 'Final']]],
    ['natacion', 'Natación', 'Piscinas Olímpicas', [['100 m libre', 'FM', 't', 'Final'], ['200 m libre', 'FM', 't', 'Final'], ['100 m pecho', 'FM', 't', 'Final'], ['Relevo 4 × 100 m combinado', 'X', 't', 'Final']]],
    ['judo', 'Judo', 'Coliseo Humberto Perea', [['Hasta 60 kg', 'M', '-', 'Final'], ['Hasta 52 kg', 'F', '-', 'Final'], ['Hasta 73 kg', 'M', '-', 'Final'], ['Hasta 63 kg', 'F', '-', 'Final']]],
    ['boxeo', 'Boxeo', 'Coliseo Humberto Perea', [['51 kg', 'F', '-', 'Final'], ['60 kg', 'M', '-', 'Final'], ['75 kg', 'M', '-', 'Final']]],
    ['ciclismo', 'Ciclismo', 'Velódromo Luis Carlos Galán', [['Ruta', 'FM', 't', 'Final'], ['Persecución individual', 'FM', 't', 'Final']]],
    ['gimnasia', 'Gimnasia', 'Coliseo Humberto Perea', [['Suelo', 'FM', 'p', 'Final'], ['Barra de equilibrio', 'F', 'p', 'Final'], ['Anillas', 'M', 'p', 'Final']]],
    ['pesas', 'Levantamiento de pesas', 'Coliseo Humberto Perea', [['55 kg', 'F', 'k', 'Final'], ['61 kg', 'M', 'k', 'Final'], ['71 kg', 'F', 'k', 'Final'], ['81 kg', 'M', 'k', 'Final']]],
    ['taekwondo', 'Taekwondo', 'Coliseo Humberto Perea', [['Hasta 57 kg', 'FM', '-', 'Final'], ['Hasta 68 kg', 'FM', '-', 'Final']]],
    ['tenis-mesa', 'Tenis de mesa', 'Coliseo Humberto Perea', [['Individual', 'FM', '-', 'Final'], ['Dobles mixtos', 'X', '-', 'Final']]],
    ['voleibol', 'Voleibol', 'Coliseo Humberto Perea', [['Torneo', 'FM', '-', 'Final']]],
    ['baloncesto', 'Baloncesto', 'Coliseo Humberto Perea', [['Torneo 3×3', 'FM', '-', 'Final']]],
    ['balonmano', 'Balonmano', 'Coliseo Humberto Perea', [['Torneo', 'FM', '-', 'Final']]],
    ['futbol-sala', 'Fútbol sala', 'Coliseo Humberto Perea', [['Torneo', 'FM', '-', 'Final']]],
    ['lucha', 'Lucha', 'Coliseo Humberto Perea', [['Hasta 57 kg', 'F', '-', 'Final'], ['Hasta 74 kg', 'M', '-', 'Final']]]
  ];
  var COMBATE = { judo: '1', boxeo: '1', taekwondo: '1', lucha: '1' };
  var MARCADOR = { judo: ['Ippon', 'Waza-ari'], boxeo: ['3-2', '5-0', '4-1'], taekwondo: ['12-8', '9-6'], lucha: ['8-2', '10-4'] };

  var SEXO = { F: 'Femenino', M: 'Masculino', X: 'Mixto' };

  var EVENTOS = [
    { code: CODE_REAL, nombre: 'XIII Juegos Suramericanos Santa Fe 2026', alcance: 'INTERNACIONAL', ciclo: true, inicio: '2026-09-13', fin: '2026-09-26', lugar: 'Santa Fe, Colombia', organismo: 'Comité Olímpico Colombiano', paises: 10, sedes: [], gestor: { nombre: 'Laura Marcela Ortiz', rol: 'Gestor de evento' }, descripcion: 'Juegos Suramericanos con deportistas de los países de la región compitiendo en 60 disciplinas.', real: true },
    { code: 'jja-2026', nombre: 'Juegos Juveniles de las Américas 2026', alcance: 'INTERNACIONAL', ciclo: true, inicio: '2026-09-10', fin: '2026-09-24', lugar: 'Barranquilla, Colombia', organismo: 'Comité Olímpico Colombiano', paises: 11, sedes: ['Estadio Metropolitano', 'Piscinas Olímpicas', 'Coliseo Humberto Perea', 'Velódromo Luis Carlos Galán'], gestor: { nombre: 'Laura Marcela Ortiz', rol: 'Gestor de evento' }, descripcion: 'Competencia multideportiva juvenil del Ciclo Olímpico con deportistas de las Américas: 14 deportes y todas sus pruebas en Barranquilla.' },
    { code: 'judo-suram-2026', deportes: ['judo'], nombre: 'Campeonato Suramericano de Judo', alcance: 'INTERNACIONAL', ciclo: true, inicio: '2026-09-16', fin: '2026-09-20', lugar: 'Cali, Colombia', organismo: 'Federación Colombiana de Judo', paises: 9, sedes: ['Coliseo del Pueblo'], gestor: { nombre: 'Andrés Felipe Mora', rol: 'Gestor de evento' }, descripcion: 'Campeonato continental de Judo, categorías juvenil y mayores.' },
    { code: 'copa-coc-cali-2026', nombre: 'Copa Internacional Ciclo Olímpico Cali 2026', alcance: 'INTERNACIONAL', ciclo: true, inicio: '2026-09-03', fin: '2026-09-05', lugar: 'Cali, Colombia', organismo: 'Comité Olímpico Colombiano', paises: 6, sedes: ['Estadio Pascual Guerrero', 'Piscinas Alberto Galindo'], gestor: { nombre: 'Laura Marcela Ortiz', rol: 'Gestor de evento' }, descripcion: 'Copa internacional de clasificación del Ciclo Olímpico con deportistas de seis países.' },
    { code: 'intercolegiados-2026', nombre: 'Juegos Intercolegiados Internacionales 2026', alcance: 'INTERNACIONAL', ciclo: true, inicio: '2026-11-16', fin: '2026-11-22', lugar: 'Barranquilla, Colombia', organismo: 'Ministerio del Deporte', paises: 8, sedes: ['Coliseo Humberto Perea', 'Estadio Metropolitano', 'Piscinas Olímpicas'], gestor: { nombre: 'Laura Marcela Ortiz', rol: 'Gestor de evento' }, descripcion: 'Juegos Intercolegiados 2026 con deportistas escolares de ocho países y Colombia como anfitrión.' },
    { code: 'natacion-nacional-2026', deportes: ['natacion'], nombre: 'Torneo Internacional de Natación', alcance: 'INTERNACIONAL', ciclo: false, inicio: '2026-10-20', fin: '2026-10-25', lugar: 'Medellín, Colombia', organismo: 'Federación Colombiana de Natación', paises: 7, sedes: ['Complejo Acuático de Medellín'], gestor: { nombre: 'Camilo Restrepo', rol: 'Gestor de evento' }, descripcion: 'Torneo internacional de natación en piscina olímpica con deportistas de siete países.' },
    { code: 'paradeportivo-2026', nombre: 'Festival Paradeportivo Internacional', alcance: 'INTERNACIONAL', ciclo: false, inicio: '2026-10-26', fin: '2026-11-01', lugar: 'Bogotá, Colombia', organismo: 'Comité Paralímpico Colombiano', paises: 8, sedes: ['Coliseo El Salitre'], gestor: { nombre: 'Marcela Duarte', rol: 'Gestor de evento' }, descripcion: 'Festival internacional de deportes paralímpicos con deportistas de ocho países.' },
    { code: 'panam-pesas-2026', deportes: ['pesas'], nombre: 'Campeonato Panamericano de Levantamiento de Pesas', alcance: 'INTERNACIONAL', ciclo: true, inicio: '2026-09-02', fin: '2026-09-06', lugar: 'Cartagena, Colombia', organismo: 'Federación Colombiana de Levantamiento de Pesas', paises: 10, sedes: ['Coliseo de Combate de Cartagena'], gestor: { nombre: 'Andrés Felipe Mora', rol: 'Gestor de evento' }, descripcion: 'Campeonato continental de levantamiento de pesas con deportistas de 10 países.' },
    { code: 'nacionales-juveniles-2026', nombre: 'Juegos Juveniles Internacionales 2026 · Fase Clasificatoria', alcance: 'INTERNACIONAL', ciclo: true, inicio: '2026-09-14', fin: '2026-09-20', lugar: 'Ibagué, Colombia', organismo: 'Ministerio del Deporte', paises: 9, sedes: ['Unidad Deportiva Peñón', 'Coliseo Cubierto Ibagué'], gestor: { nombre: 'Camilo Restrepo', rol: 'Gestor de evento' }, descripcion: 'Fase clasificatoria de los Juegos Juveniles Internacionales con deportistas de nueve países.' },
    { code: 'suram-ciclismo-2026', deportes: ['ciclismo'], nombre: 'Campeonato Suramericano de Ciclismo', alcance: 'INTERNACIONAL', ciclo: true, inicio: '2026-12-02', fin: '2026-12-06', lugar: 'Medellín, Colombia', organismo: 'Federación Colombiana de Ciclismo', paises: 9, sedes: ['Velódromo Martín Emilio Rodríguez'], gestor: { nombre: 'Marcela Duarte', rol: 'Gestor de evento' }, descripcion: 'Campeonato continental de ciclismo de pista y ruta.' },
    { code: 'gp-atletismo-2026', deportes: ['atletismo'], nombre: 'Gran Prix Internacional de Atletismo', alcance: 'INTERNACIONAL', ciclo: false, inicio: '2026-09-11', fin: '2026-09-12', lugar: 'Bogotá, Colombia', organismo: 'Federación Colombiana de Atletismo', paises: 8, sedes: ['Estadio El Campín'], gestor: { nombre: 'Julián Pardo', rol: 'Gestor de evento' }, descripcion: 'Reunión internacional de atletismo en pista.' },
    { code: 'centroamericanos-sd-2026', nombre: 'XXV Juegos Centroamericanos y del Caribe Santo Domingo 2026', alcance: 'INTERNACIONAL', ciclo: true, inicio: '2026-07-24', fin: '2026-08-08', lugar: 'Santo Domingo, República Dominicana', organismo: 'Comité Olímpico Colombiano', paises: 12, sedes: ['Estadio Olímpico Félix Sánchez'], gestor: { nombre: 'Verónica Alvarado', rol: 'Gestor de evento' }, descripcion: 'Juegos multideportivos de Centroamérica y el Caribe con delegación colombiana.' },
    { code: 'nacional-atletismo-2026', nombre: 'Campeonato Nacional de Atletismo', alcance: 'NACIONAL', ciclo: true, deportes: ['atletismo'], inicio: '2026-09-15', fin: '2026-09-20', lugar: 'Medellín, Antioquia', departamento: 'Antioquia', municipio: 'Medellín', organismo: 'Federación Colombiana de Atletismo', paises: 0, sedes: ['Estadio Atanasio Girardot'], gestor: { nombre: 'Laura Marcela Ortiz', rol: 'Gestor de evento' }, descripcion: 'Campeonato nacional de atletismo en pista con deportistas de las ligas departamentales.' },
    { code: 'nacional-voleibol-2026', nombre: 'Copa Nacional de Voleibol', alcance: 'NACIONAL', ciclo: false, deportes: ['voleibol'], inicio: '2026-10-12', fin: '2026-10-18', lugar: 'Cali, Valle del Cauca', departamento: 'Valle del Cauca', municipio: 'Cali', organismo: 'Federación Colombiana de Voleibol', paises: 0, sedes: ['Coliseo El Pueblo'], gestor: { nombre: 'Laura Marcela Ortiz', rol: 'Gestor de evento' }, descripcion: 'Copa nacional de voleibol por clubes y selecciones departamentales.' },
    { code: 'nacional-judo-2026', nombre: 'Torneo Nacional de Judo', alcance: 'NACIONAL', ciclo: false, deportes: ['judo'], inicio: '2026-09-04', fin: '2026-09-06', lugar: 'Bogotá, Cundinamarca', departamento: 'Cundinamarca', municipio: 'Bogotá', organismo: 'Federación Colombiana de Judo', paises: 0, sedes: ['Coliseo El Salitre'], gestor: { nombre: 'Andrés Felipe Mora', rol: 'Gestor de evento' }, descripcion: 'Torneo nacional de judo, categorías juvenil y mayores.' },
    { code: 'nacional-natacion-2026', nombre: 'Campeonato Nacional de Natación', alcance: 'NACIONAL', ciclo: true, deportes: ['natacion'], inicio: '2026-09-17', fin: '2026-09-21', lugar: 'Cali, Valle del Cauca', departamento: 'Valle del Cauca', municipio: 'Cali', organismo: 'Federación Colombiana de Natación', paises: 0, sedes: ['Piscinas Alberto Galindo'], gestor: { nombre: 'Camilo Restrepo', rol: 'Gestor de evento' }, descripcion: 'Campeonato nacional de natación en piscina olímpica.' }
  ];

  /* Evento real: mezcla los metadatos de OLC_REAL.evento sobre el stub (aceptando claves es/en). */
  function fusionarEventoReal() {
    var ev = EVENTOS[0], r = REAL && REAL.evento; if (!r) return;
    var f = r.facts || {};
    ev.nombre = r.nombre || r.name || ev.nombre;
    ev.inicio = r.inicio || f.start_date || ev.inicio;
    ev.fin = r.fin || f.end_date || ev.fin;
    ev.lugar = r.lugar || (f.venue_city ? f.venue_city + ', Colombia' : ev.lugar);
    ['organismo', 'gestor', 'descripcion', 'sedes', 'paises', 'ciclo'].forEach(function (k) { if (r[k] != null) ev[k] = r[k]; });
    if (r.olympic_cycle != null) ev.ciclo = !!r.olympic_cycle;
    if (r.hero_image_url) ev.imagen = r.hero_image_url;
    if (r.poster_image_url) ev.poster = r.poster_image_url;
  }
  fusionarEventoReal();

  /* Eventos creados desde la demo: viven en localStorage (por navegador), junto a los sintéticos. */
  var CLAVE_CREADOS = 'eventos.creados';
  try { JSON.parse(localStorage.getItem(CLAVE_CREADOS) || '[]').forEach(function (e) { EVENTOS.push(e); }); } catch (e) { /* sin almacenamiento */ }
  /* Ediciones (de eventos base y creados): se aplican al cargar; un valor null borra la clave. */
  var CLAVE_EDICIONES = 'eventos.ediciones';
  function aplicar(ev, patch) { Object.keys(patch).forEach(function (k) { if (patch[k] == null) delete ev[k]; else ev[k] = patch[k]; }); }
  try { var ED = JSON.parse(localStorage.getItem(CLAVE_EDICIONES) || '{}'); EVENTOS.forEach(function (e) { if (ED[e.code]) aplicar(e, ED[e.code]); }); } catch (e) { /* sin almacenamiento */ }
  function actualizarEvento(code, patch) {
    var ev = EVENTOS.filter(function (e) { return e.code === code; })[0]; if (!ev) return null;
    aplicar(ev, patch);
    delete cache[code]; // los datos derivados (pruebas, deportes, países) se regeneran con las fechas y deportes nuevos
    try { var ed = JSON.parse(localStorage.getItem(CLAVE_EDICIONES) || '{}'); ed[code] = Object.assign(ed[code] || {}, patch); localStorage.setItem(CLAVE_EDICIONES, JSON.stringify(ed)); } catch (e) { /* queda solo en memoria */ }
    return ev;
  }
  function crearEvento(ev) {
    ev.creado = true;
    EVENTOS.push(ev);
    try { var a = JSON.parse(localStorage.getItem(CLAVE_CREADOS) || '[]'); a.push(ev); localStorage.setItem(CLAVE_CREADOS, JSON.stringify(a)); } catch (e) { /* queda solo en memoria */ }
    return ev;
  }
  /* Borra todo lo que la demo guardó (eventos creados, cargas, metodólogos) menos el rol elegido. */
  function restablecer() {
    try { Object.keys(localStorage).filter(function (k) { return k.indexOf('eventos.') === 0 && k !== 'eventos.rol'; }).forEach(function (k) { localStorage.removeItem(k); }); } catch (e) { /* nada que borrar */ }
  }

  function estado(ev) {
    if (HOY < ev.inicio) return 'Próximo';
    if (HOY > ev.fin) return 'Finalizado';
    return 'En curso';
  }

  function sumarDias(iso, n) {
    var d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function diasEntre(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000); }

  var DIAS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MESES_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function fechaLarga(iso) { var d = new Date(iso + 'T12:00:00'); return DIAS_ES[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES_ES[d.getMonth()]; }
  function fechaCorta(iso) { var d = new Date(iso + 'T12:00:00'); return d.getDate() + ' ' + MESES_ES[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear(); }
  function diaCorto(iso) { var d = new Date(iso + 'T12:00:00'); return DIAS_ES[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + MESES_ES[d.getMonth()].slice(0, 3); }

  /* Marca monótona por puesto: la marca ordena igual que el puesto. t: menor es mejor; d/p/k: mayor es mejor. */
  function marcaBase(tipo, rnd) {
    if (tipo === 't') return 10 + rnd() * 3;
    if (tipo === 'd') return 7.6 + rnd() * 0.9;
    if (tipo === 'p') return 14.4 + rnd() * 1.2;
    if (tipo === 'k') return 110 + rnd() * 40;
    return 0;
  }
  function marca(tipo, base, i, rnd) {
    var j = rnd(), v, u;
    if (tipo === 't') { v = base + i * 0.07 + j * 0.03; u = ' s'; }
    else if (tipo === 'd') { v = base - i * 0.09 - j * 0.04; u = ' m'; }
    else if (tipo === 'p') { v = base - i * 0.15 - j * 0.06; u = ' pts'; }
    else if (tipo === 'k') { v = base - i * 3 - j * 1.2; u = ' kg'; }
    else return null;
    return v.toFixed(2).replace('.', ',') + u;
  }

  function medallaDe(puesto, estadoPrueba) {
    return estadoPrueba === 'Finalizado' && puesto >= 1 && puesto <= 3 ? ['Oro', 'Plata', 'Bronce'][puesto - 1] : null;
  }
  /* Solo la ronda que entrega medallas se pinta como medalla; el dato queda intacto para el medallero (DC-QA). */
  function rondaPremia(r) {
    r = String(r || '');
    var final = /(^|[\s,\-])final(es)?\b/i.test(r) && !/cuartos de final|octavos de final|semi/i.test(r);
    return !r || final || /medalla|\boro\b|bronce/i.test(r) || !/grupo|clasificaci|clasificator|preliminar|qualifier|semi|cuartos|octavos|serie|regata|carrera|ronda|round|combate|partido|eliminator|repechaje|heat|etapa/i.test(r);
  }
  function sumaMedallas(lista) {
    var m = { oro: 0, plata: 0, bronce: 0, total: 0 };
    lista.forEach(function (x) {
      var k = x && x.medalla && String(x.medalla).toLowerCase();
      if (m[k] != null && k !== 'total') { m[k]++; m.total++; }
    });
    return m;
  }
  function todosColombianos(pruebas) {
    var out = []; pruebas.forEach(function (p) { (p.colombianos || []).forEach(function (c) { out.push(c); }); }); return out;
  }

  /* Chip de la fila colapsada: el mejor colombiano si compite alguno (aunque quedara 5.º); si no, el ganador. */
  function calcularResumen(p) {
    var cols = p.colombianos || [], mejor = null;
    cols.forEach(function (c) {
      if (!mejor || (c.puesto != null && (mejor.puesto == null || c.puesto < mejor.puesto))) mejor = c;
    });
    if (mejor) return { deportista: mejor.deportista, pais: 'CO', marca: mejor.marca == null ? null : mejor.marca, medalla: mejor.medalla || null, colombiano: true };
    var g = p.filas && p.filas[0];
    if (p.estado !== 'Finalizado' || !g) return null;
    return { deportista: g.deportista, pais: g.pais, marca: g.marca == null ? null : g.marca, medalla: g.medalla || null, colombiano: false };
  }

  function esEquipo(nombre) { return /^(Relevo|Dobles|Torneo)/.test(nombre); }
  function sufijoEquipo(nombre) { return /^Relevo/.test(nombre) ? 'relevo' : /^Dobles/.test(nombre) ? 'dobles' : 'equipo'; }

  /* [puestos de los colombianos] por prueba; mezcla 0, 1 y 2 colombianos, dentro y fuera del top 3 / top 5. */
  var PATRONES = [[2], [3], [5], [1, 6], [7], [4, 8], [], [1], [6], [2, 4]];

  function generarPrueba(ev, d, p, sx, idx, dia, status, rnd, otros) {
    var equipo = esEquipo(p[0]), combate = !!COMBATE[d[0]] && !equipo && idx % 2 === 0;
    var pat = PATRONES[idx % PATRONES.length], cp = equipo ? pat.slice(0, 1) : pat.slice();
    var pr = { id: d[0] + '-' + idx, deporte: d[0], deporteNombre: d[1], nombre: p[0], fase: p[3], ronda: p[3], sexo: sx, sexoNombre: SEXO[sx], escenario: d[2], fecha: dia, estado: status, tipo: combate ? 'match' : 'ranking', tipoMarca: p[2], filas: [], colombianos: [], participa: false };
    var fin = status === 'Finalizado';
    function pickPais() { var o = otros[Math.floor(rnd() * otros.length)]; return rnd() < 0.3 ? otros[0] : o; }
    function colNombre(j) {
      if (equipo) return 'Colombia (' + sufijoEquipo(p[0]) + ')';
      return nombreDeportista('CO', sx, (hash(d[0] + sx) & 0xff) + idx + j * 5);
    }
    if (combate) {
      var hayCol = cp.length > 0, colGana = hayCol && cp[0] <= 1;
      var rival = pickPais(), rv = nombreDeportista(rival[0], sx, idx * 2 + 1);
      var colN = nombreDeportista('CO', sx, (hash(d[0] + sx) & 0xff) + idx);
      var lado = rnd() < 0.5, yo = { nombre: colN, pais: 'CO', paisNombre: 'Colombia' };
      var ot = { nombre: rv, pais: rival[0], paisNombre: rival[1] };
      if (!hayCol) { yo = { nombre: nombreDeportista(otros[1 % otros.length][0], sx, idx), pais: otros[1 % otros.length][0], paisNombre: otros[1 % otros.length][1] }; }
      var a = lado ? yo : ot, b = lado ? ot : yo;
      var gan = null, mk = null;
      if (fin) {
        gan = hayCol ? ((a === yo) === colGana ? 'a' : 'b') : (rnd() < 0.5 ? 'a' : 'b');
        var mm = MARCADOR[d[0]]; mk = mm[Math.floor(rnd() * mm.length)];
      }
      pr.match = { a: a, b: b, marcador: mk, ganador: gan };
      if (fin) {
        var w = gan === 'a' ? a : b, l = gan === 'a' ? b : a;
        pr.filas = [w, l].map(function (x, i) { return { puesto: i + 1, deportista: x.nombre, pais: x.pais, paisNombre: x.paisNombre, marca: null, medalla: medallaDe(i + 1, status) }; });
      }
      if (hayCol) {
        var pc = (a === yo ? 'a' : 'b') === gan ? 1 : 2;
        pr.colombianos = [{ puesto: fin ? pc : null, deportista: colN, marca: null, medalla: fin ? medallaDe(pc, status) : null }];
      }
    } else {
      var n = equipo ? 8 : 9, base = marcaBase(p[2], rnd);
      var porPuesto = {}; cp.forEach(function (pu, j) { porPuesto[pu] = j; });
      var usados = {};
      for (var i = 0; i < n; i++) {
        var pu2 = i + 1, esCol = porPuesto[pu2] != null, pais, nom;
        if (esCol) { pais = COLOMBIA; nom = colNombre(porPuesto[pu2]); }
        else {
          pais = pickPais();
          nom = equipo ? pais[1] + ' (' + sufijoEquipo(p[0]) + ')' : nombreDeportista(pais[0], sx, idx * 7 + i * 3);
          if (usados[nom]) nom = equipo ? nom : nombreDeportista(pais[0], sx, idx * 7 + i * 3 + 1);
        }
        usados[nom] = 1;
        var mk2 = fin ? marca(p[2], base, i, rnd) : null;
        pr.filas.push({ puesto: pu2, deportista: nom, pais: pais[0], paisNombre: pais[1], marca: mk2, medalla: medallaDe(pu2, status) });
        if (esCol) pr.colombianos[porPuesto[pu2]] = { puesto: pu2, deportista: nom, marca: mk2, medalla: medallaDe(pu2, status) };
      }
      pr.colombianos = pr.colombianos.filter(Boolean);
      if (!fin) {
        pr.filas = [];
        pr.colombianos = pr.colombianos.map(function (c) { return { puesto: null, deportista: c.deportista, marca: null, medalla: null }; });
      }
    }
    pr.participa = pr.colombianos.length > 0;
    pr.resumen = calcularResumen(pr);
    return pr;
  }

  /* Prueba real → forma común; lo posterior a HOY se degrada a Programado sin filas ni resultados. */
  function normalizarPruebaReal(r) {
    var p = Object.assign({}, r), futuro = p.fecha > HOY;
    p.escenario = p.escenario || '';
    p.fase = p.fase || p.ronda || ''; p.ronda = p.ronda || p.fase || '';
    p.tipo = p.tipo === 'match' ? 'match' : 'ranking';
    p.filas = (p.filas || []).map(function (f) { return Object.assign({}, f, { marca: f.marca == null ? null : f.marca, medalla: f.medalla || null }); });
    p.colombianos = (p.colombianos || []).map(function (c) { return Object.assign({}, c, { marca: c.marca == null ? null : c.marca, medalla: c.medalla || null }); });
    if (futuro || p.estado !== 'Finalizado') {
      p.estado = 'Programado'; p.filas = [];
      p.colombianos = p.colombianos.map(function (c) { return { puesto: null, deportista: c.deportista, marca: null, medalla: null }; });
      if (p.match) p.match = { a: p.match.a, b: p.match.b, marcador: null, ganador: null };
      p.resumen = null;
    }
    var premia = rondaPremia(p.ronda || p.fase);
    p.filas.forEach(function (f) { f.premia = premia; }); p.colombianos.forEach(function (c) { c.premia = premia; });
    p.participa = p.colombianos.length > 0;
    p.resumen = p.resumen && p.estado === 'Finalizado' ? p.resumen : calcularResumen(p);
    return p;
  }

  /* ---- Contrato de lectura (sin HTML) ---- */
  function filaDe(f, colombiano) {
    return { tipo: 'fila', puesto: f.puesto, deportista: f.deportista, pais: f.pais, paisNombre: f.paisNombre || NOMBRE_PAIS[f.pais] || f.pais, marca: f.marca == null ? null : f.marca, medalla: f.medalla || null, premia: f.premia, colombiano: colombiano };
  }
  function resultadoFilas(prueba, top) {
    if (!prueba) return [];
    if (prueba.tipo === 'match' && prueba.match) {
      var m = prueba.match;
      return [{ tipo: 'match', a: m.a, b: m.b, marcador: m.marcador, ganador: m.ganador, colombiano: m.a.pais === 'CO' || m.b.pais === 'CO' }];
    }
    var filas = prueba.filas || [];
    if (!filas.length) return [];
    var n = top || 3;
    var out = filas.slice(0, n).map(function (f) { return filaDe(f, f.pais === 'CO'); });
    var dentro = {}; out.forEach(function (f) { if (f.colombiano) dentro[f.deportista] = 1; });
    var fuera = (prueba.colombianos || []).filter(function (c) { return c.puesto != null && !dentro[c.deportista]; });
    if (fuera.length) {
      out.push({ tipo: 'separador' });
      fuera.forEach(function (c) {
        var f = filas.filter(function (x) { return x.deportista === c.deportista && x.puesto === c.puesto; })[0]
          || { puesto: c.puesto, deportista: c.deportista, pais: 'CO', paisNombre: 'Colombia', marca: c.marca, medalla: c.medalla };
        out.push(filaDe(f, true));
      });
    }
    return out;
  }
  function colombianoEtiqueta(prueba, c) {
    if (!c) return '';
    var t = c.deportista + ' · CO';
    if (c.puesto == null) return c.medalla && prueba && prueba.estado === 'Finalizado' ? t + ' · ' + c.medalla : t;
    t += ' · ' + c.puesto + '.º' + (c.marca ? ' · ' + c.marca : '');
    if (prueba && prueba.estado === 'En vivo') return t + ' · parcial';
    return c.medalla ? t + ' · ' + c.medalla : t;
  }
  function colombiaEtiqueta(prueba) {
    var cs = (prueba && prueba.colombianos) || [];
    if (!cs.length) return '';
    if (prueba.estado === 'Programado') {
      return cs.length === 1 ? '1 colombiano compite' : cs.length + ' colombianos compiten';
    }
    var l = cs.slice(0, 2).map(function (c) { return colombianoEtiqueta(prueba, c); }).join(' | ');
    return cs.length > 2 ? l + ' | +' + (cs.length - 2) : l;
  }
  function colombiaDia(data, iso) {
    var del = data.pruebas.filter(function (p) { return p.fecha === iso && p.participa; });
    return { compite: del.length, medallas: sumaMedallas(todosColombianos(del)) };
  }

  function paisNombre(iso2) { return iso2 ? (NOMBRE_PAIS[String(iso2).toUpperCase()] || (REAL && REAL.paisesNombres && REAL.paisesNombres[String(iso2).toUpperCase()]) || String(iso2).toUpperCase()) : ''; }
  /* Medalla <nao-award> sin cinta ni sombra. Edición única del ciclo olímpico: internacional (shared/awards.js). */
  var EDICION_MEDALLA = 'international';
  function medalla(metal, icono, size, extra) {
    return '<nao-award kind="medal" edition="' + EDICION_MEDALLA + '" metal="' + metal + '" icon="' + icono + '" size="' + size + '"' + (extra == null ? ' ribbon="false" shadow="false" animated="false"' : extra) + '></nao-award>';
  }

  /* Bandera de flagcdn.com (hotlink; no se descargan al repo). null si no es ISO-2. */
  function bandera(iso2, w) {
    if (typeof iso2 !== 'string' || !/^[A-Za-z]{2}$/.test(iso2)) return null;
    var c = iso2.toLowerCase(), a = w || 20;
    return { src: 'https://flagcdn.com/w' + a + '/' + c + '.png', srcset: 'https://flagcdn.com/w' + (a * 2) + '/' + c + '.png 2x' };
  }

  var cache = {};
  function datosDe(code) {
    if (cache[code]) return cache[code];
    var ev = EVENTOS.filter(function (e) { return e.code === code; })[0];
    if (!ev) return null;
    var est = estado(ev), real = !!(ev.real && REAL && REAL.pruebas);
    var pruebas = [], deportes, dias = [], i;
    var nacional = ev.alcance === 'NACIONAL';
    var paisesEv = nacional ? [COLOMBIA] : [COLOMBIA].concat(PAISES.slice(0, Math.max(1, Math.min(ev.paises, PAISES.length + 1) - 1)));

    if (real) {
      pruebas = REAL.pruebas.map(normalizarPruebaReal);
      var mapa = {}, orden = [];
      (REAL.deportes || []).forEach(function (d) {
        var c = d.codigo || d.code, nm = d.nombre || d.name; if (!c || mapa[c]) return;
        mapa[c] = { codigo: c, nombre: nm || c, escenario: d.escenario || '', pruebas: 0 }; orden.push(c);
      });
      pruebas.forEach(function (p) {
        if (!mapa[p.deporte]) { mapa[p.deporte] = { codigo: p.deporte, nombre: p.deporteNombre || p.deporte, escenario: '', pruebas: 0 }; orden.push(p.deporte); }
        mapa[p.deporte].pruebas++;
      });
      deportes = orden.map(function (c) { return mapa[c]; });
      var ds = (REAL.dias || []).map(function (x) { return typeof x === 'string' ? x : (x && (x.fecha || x.date)); }).filter(Boolean);
      if (ds.length) dias = ds.slice().sort();
      else for (i = 0; i <= diasEntre(ev.inicio, ev.fin); i++) dias.push(sumarDias(ev.inicio, i));
      var vistos = { CO: 1 }; paisesEv = [COLOMBIA];
      pruebas.forEach(function (p) { p.filas.forEach(function (f) { if (f.pais && !vistos[f.pais]) { vistos[f.pais] = 1; paisesEv.push([f.pais, f.paisNombre || NOMBRE_PAIS[f.pais] || f.pais]); } }); });
    } else {
      var seed = hash(ev.code), rnd = mulberry(seed), idx = 0;
      var otros = nacional ? [COLOMBIA, COLOMBIA] : paisesEv.slice(1), totalDias = diasEntre(ev.inicio, ev.fin) + 1;
      deportes = (ev.deportes ? DEPORTES.filter(function (d) { return ev.deportes.indexOf(d[0]) >= 0; }) : DEPORTES).map(function (d, si) {
        var count = 0;
        d[3].forEach(function (p) {
          (p[1] === 'FM' ? ['F', 'M'] : [p[1]]).forEach(function (sx) {
            var dia = sumarDias(ev.inicio, (idx * 7 + si * 3) % totalDias);
            var status = est === 'Finalizado' ? 'Finalizado' : est === 'Próximo' ? 'Programado'
              : (dia < HOY ? 'Finalizado' : dia === HOY ? ['Finalizado', 'Programado', 'Programado'][idx % 3] : 'Programado');
            pruebas.push(generarPrueba(ev, d, p, sx, idx, dia, status, rnd, otros));
            idx++; count++;
          });
        });
        return { codigo: d[0], nombre: d[1], escenario: d[2], pruebas: count };
      });
      for (i = 0; i < totalDias; i++) dias.push(sumarDias(ev.inicio, i));
    }

    /* Medallero por PAÍS (ISO-2): suma las medallas de las filas de cada prueba Finalizada. */
    function medallero(deporte) {
      var m = {};
      paisesEv.forEach(function (x) { m[x[0]] = { pais: x[0], paisNombre: x[1], oro: 0, plata: 0, bronce: 0, total: 0 }; });
      pruebas.forEach(function (p) {
        if (p.estado !== 'Finalizado' || (deporte && p.deporte !== deporte)) return;
        p.filas.forEach(function (f) {
          var k = f.medalla && f.medalla.toLowerCase(); if (!k || !f.pais) return; /* sin país no cuenta */
          var r = m[f.pais] || (m[f.pais] = { pais: f.pais, paisNombre: f.paisNombre || f.pais, oro: 0, plata: 0, bronce: 0, total: 0 });
          r[k]++; r.total++;
        });
        /* Medallas de colombianos que la fila no registra (p. ej. combates reales sin filas). */
        (p.colombianos || []).forEach(function (c) {
          var k = c.medalla && c.medalla.toLowerCase();
          if (!k || p.filas.some(function (f) { return f.deportista === c.deportista && f.medalla; })) return;
          var r = m.CO || (m.CO = { pais: 'CO', paisNombre: 'Colombia', oro: 0, plata: 0, bronce: 0, total: 0 });
          r[k]++; r.total++;
        });
      });
      return Object.keys(m).map(function (k) { return m[k]; }).filter(function (r) { return r.total > 0; })
        .sort(function (a, b) { return b.oro - a.oro || b.plata - a.plata || b.bronce - a.bronce || a.paisNombre.localeCompare(b.paisNombre); })
        .map(function (r, i) { r.pos = i + 1; return r; });
    }

    var nombres = {}, enPruebas = pruebas.filter(function (p) { return p.participa; });
    todosColombianos(pruebas).forEach(function (c) { if (c.deportista.indexOf('(') < 0) nombres[c.deportista] = 1; });
    var nDep = Object.keys(nombres).length;
    var med = sumaMedallas(todosColombianos(pruebas));
    var fila = medallero().filter(function (r) { return r.pais === 'CO'; })[0];
    var porDep = deportes.map(function (d) {
      var mm = sumaMedallas(todosColombianos(pruebas.filter(function (p) { return p.deporte === d.codigo; })));
      return { deporte: d.codigo, deporteNombre: d.nombre, oro: mm.oro, plata: mm.plata, bronce: mm.bronce, total: mm.total };
    }).filter(function (r) { return r.total > 0; }).sort(function (a, b) { return b.oro - a.oro || b.plata - a.plata || b.bronce - a.bronce || a.deporteNombre.localeCompare(b.deporteNombre); });
    var atletas = real && REAL.colombia && REAL.colombia.atletas != null ? REAL.colombia.atletas
      : (real ? nDep : Math.max(nDep, Math.round(nDep * 1.8)));
    var deDe = Math.max(real ? 0 : paisesEv.length, ev.paises || 0, paisesEv.length);
    /* porDeporte y atletas: expuestos, sin uso en la UI hasta que Jorge decida Medallería. */
    var colEvento = { medallas: med, posicion: med.total && fila ? fila.pos : null, de: med.total && fila ? deDe : null, deportistas: nDep, atletas: atletas, participa: enPruebas.length, porDeporte: porDep };

    return (cache[code] = { evento: ev, estado: est, colombia: colEvento, deportes: deportes, pruebas: pruebas, dias: dias, medallero: medallero, paises: paisesEv.map(function (x) { return { pais: x[0], paisNombre: x[1] }; }) });
  }

  window.OLC = {
    HOY: HOY, SEXO: SEXO, DIAS: DIAS_ES,
    eventos: function () { return EVENTOS.map(function (e) { var o = Object.assign({}, e); o.estado = estado(e); return o; }); },
    estado: estado, datosDe: datosDe, crearEvento: crearEvento, actualizarEvento: actualizarEvento, restablecer: restablecer,
    catalogoDeportes: function () { return DEPORTES.map(function (d) { return { codigo: d[0], nombre: d[1] }; }); },
    colombiaDia: colombiaDia, resultadoFilas: resultadoFilas, bandera: bandera, medalla: medalla, paisNombre: paisNombre, colombiaEtiqueta: colombiaEtiqueta, colombianoEtiqueta: colombianoEtiqueta,
    fechaLarga: fechaLarga, fechaCorta: fechaCorta, diaCorto: diaCorto
  };
  /* Solo se registra lo de Colombia: Deportes y Calendario reciben únicamente las pruebas con colombianos y sus deportes.
     Medallería sigue con el evento completo porque el medallero compara países. Se calcula una vez por evento. */
  var COL = {};
  window.OLC.soloColombia = function (data) {
    var k = data && data.evento && data.evento.code;
    if (!k) return data;
    if (COL[k] && COL[k].src === data) return COL[k].v;
    var pr = data.pruebas.filter(function (p) { return p.participa; }), cods = {}, v = {};
    pr.forEach(function (p) { cods[p.deporte] = 1; });
    Object.keys(data).forEach(function (x) { v[x] = data[x]; });
    v.pruebas = pr;
    v.deportes = (data.deportes || []).filter(function (d) { return cods[d.codigo]; });
    v.dias = (data.dias || []).filter(function (d) { return pr.some(function (p) { return p.fecha === d; }); });
    COL[k] = { src: data, v: v };
    return v;
  };
})();
