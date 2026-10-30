/* Crear y editar evento (solo quien tiene `crea`/`edita`; el alcance se fija al crear y no se puede editar).
   Formulario lineal en cinco secciones numeradas (tipo, datos básicos, alcance y lugar, detalles del tipo, gestor y descripción),
   con indicador de progreso, barra de acciones fija y resumen de errores solo tras intentar guardar. */
window.Crear = (function () {
  'use strict';
  var C = window.Campos, OLC = window.OLC, esc = C.esc;

  var DEPTOS = {
    'Antioquia': ['Medellín', 'Envigado', 'Rionegro'], 'Atlántico': ['Barranquilla', 'Soledad', 'Malambo'],
    'Bolívar': ['Cartagena', 'Magangué'], 'Caldas': ['Manizales'], 'Cundinamarca': ['Bogotá', 'Zipaquirá', 'Soacha'],
    'Santander': ['Bucaramanga', 'Floridablanca'], 'Tolima': ['Ibagué', 'Espinal'], 'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura']
  };
  var PAISES = ['CO', 'AR', 'BR', 'CL', 'PE', 'EC', 'VE', 'UY', 'PY', 'BO', 'MX', 'CU', 'DO', 'US', 'PA', 'CR', 'GT'];
  /* Cualquier perfil de la plataforma puede ser gestor; si aún no lo es, se le invita como gestor del evento. */
  var PERSONAS = [
    { nombre: 'Laura Marcela Ortiz', rol: 'Gestor de eventos', gestor: true }, { nombre: 'Andrés Felipe Mora', rol: 'Gestor de eventos', gestor: true },
    { nombre: 'Camilo Restrepo', rol: 'Gestor de eventos', gestor: true }, { nombre: 'Marcela Duarte', rol: 'Gestor de eventos', gestor: true },
    { nombre: 'Julián Pardo', rol: 'Gestor de eventos', gestor: true }, { nombre: 'Verónica Alvarado', rol: 'Gestor de eventos', gestor: true },
    { nombre: 'Ricardo Peña', rol: 'Usuario del módulo', gestor: false }, { nombre: 'Paulo Restrepo', rol: 'Comité Olímpico', gestor: false }
  ];

  /* Catálogo maestro de PR-03 §2 (Intercolegiados no es creable). El tipo de programa es campo de diseño por confirmar en el backend LITE.
     `breve` es la línea de la tarjeta; `ayuda` encabeza la sección de detalles. */
  var TIPOS = [
    { value: 'competitivo', label: 'Competitivo', icono: 'star', breve: 'Resultados, posiciones y medallería.', ayuda: 'Cierra con resultados, posiciones y medallería (oro, plata y bronce).' },
    { value: 'actividad_fisica', label: 'Actividad Física', icono: 'thunder', breve: 'Asistencia, sesiones y participación.', programas: ['Hábitos y Estilos de Vida Saludable (HEVS)', 'Vías Activas y Saludables (VAS)', 'Fuertemente Activos', 'Programa Nacional de Capacitación (PNC)'], formativo: true, ayuda: 'Cierra con asistencia, sesiones cumplidas, participación o aprobación formativa.' },
    { value: 'escolar', label: 'Deporte Escolar y Formativo', icono: 'bookmark', breve: 'Competitivo o formativo, según la modalidad.', programas: ['Jornada Deportiva Escolar Complementaria (JDEC)', 'Escuelas Deportivas para Todos'], modalidad: true, ayuda: 'Según la modalidad: resultados y medallería, o seguimiento formativo y asistencia.' },
    { value: 'social', label: 'Deporte Social Comunitario', icono: 'avatar', breve: 'Resultados y participación comunitaria.', programas: ['Juegos Nacionales Deportivos y Recreativos Comunales', 'Encuentros de Deporte Social', 'Programas Diferenciales e Inclusivos', 'Juegos Regionales Específicos'], modalidad: true, ayuda: 'Cierra con resultados competitivos, posiciones, medallería y participación comunitaria.' },
    { value: 'recreacion', label: 'Recreación', icono: 'sun', breve: 'Participación, formación lúdica y asistencia.', programas: ['Estrategias por Curso de Vida (Entremundos y demás)', 'Campamentos Juveniles', 'Nuevo Comienzo Otro Motivo para Vivir'], formativo: true, ayuda: 'Cierra con participación, niveles de formación lúdica o liderazgo, y asistencia.' }
  ];
  var OTRO = 'Otro programa';
  function tipoDef(v) { return TIPOS.filter(function (x) { return x.value === v; })[0]; }

  /* Secciones en orden; `grupo` son las claves de faltas() que la dejan pendiente. */
  var PASOS = [
    { id: 'cr-s-tipo', corto: 'Tipo', grupo: ['tipo'] },
    { id: 'cr-s-basicos', corto: 'Datos', grupo: ['nombre', 'inicio', 'fin'] },
    { id: 'cr-s-lugar', corto: 'Lugar', grupo: ['depto', 'muni', 'paises'] },
    { id: 'cr-s-detalles', corto: 'Detalles', grupo: ['programa', 'otro', 'modalidad', 'modulos', 'sesiones', 'evaluacion'] },
    { id: 'cr-s-gestor', corto: 'Gestor', grupo: ['gestor'] }
  ];
  var ETIQUETA = { tipo: 'Tipo de evento', programa: 'Programa estándar', otro: 'Nombre del programa', modalidad: 'Modalidad', modulos: 'Temáticas o módulos', sesiones: 'Número de sesiones', evaluacion: 'Evaluación',
    nombre: 'Nombre del evento', inicio: 'Fecha de inicio', fin: 'Fecha de fin', depto: 'Departamento', muni: 'Municipio', paises: 'Países', gestor: 'Gestor' };
  /* Id del contenedor de cada campo: sirve para llevar el foco desde el resumen de errores. */
  var DESTINO = { tipo: 'c-tipoev', programa: 'c-programa', otro: 'c-otro', modalidad: 'c-modalidad', modulos: 'c-modulos', sesiones: 'c-sesiones', evaluacion: 'c-evaluacion',
    nombre: 'c-nombre', inicio: 'c-ini', fin: 'c-fin', depto: 'c-depto', muni: 'c-muni', paises: 'c-paises', gestor: 'cr-gestor' };

  var AYUDA = { nombre: 'Debe ser distinto al de cualquier otro evento.', deportes: 'Déjalo vacío si es multideportivo.', modulos: 'Agrega al menos una con el botón Agregar.', sesiones: 'Número entero mayor que cero.' };
  var ERROR = { tipo: 'Elige el tipo de evento.', programa: 'Elige un programa.', otro: 'Escribe el nombre del programa.', modalidad: 'Elige la modalidad.', modulos: 'Agrega al menos una temática.', sesiones: 'Escribe un número entero mayor que cero.',
    evaluacion: 'Elige cómo se evalúa.', nombre: 'Escribe el nombre del evento.', inicio: 'Elige la fecha de inicio.', fin: 'Elige la fecha de fin.', depto: 'Elige un departamento.', muni: 'Elige un municipio.', paises: 'Elige al menos un país.', gestor: 'Elige quién será el gestor.' };
  function ayuda(k) { return AYUDA[k] ? { description: AYUDA[k] } : undefined; }

  function slug(t) { return OLC.claveNombre(t).slice(0, 48).replace(/-+$/, ''); }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Grupo de radios nativos con estilo de tarjeta (lista) o de segmento. Devuelve el elemento y un setter de error. */
  var seq = 0;
  function radios(o) {
    var name = 'cr-r' + (++seq), box = document.createElement('div');
    box.innerHTML = '<div class="cr-opts cr-opts--' + o.forma + '" role="radiogroup" aria-label="' + esc(o.etiqueta) + '">' + o.items.map(function (i) {
      return '<label class="cr-opt"><input type="radio" name="' + name + '" value="' + esc(i.value) + '"' + (i.value === o.value ? ' checked' : '') + '>' +
        '<span class="cr-opt__box">' + (i.icono ? '<span class="cr-opt__ico">' + o.icon(i.icono) + '</span>' : '') +
        '<span class="cr-opt__txt"><span class="cr-opt__t nwt-smalltext-font-bold">' + esc(i.label) + '</span><span class="cr-opt__d">' + esc(i.desc || '') + '</span></span><span class="cr-opt__dot" aria-hidden="true"></span></span></label>';
    }).join('') + '</div><p class="cr-msg" hidden>' + esc(o.error || '') + '</p>';
    var grupo = box.firstChild, msg = box.lastChild;
    grupo.addEventListener('change', function (e) { if (e.target && e.target.checked) o.onChange(e.target.value); });
    return { el: box, set error(v) { grupo.classList.toggle('is-error', !!v); msg.hidden = !v; } };
  }

  function seccion(id, titulo, ayuda, cuerpo) {
    return '<section class="cr-card" id="' + id + '" aria-labelledby="' + id + '-t"><header class="cr-card__h"><span class="cr-num" aria-hidden="true"></span>' +
      '<div><h2 class="nwt-subtitle-font-bold" id="' + id + '-t">' + titulo + '</h2><p class="nwt-caption-font-regular" id="' + id + '-a">' + ayuda + '</p></div></header>' +
      '<div class="cr-body">' + cuerpo + '</div></section>';
  }

  function render(main, ctx) {
    /* Defensa del deep link: solo se edita el origen que crea el rol. */
    if (ctx.evento && !window.ROLES.puedeEditar(ctx.evento)) { main.innerHTML = '<div class="nws-page"><div class="nws-empty nws-empty--page"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">Editar evento no está disponible</h1><a class="nws-btn" href="#/eventos">Volver a eventos</a></div></div>'; return; }
    var s = { alcance: 'NACIONAL', nombre: '', inicio: undefined, fin: undefined, depto: '', muni: '', paises: [], sedes: [], descripcion: '', ciclo: window.ROLES.rol.crea === 'coc', deportes: [], gestor: '', tipo: '', programa: '', otro: '', modalidad: '', modulos: [], sesiones: '', evaluacion: '' };
    var campos = {}, intentado = false, E = ctx.evento, editar = !!E;
    /* El coc no aplica a la demo con roles SUID: queda competitivo, sin selector de tipo. */
    var esCoc = editar && OLC.tipoDe(E) === 'coc';
    if (editar) {
      s.tipo = E.tipo_programa || 'competitivo'; s.modalidad = E.modalidad || ''; s.modulos = (E.modulos || []).slice(); s.sesiones = E.sesiones ? String(E.sesiones) : ''; s.evaluacion = E.evaluacion || '';
      var pe = E.programa_estandar || '', td = tipoDef(s.tipo); if (pe) { if (td && td.programas && td.programas.indexOf(pe) >= 0) s.programa = pe; else { s.programa = OTRO; s.otro = pe; } }
      s.alcance = E.alcance || 'INTERNACIONAL'; s.nombre = E.nombre; s.inicio = new Date(E.inicio + 'T12:00:00'); s.fin = new Date(E.fin + 'T12:00:00');
      s.depto = E.departamento || ''; s.muni = E.municipio || ''; s.paises = (E.paisesCodigos || []).slice(); s.sedes = (E.sedes || []).slice();
      s.descripcion = E.descripcion || ''; s.ciclo = !!E.ciclo; s.deportes = (E.deportes || []).slice(); s.gestor = E.gestor ? E.gestor.nombre : '';
      if (s.gestor && !PERSONAS.some(function (x) { return x.nombre === s.gestor; })) PERSONAS.push({ nombre: s.gestor, rol: 'Gestor de eventos', gestor: true });
    }
    var volver = editar ? '#/eventos/' + encodeURIComponent(E.code) : '#/eventos';
    var coc = window.ROLES.rol.crea === 'coc';

    main.innerHTML = '<div class="nws-page cr">' +
      '<a class="nws-iconbtn nws-iconbtn--lg nws-event-detail__back" href="' + volver + '" aria-label="Volver">' + ctx.icon('arrow-left') + '<span class="nws-event-detail__back-label">Volver</span></a>' +
      '<div class="cr-head"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">' + (editar ? 'Editar evento' : 'Crear evento') + '</h1>' +
      '<small class="nwt-smalltext-font-regular">' + (editar ? 'Cambia los datos, las fechas, el lugar o el gestor. El alcance no se puede cambiar.' : 'Completa las secciones de arriba abajo; al final se asigna un gestor.') + ' Los campos con * son obligatorios.</small></div>' +
      (coc ? '<p class="cr-note nwt-smalltext-font-medium" id="c-ciclo-info">' + ctx.icon('info') + '<span>' + (editar ? 'Este es un evento del Ciclo Olímpico.' : 'Este evento se crea como evento del Ciclo Olímpico.') + '</span></p>' : '') +
      '<nav class="cr-steps" aria-label="Progreso del formulario"><p class="cr-steps__sum nwt-caption-font-medium" id="cr-sum"></p><ol id="cr-steps"></ol><div class="cr-steps__bar" aria-hidden="true"><i id="cr-bar"></i></div></nav>' +
      seccion('cr-s-tipo', 'Tipo de evento', 'Define cómo cierra el evento y qué datos pide el formulario.', '<div id="c-tipoev"></div>') +
      seccion('cr-s-basicos', 'Datos básicos', 'Nombre y fechas. El nombre no puede repetir el de otro evento.', '<div class="cr-grid" id="cr-grid"></div>') +
      seccion('cr-s-lugar', 'Alcance y lugar', editar ? 'El alcance se fijó al crear y no se puede cambiar.' : 'El alcance se fija al crear y no podrá cambiarse después.', '<div id="cr-alcance"></div><div class="cr-body" id="cr-lugar"></div>') +
      seccion('cr-s-detalles', 'Detalles del tipo', '', '<div class="cr-grid" id="cr-tipo-grid"></div>') +
      seccion('cr-s-gestor', 'Gestor y descripción', 'El gestor cargará inscripciones, resultados y medallería de este evento.', '<div id="cr-gestor"></div><p class="nwt-caption-font-regular cr-hint" id="cr-invita" hidden></p><div id="c-desc"></div>') +
      '<div class="cr-err cr-errbox" id="cr-err" role="alert" hidden></div>' +
      '<footer class="cr-foot"><p class="cr-foot__msg nwt-caption-font-regular" id="cr-resumen"></p><div class="cr-actions" id="cr-actions"></div></footer></div>';

    var $grid = document.getElementById('cr-grid'), $tipoSec = document.getElementById('cr-s-tipo'), $detSec = document.getElementById('cr-s-detalles');
    function col(id, full) { var d = document.createElement('div'); d.id = id; d.className = full ? 'cr-full' : ''; return d; }
    function chips(ul, lista, nombre, alQuitar) {
      ul.innerHTML = lista.map(function (x, i) { return '<li class="cr-chip">' + esc(nombre(x)) + '<button type="button" data-q="' + i + '" aria-label="Quitar ' + esc(nombre(x)) + '">' + ctx.icon('close') + '</button></li>'; }).join('');
      ul.querySelectorAll('[data-q]').forEach(function (b) { b.addEventListener('click', function () { alQuitar(+b.getAttribute('data-q')); }); });
    }

    /* Campos básicos: se crean una vez; el lugar sí se reconstruye al cambiar el alcance. */
    var nombre = col('c-nombre', true), ini = col('c-ini'), fin = col('c-fin');
    campos.nombre = C.mk('nwt-text-field', { label: 'Nombre del evento', placeholder: 'Ej. Copa Nacional de Atletismo 2026', required: true, value: s.nombre, nwtSize: 'large', message: ayuda('nombre') }, function (v) { s.nombre = String(v || ''); validar(); });
    campos.inicio = C.mk('nwt-date-field', { label: 'Fecha de inicio', required: true, value: s.inicio }, function (v) { s.inicio = v; if (s.fin && v && s.fin <= v) { s.fin = undefined; campos.fin.value = undefined; } campos.fin.min = v ? new Date(v.getTime() + 864e5) : undefined; validar(); });
    campos.fin = C.mk('nwt-date-field', { label: 'Fecha de fin', required: true, value: s.fin, disabled: false, min: s.inicio ? new Date(s.inicio.getTime() + 864e5) : undefined }, function (v) { s.fin = v; validar(); });
    nombre.appendChild(campos.nombre); ini.appendChild(campos.inicio); fin.appendChild(campos.fin);
    $grid.appendChild(nombre); $grid.appendChild(ini); $grid.appendChild(fin);

    /* Tipo de evento: tarjetas seleccionables (radios nativos, con flechas de teclado). */
    campos.tipo = radios({ forma: 'lista', etiqueta: 'Tipo de evento', icon: ctx.icon, value: s.tipo, error: 'Elige el tipo de evento.',
      items: TIPOS.map(function (x) { return { value: x.value, label: x.label, desc: x.breve, icono: x.icono }; }),
      onChange: function (v) { if (v === s.tipo) return; s.tipo = v; s.programa = ''; s.otro = ''; s.modalidad = ''; s.modulos = []; s.sesiones = ''; s.evaluacion = ''; s.deportes = []; dibujarTipo(); validar(); } });
    document.getElementById('c-tipoev').appendChild(campos.tipo.el);
    if (esCoc) $tipoSec.hidden = true;

    /* Lugar según alcance: nacional pide departamento y municipio; internacional, países y sedes. */
    function dibujarLugar() {
      var $l = document.getElementById('cr-lugar'); $l.innerHTML = '';
      ['depto', 'muni', 'paises'].forEach(function (k) { delete campos[k]; });
      var nac = s.alcance === 'NACIONAL', g = document.createElement('div'); g.className = 'cr-grid';
      if (!nac) {
        var al = document.createElement('div'); al.innerHTML = '<div class="nws-flash nws-flash--info" role="note"><span>Evento <b>internacional</b>: se hace seguimiento a los deportistas de Colombia. El lugar se indica con el país o países y las sedes; los rivales se registran en los resultados.</span></div>';
        $l.appendChild(al.firstChild);
      }
      $l.appendChild(g);
      if (nac) {
        var d = col('c-depto'), m = col('c-muni');
        campos.depto = C.mk('nwt-dropdown', { label: 'Departamento', required: true, placeholder: 'Selecciona', options: C.opciones(Object.keys(DEPTOS)), value: s.depto || undefined, nwtSize: 'large' }, function (v) {
          s.depto = v || ''; s.muni = ''; campos.muni.options = C.opciones(DEPTOS[s.depto] || []); campos.muni.value = undefined; campos.muni.disabled = !s.depto; validar();
        });
        campos.muni = C.mk('nwt-dropdown', { label: 'Municipio', required: true, placeholder: 'Selecciona', options: C.opciones(DEPTOS[s.depto] || []), value: s.muni || undefined, disabled: !s.depto, nwtSize: 'large' }, function (v) { s.muni = v || ''; validar(); });
        d.appendChild(campos.depto); m.appendChild(campos.muni); g.appendChild(d); g.appendChild(m);
      } else {
        var p = col('c-paises', true), sd = col('c-sedes', true);
        campos.paises = C.mk('nwt-dropdown', { label: 'Países', required: true, placeholder: 'Selecciona uno o varios', multiple: true, options: C.opciones(PAISES.map(function (c) { return { value: c, label: OLC.paisNombre(c) }; })), value: s.paises, nwtSize: 'large' }, function (v) { s.paises = v || []; pintarPaises(); validar(); });
        p.appendChild(campos.paises); p.insertAdjacentHTML('beforeend', '<ul class="cr-chips" id="cr-paises-ul" aria-label="Países elegidos"></ul>');
        sd.innerHTML = '<div class="cr-sedes"><div class="cr-sedes__in" id="cr-sedes-in"></div><ul class="cr-chips" id="cr-sedes-ul" aria-label="Sedes agregadas"></ul></div>';
        g.appendChild(p); g.appendChild(sd);
        var inp = C.mk('nwt-text-field', { label: 'Sedes (opcional)', placeholder: 'Ej. Estadio Metropolitano', nwtSize: 'large' }, function (v) { inp.value = v; });
        var add = C.mk('nwt-button', { nwtVariant: 'mute', nwtSize: 'large' });
        add.textContent = 'Agregar sede';
        function pintarSedes() { chips(document.getElementById('cr-sedes-ul'), s.sedes, String, function (i) { s.sedes.splice(i, 1); pintarSedes(); refrescar(); }); }
        add.addEventListener('click', function () { var t = String(inp.value || '').trim(); if (t && s.sedes.indexOf(t) < 0) { s.sedes.push(t); inp.value = ''; pintarSedes(); } });
        document.getElementById('cr-sedes-in').appendChild(inp); document.getElementById('cr-sedes-in').appendChild(add); pintarSedes(); pintarPaises();
      }
    }
    /* Chips quitables de los países: el selector queda sincronizado con ellos. */
    function pintarPaises() {
      var ul = document.getElementById('cr-paises-ul'); if (!ul) return;
      chips(ul, s.paises, function (c) { return OLC.paisNombre(c); }, function (i) { s.paises.splice(i, 1); campos.paises.value = s.paises.slice(); pintarPaises(); validar(); refrescar(); });
    }

    /* Detalles del tipo: se reconstruyen al cambiar de tipo y solo traen los campos que ese tipo pide. */
    function dibujarTipo() {
      var g = document.getElementById('cr-tipo-grid'); g.innerHTML = '';
      ['programa', 'otro', 'modalidad', 'deportes', 'modulos', 'sesiones', 'evaluacion'].forEach(function (k) { delete campos[k]; });
      var td = tipoDef(s.tipo); $detSec.hidden = !td; numerar();
      if (!td) return;
      document.getElementById('cr-s-detalles-a').textContent = td.label + '. ' + td.ayuda;
      if (td.programas) {
        var cp = col('c-programa', true);
        campos.programa = C.mk('nwt-dropdown', { label: 'Programa estándar', required: true, placeholder: 'Selecciona', options: C.opciones(td.programas.concat([OTRO])), value: s.programa || undefined, nwtSize: 'large' }, function (v) {
          s.programa = v || ''; if (s.programa !== OTRO) s.otro = ''; dibujarOtro(); validar();
        });
        cp.appendChild(campos.programa); g.appendChild(cp);
        var co = col('c-otro', true); co.id = 'c-otro'; g.appendChild(co); dibujarOtro();
      }
      if (td.modalidad) {
        var cm = col('c-modalidad', true), lb = document.createElement('span'); lb.className = 'nwt-smalltext-font-medium cr-lbl'; lb.textContent = 'Modalidad *';
        campos.modalidad = radios({ forma: 'seg', etiqueta: 'Modalidad', icon: ctx.icon, value: s.modalidad, error: 'Elige la modalidad.',
          items: [{ value: 'competitiva', label: 'Competitiva', desc: 'Resultados y medallería' }, { value: 'formativa', label: 'Formativa', desc: 'Seguimiento por asistencia' }],
          onChange: function (v) { if (!v || v === s.modalidad) return; s.modalidad = v; s.deportes = []; dibujarTipo(); validar(); } });
        cm.appendChild(lb); cm.appendChild(campos.modalidad.el); g.appendChild(cm);
      }
      var conDeportes = s.tipo === 'competitivo' || (td.modalidad && s.modalidad === 'competitiva');
      var formativo = td.formativo || (td.modalidad && s.modalidad === 'formativa');
      if (conDeportes) {
        var dep = col('c-deportes', true);
        campos.deportes = C.mk('nwt-dropdown', { label: 'Deportes (opcional)', placeholder: 'Sin elegir = evento multideportivo', multiple: true, options: C.opciones(OLC.catalogoDeportes().map(function (x) { return { value: x.codigo, label: x.nombre }; })), value: s.deportes, nwtSize: 'large', message: ayuda('deportes') }, function (v) { s.deportes = v || []; });
        dep.appendChild(campos.deportes); g.appendChild(dep);
      }
      if (td.formativo) {
        var cmod = col('c-modulos', true);
        cmod.innerHTML = '<div class="cr-sedes"><div class="cr-sedes__in" id="cr-mod-in"></div><ul class="cr-chips" id="cr-mod-ul" aria-label="Temáticas o módulos agregados"></ul></div>';
        g.appendChild(cmod);
        var inp = C.mk('nwt-text-field', { label: 'Temáticas o módulos', placeholder: 'Ej. Alimentación saludable', required: true, nwtSize: 'large', message: ayuda('modulos') }, function (v) { inp.value = v; });
        var add = C.mk('nwt-button', { nwtVariant: 'mute', nwtSize: 'large' }); add.textContent = 'Agregar';
        campos.modulos = inp;
        function pintarMod() { chips(document.getElementById('cr-mod-ul'), s.modulos, String, function (i) { s.modulos.splice(i, 1); pintarMod(); validar(); refrescar(); }); }
        add.addEventListener('click', function () { var t = String(inp.value || '').trim(); if (t && s.modulos.indexOf(t) < 0) { s.modulos.push(t); inp.value = ''; pintarMod(); validar(); } });
        document.getElementById('cr-mod-in').appendChild(inp); document.getElementById('cr-mod-in').appendChild(add); pintarMod();
        var cs = col('c-sesiones'), ce = col('c-evaluacion');
        campos.sesiones = C.mk('nwt-text-field', { label: 'Número de sesiones', placeholder: 'Ej. 12', required: true, value: s.sesiones, nwtSize: 'large', message: ayuda('sesiones') }, function (v) { s.sesiones = String(v || '').trim(); validar(); });
        campos.evaluacion = C.mk('nwt-dropdown', { label: 'Evaluación', required: true, placeholder: 'Selecciona', options: C.opciones([{ value: 'asistencia', label: 'Por asistencia' }, { value: 'aprobacion', label: 'Por aprobación' }]), value: s.evaluacion || undefined, nwtSize: 'large' }, function (v) { s.evaluacion = v || ''; validar(); });
        cs.appendChild(campos.sesiones); ce.appendChild(campos.evaluacion); g.appendChild(cs); g.appendChild(ce);
      }
      if (formativo && !td.formativo) {
        var cf = col('c-formativa', true); cf.innerHTML = '<p class="nwt-caption-font-regular cr-hint">Modalidad formativa: el seguimiento se hace por asistencia, sin resultados ni medallería.</p>'; g.appendChild(cf);
      }
    }
    function dibujarOtro() {
      var co = document.getElementById('c-otro'); if (!co) return; co.innerHTML = ''; delete campos.otro;
      if (s.programa !== OTRO) return;
      campos.otro = C.mk('nwt-text-field', { label: 'Nombre del programa', placeholder: 'Escribe el nombre del programa', required: true, value: s.otro, nwtSize: 'large' }, function (v) { s.otro = String(v || ''); validar(); });
      co.appendChild(campos.otro);
    }

    /* Nombre único entre todos los tipos: evita duplicar un FULL como JIN. Al editar se excluye el propio. */
    function clave(t) { return OLC.claveNombre(t); }
    function duplicado() {
      var k = clave(s.nombre); if (!k) return null;
      return OLC.eventos().filter(function (x) { return (!editar || x.code !== E.code) && clave(x.nombre) === k; })[0] || null;
    }
    var MSG_BASE = 'Revisa los campos marcados: faltan datos o hay fechas inconsistentes.';
    function msgDuplicado(x) {
      return 'Ya existe un evento con un nombre similar: ' + x.nombre + '.' + (OLC.tipoDe(x) === 'full' ? ' Es un evento completo administrado en otro sistema.' : '');
    }

    function faltas() {
      var f = [], td = tipoDef(s.tipo);
      if (esCoc) { /* sin selector de tipo */ } else if (!td) f.push('tipo');
      else {
        if (td.programas && (!s.programa || (s.programa === OTRO && !s.otro.trim()))) f.push(s.programa === OTRO ? 'otro' : 'programa');
        if (td.modalidad && !s.modalidad) f.push('modalidad');
        if (td.formativo) {
          if (!s.modulos.length) f.push('modulos');
          if (!/^[1-9]\d*$/.test(s.sesiones)) f.push('sesiones');
          if (!s.evaluacion) f.push('evaluacion');
        }
      }
      if (!s.nombre.trim() || duplicado()) f.push('nombre');
      if (!s.inicio) f.push('inicio');
      if (!s.fin || (s.inicio && s.fin <= s.inicio)) f.push('fin');
      if (s.alcance === 'NACIONAL') { if (!s.depto) f.push('depto'); if (!s.muni) f.push('muni'); } else if (!s.paises.length) f.push('paises');
      if (!s.gestor) f.push('gestor');
      return f;
    }
    /* Los errores solo se pintan después de un intento de guardar: no se grita mientras se escribe. */
    var ultimoResumen = '';
    /* Mensaje junto al campo: la ayuda siempre; el error solo tras intentar guardar. Los date-field lo piden como errorMessage. */
    function mensajes() {
      var f = intentado ? faltas() : [], dup = duplicado();
      Object.keys(ETIQUETA).forEach(function (k) {
        var c = campos[k]; if (!c) return; var e = f.indexOf(k) >= 0; c.error = e;
        var txt = k === 'nombre' && dup ? 'Ya existe un evento con un nombre similar.' : k === 'fin' && s.fin ? 'Debe ser posterior a la fecha de inicio.' : ERROR[k];
        if (c.localName === 'nwt-date-field') c.errorMessage = e ? txt : '';
        else if (c.localName) c.message = e ? { description: txt } : ayuda(k);
      });
    }
    function validar() {
      if (!intentado) return;
      mensajes(); var f = faltas(), dup = duplicado();
      var eb = document.getElementById('cr-err'), html = f.length ? '<p class="nwt-smalltext-font-bold">' + esc(dup ? msgDuplicado(dup) : MSG_BASE) + '</p><ul>' +
        f.map(function (k) { return '<li><button type="button" data-k="' + k + '">' + ETIQUETA[k] + '</button></li>'; }).join('') + '</ul>' : '';
      if (html !== ultimoResumen) { eb.innerHTML = html; ultimoResumen = html; }
      eb.hidden = !f.length;
    }
    /* Del resumen al campo: se lleva a la vista y el foco al primer control. */
    document.getElementById('cr-err').addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-k]'); if (!b) return;
      var el = document.getElementById(DESTINO[b.getAttribute('data-k')]); if (!el) return;
      el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      var c = el.querySelector('input:not([type=hidden]),textarea,button,[tabindex="0"]'); if (c) c.focus({ preventScroll: true });
    });

    /* Numeración y progreso: solo cuentan las secciones visibles; se actualiza al cambiar cualquier campo. */
    function visibles() { return PASOS.filter(function (p) { var e = document.getElementById(p.id); return e && !e.hidden; }); }
    function numerar() {
      var vis = visibles();
      PASOS.forEach(function (p) { var n = document.querySelector('#' + p.id + ' .cr-num'); if (n) n.textContent = String(vis.indexOf(p) + 1); });
      document.getElementById('cr-steps').innerHTML = vis.map(function (p, i) {
        return '<li><button type="button" class="cr-step" data-s="' + p.id + '"><span class="cr-step__dot" aria-hidden="true">' + (i + 1) + '</span><span class="cr-step__t">' + p.corto + '<span class="nws-sr"></span></span></button></li>';
      }).join('');
      document.querySelectorAll('#cr-steps [data-s]').forEach(function (b) { b.addEventListener('click', function () {
        var sec = document.getElementById(b.getAttribute('data-s')); sec.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
        var c = sec.querySelector('input:not([type=hidden]),textarea,button:not([data-q])'); if (c) c.focus({ preventScroll: true });
      }); });
      progreso();
    }
    function progreso() {
      if (!document.getElementById('cr-steps')) return; /* el timeout llega tras salir de la vista */
      var f = faltas(), vis = visibles(), hechos = 0;
      vis.forEach(function (p, i) {
        var ok = !p.grupo.some(function (k) { return f.indexOf(k) >= 0; }); if (ok) hechos++;
        var b = document.querySelector('#cr-steps [data-s="' + p.id + '"]'); if (!b) return;
        b.classList.toggle('is-done', ok); b.querySelector('.cr-step__dot').innerHTML = ok ? ctx.icon('positive') : String(i + 1);
        b.querySelector('.nws-sr').textContent = ok ? ' (completa)' : ' (pendiente)';
      });
      document.getElementById('cr-sum').textContent = hechos + ' de ' + vis.length + ' secciones completas';
      document.getElementById('cr-bar').style.width = (vis.length ? Math.round(hechos / vis.length * 100) : 0) + '%';
      var r = document.getElementById('cr-resumen'), n = f.length;
      r.innerHTML = n ? '<b>Falta:</b> ' + f.slice(0, 3).map(function (k) { return esc(ETIQUETA[k]); }).join(', ') + (n > 3 ? ' y ' + (n - 3) + (n - 3 === 1 ? ' más' : ' más') : '') + '.' : '<b>Todo listo.</b> ' + (editar ? 'Puedes guardar los cambios.' : 'Puedes crear el evento.');
    }

    if (editar) {
      document.getElementById('cr-alcance').innerHTML = '<span class="cr-fijo nwt-smalltext-font-bold">' + (s.alcance === 'NACIONAL' ? 'Nacional' : 'Internacional') + '</span>';
    } else {
      campos.alcance = radios({ forma: 'seg', etiqueta: 'Alcance del evento', icon: ctx.icon, value: s.alcance,
        items: [{ value: 'NACIONAL', label: 'Nacional', desc: 'Departamento y municipio' }, { value: 'INTERNACIONAL', label: 'Internacional', desc: 'Países y sedes' }],
        onChange: function (v) { if (v && v !== s.alcance) { s.alcance = v; dibujarLugar(); } } });
      document.getElementById('cr-alcance').appendChild(campos.alcance.el);
    }

    campos.gestor = C.mk('nwt-dropdown', { label: 'Asignar a', required: true, placeholder: 'Selecciona una persona', value: s.gestor || undefined, options: PERSONAS.map(function (p) { return { key: p.nombre.toLowerCase(), label: p.nombre + ' · ' + p.rol, value: p.nombre }; }), nwtSize: 'large' }, function (v) {
      s.gestor = v || ''; var p = PERSONAS.filter(function (x) { return x.nombre === s.gestor; })[0], h = document.getElementById('cr-invita');
      h.hidden = !p || p.gestor; h.textContent = p && !p.gestor ? p.nombre + ' aún no es gestor: se le invitará como gestor de este evento. Podrás reasignarlo más adelante.' : ''; validar();
    });
    document.getElementById('cr-gestor').appendChild(campos.gestor);
    campos.descripcion = C.mk('nwt-text-area', { label: 'Descripción', placeholder: 'Resumen del evento, alcance y notas…', rows: 3, value: s.descripcion }, function (v) { s.descripcion = String(v || ''); });
    document.getElementById('c-desc').appendChild(campos.descripcion);

    var cancelar = C.mk('nwt-button', { nwtVariant: 'mute' }); cancelar.textContent = 'Cancelar'; cancelar.addEventListener('click', function () { location.hash = volver; });
    var guardar = C.mk('nwt-button', { nwtVariant: 'loud' }); guardar.textContent = editar ? 'Guardar cambios' : 'Crear evento';
    /* Solo viaja lo del tipo elegido; null borra lo que dejó un tipo anterior al editar. */
    function tipoDatos() {
      var td = tipoDef(s.tipo), form = !!(td && td.formativo);
      return { tipo_programa: s.tipo, programa_estandar: td && td.programas ? (s.programa === OTRO ? s.otro.trim() : s.programa) : null, modalidad: td && td.modalidad ? s.modalidad : null,
        modulos: form ? s.modulos.slice() : null, sesiones: form ? parseInt(s.sesiones, 10) : null, evaluacion: form ? s.evaluacion : null };
    }
    guardar.addEventListener('click', function () {
      intentado = true; var f = faltas(); validar();
      if (f.length) { var h1 = document.getElementById('cr-err'); if (h1) h1.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); return; }
      var nac = s.alcance === 'NACIONAL', persona = PERSONAS.filter(function (x) { return x.nombre === s.gestor; })[0] || { nombre: s.gestor };
      var lugarPaises = s.paises.map(function (c) { return OLC.paisNombre(c); }).join(', ');
      if (editar) {
        var patch = { nombre: s.nombre.trim(), inicio: C.iso(s.inicio), fin: C.iso(s.fin), descripcion: s.descripcion.trim(), ciclo: s.ciclo,
          gestor: { nombre: persona.nombre, rol: E.gestor && E.gestor.nombre === persona.nombre ? E.gestor.rol : 'Gestor de evento' }, deportes: s.deportes.length ? s.deportes.slice() : null };
        if (!esCoc) Object.assign(patch, tipoDatos());
        if (nac) { patch.lugar = s.muni + ', ' + s.depto; patch.departamento = s.depto; patch.municipio = s.muni; }
        else { patch.sedes = s.sedes.slice(); patch.paisesCodigos = s.paises.slice(); patch.paises = s.paises.length; patch.lugar = lugarPaises; }
        OLC.actualizarEvento(E.code, patch); ctx.onSaved(E.code); return;
      }
      var code = slug(s.nombre) + '-' + Math.random().toString(36).slice(2, 6);
      var ev = {
        code: code, event_type: 'LITE', nombre: s.nombre.trim(), alcance: s.alcance, ciclo: s.ciclo, inicio: C.iso(s.inicio), fin: C.iso(s.fin),
        lugar: nac ? s.muni + ', ' + s.depto : lugarPaises, paisesCodigos: nac ? undefined : s.paises.slice(),
        organismo: 'Comité Olímpico Colombiano', paises: nac ? 0 : s.paises.length, sedes: nac ? [s.muni ? 'Sede por definir' : ''].filter(Boolean).slice(0, 0) : s.sedes.slice(),
        gestor: { nombre: persona.nombre, rol: 'Gestor de evento' }, descripcion: s.descripcion.trim()
      };
      if (nac) { ev.departamento = s.depto; ev.municipio = s.muni; }
      Object.keys(tipoDatos()).forEach(function (k) { var v = tipoDatos()[k]; if (v != null) ev[k] = v; });
      if (s.deportes.length) ev.deportes = s.deportes.slice();
      OLC.crearEvento(ev);
      ctx.onCreated(code, ev);
    });
    var box = document.getElementById('cr-actions'); box.appendChild(cancelar); box.appendChild(guardar);

    dibujarLugar(); dibujarTipo();
    /* Guardar solo se habilita si el formulario difiere de como se abrió. */
    var inicial = JSON.stringify(s);
    function refrescar() { guardar.disabled = JSON.stringify(s) === inicial; progreso(); }
    ['input', 'change', 'click', 'nwtChange'].forEach(function (t) { main.addEventListener(t, function () { setTimeout(refrescar, 0); }); });
    refrescar();
  }
  return { render: render };
})();
