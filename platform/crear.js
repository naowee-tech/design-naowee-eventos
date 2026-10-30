/* Crear y editar evento (solo quien tiene `crea`/`edita`; el alcance se fija al crear y no se puede editar). Mismos campos que el módulo real: alcance, nombre, fechas, lugar según alcance,
   descripción, marca Ciclo Olímpico y gestor. Más un selector de deportes (vacío = multideportivo) para la demo. */
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

  /* Catálogo maestro de PR-03 §2 (Intercolegiados no es creable). El tipo de programa es campo de diseño por confirmar en el backend LITE. */
  var TIPOS = [
    { value: 'competitivo', label: 'Competitivo', ayuda: 'Cierra con resultados, posiciones y medallería (oro, plata y bronce).' },
    { value: 'actividad_fisica', label: 'Actividad Física', programas: ['Hábitos y Estilos de Vida Saludable (HEVS)', 'Vías Activas y Saludables (VAS)', 'Fuertemente Activos', 'Programa Nacional de Capacitación (PNC)'], formativo: true, ayuda: 'Cierra con asistencia, sesiones cumplidas, participación o aprobación formativa.' },
    { value: 'escolar', label: 'Deporte Escolar y Formativo', programas: ['Jornada Deportiva Escolar Complementaria (JDEC)', 'Escuelas Deportivas para Todos'], modalidad: true, ayuda: 'Según la modalidad: resultados y medallería, o seguimiento formativo y asistencia.' },
    { value: 'social', label: 'Deporte Social Comunitario', programas: ['Juegos Nacionales Deportivos y Recreativos Comunales', 'Encuentros de Deporte Social', 'Programas Diferenciales e Inclusivos', 'Juegos Regionales Específicos'], modalidad: true, ayuda: 'Cierra con resultados competitivos, posiciones, medallería y participación comunitaria.' },
    { value: 'recreacion', label: 'Recreación', programas: ['Estrategias por Curso de Vida (Entremundos y demás)', 'Campamentos Juveniles', 'Nuevo Comienzo Otro Motivo para Vivir'], formativo: true, ayuda: 'Cierra con participación, niveles de formación lúdica o liderazgo, y asistencia.' }
  ];
  var OTRO = 'Otro programa';
  function tipoDef(v) { return TIPOS.filter(function (x) { return x.value === v; })[0]; }

  function slug(t) { return OLC.claveNombre(t).slice(0, 48).replace(/-+$/, ''); }

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

    main.innerHTML = '<div class="nws-page cr">' +
      '<a class="nws-iconbtn nws-iconbtn--lg nws-event-detail__back" href="' + volver + '" aria-label="Volver">' + ctx.icon('arrow-left') + '<span class="nws-event-detail__back-label">Volver</span></a>' +
      '<div class="cr-head"><h1 class="nwt-h5-font-bold" id="nws-h1" tabindex="-1">' + (editar ? 'Editar evento' : 'Crear evento') + '</h1>' +
      '<small class="nwt-smalltext-font-regular">' + (editar ? 'Cambia los datos, las fechas, el lugar o el gestor. El alcance no se puede cambiar. Los campos con * son obligatorios.' : 'Define los datos básicos del evento y asigna un gestor. Los campos con * son obligatorios.') + '</small></div>' +
      '<section class="cr-card" aria-labelledby="cr-t1"><h2 class="nwt-subtitle-font-bold" id="cr-t1">Datos del evento</h2>' +
      '<div class="cr-scope"><span class="nwt-smalltext-font-medium">Alcance del evento</span><small class="nwt-caption-font-regular nws-muted">Se fija al crear y no podrá cambiarse después. Define qué campos pide el formulario.</small><div id="cr-alcance"></div></div>' +
      '<div class="cr-grid" id="cr-grid"></div></section>' +
      '<section class="cr-card" aria-labelledby="cr-t2"><h2 class="nwt-subtitle-font-bold" id="cr-t2">Asignación</h2>' +
      '<p class="nwt-caption-font-regular nws-muted">Define qué gestor cargará inscripciones, resultados y medallería de este evento.</p><div class="cr-grid"><div id="cr-gestor"></div></div><p class="nwt-caption-font-regular cr-hint" id="cr-invita" hidden></p></section>' +
      '<p class="cr-err nwt-smalltext-font-medium" id="cr-err" role="alert" hidden>Revisa los campos marcados: faltan datos o hay fechas inconsistentes.</p>' +
      '<footer class="cr-foot"><span class="nwt-caption-font-regular nws-muted">El estado del evento se calcula con sus fechas: Próximo, En curso o Finalizado.</span><div class="cr-actions" id="cr-actions"></div></footer></div>';

    var $grid = document.getElementById('cr-grid');

    function col(id, full) { var d = document.createElement('div'); d.id = id; d.className = full ? 'cr-full' : ''; return d; }

    /* Campos que dependen del alcance se reconstruyen; el resto se crea una vez. */
    function dibujar() {
      $grid.innerHTML = '';
      var nac = s.alcance === 'NACIONAL';
      if (!nac) {
        var al = document.createElement('div'); al.className = 'cr-full';
        al.innerHTML = '<div class="nws-flash nws-flash--info" role="note"><span>Evento <b>internacional</b>: se hace seguimiento a los deportistas de Colombia. El lugar se indica con el país o países y las sedes; los rivales se registran en los resultados.</span></div>';
        $grid.appendChild(al);
      }
      var bloqueTipo = col('c-tipo', true); bloqueTipo.innerHTML = '<div class="cr-grid" id="cr-tipo-grid"></div>'; $grid.appendChild(bloqueTipo); dibujarTipo();
      var nombre = col('c-nombre', true), ini = col('c-ini'), fin = col('c-fin');
      campos.nombre = C.mk('nwt-text-field', { label: 'Nombre del evento', placeholder: 'Ej. Copa Nacional de Atletismo 2026', required: true, value: s.nombre, nwtSize: 'large' }, function (v) { s.nombre = String(v || ''); validar(); });
      campos.inicio = C.mk('nwt-date-field', { label: 'Fecha de inicio', required: true, value: s.inicio }, function (v) { s.inicio = v; if (s.fin && v && s.fin <= v) { s.fin = undefined; campos.fin.value = undefined; } campos.fin.min = v ? new Date(v.getTime() + 864e5) : undefined; validar(); });
      campos.fin = C.mk('nwt-date-field', { label: 'Fecha de fin', required: true, value: s.fin, disabled: false, min: s.inicio ? new Date(s.inicio.getTime() + 864e5) : undefined }, function (v) { s.fin = v; validar(); });
      nombre.appendChild(campos.nombre); ini.appendChild(campos.inicio); fin.appendChild(campos.fin);
      $grid.appendChild(nombre); $grid.appendChild(ini); $grid.appendChild(fin);

      if (nac) {
        var d = col('c-depto'), m = col('c-muni');
        campos.depto = C.mk('nwt-dropdown', { label: 'Departamento', required: true, placeholder: 'Selecciona', options: C.opciones(Object.keys(DEPTOS)), value: s.depto || undefined, nwtSize: 'large' }, function (v) {
          s.depto = v || ''; s.muni = ''; campos.muni.options = C.opciones(DEPTOS[s.depto] || []); campos.muni.value = undefined; campos.muni.disabled = !s.depto; validar();
        });
        campos.muni = C.mk('nwt-dropdown', { label: 'Municipio', required: true, placeholder: 'Selecciona', options: C.opciones(DEPTOS[s.depto] || []), value: s.muni || undefined, disabled: !s.depto, nwtSize: 'large' }, function (v) { s.muni = v || ''; validar(); });
        d.appendChild(campos.depto); m.appendChild(campos.muni); $grid.appendChild(d); $grid.appendChild(m);
      } else {
        var p = col('c-paises'), sd = col('c-sedes');
        campos.paises = C.mk('nwt-dropdown', { label: 'Países', required: true, placeholder: 'Selecciona uno o varios', multiple: true, options: C.opciones(PAISES.map(function (c) { return { value: c, label: OLC.paisNombre(c) }; })), value: s.paises, nwtSize: 'large' }, function (v) { s.paises = v || []; validar(); });
        p.appendChild(campos.paises);
        sd.className = 'cr-full'; sd.innerHTML = '<div class="cr-sedes"><div class="cr-sedes__in" id="cr-sedes-in"></div><ul class="cr-chips" id="cr-sedes-ul" aria-label="Sedes agregadas"></ul></div>';
        $grid.appendChild(p); $grid.appendChild(sd);
        var inp = C.mk('nwt-text-field', { label: 'Sedes', placeholder: 'Ej. Estadio Metropolitano', nwtSize: 'large' }, function (v) { inp.value = v; });
        var add = C.mk('nwt-button', { nwtVariant: 'mute', nwtSize: 'large' });
        add.textContent = 'Agregar sede';
        function pintarSedes() {
          var ul = document.getElementById('cr-sedes-ul');
          ul.innerHTML = s.sedes.map(function (x, i) { return '<li class="cr-chip">' + esc(x) + '<button type="button" data-q="' + i + '" aria-label="Quitar ' + esc(x) + '">×</button></li>'; }).join('');
          ul.querySelectorAll('[data-q]').forEach(function (b) { b.addEventListener('click', function () { s.sedes.splice(+b.getAttribute('data-q'), 1); pintarSedes(); }); });
        }
        add.addEventListener('click', function () { var t = String(inp.value || '').trim(); if (t && s.sedes.indexOf(t) < 0) { s.sedes.push(t); inp.value = ''; pintarSedes(); } });
        document.getElementById('cr-sedes-in').appendChild(inp); document.getElementById('cr-sedes-in').appendChild(add); pintarSedes();
      }

      var desc = col('c-desc', true);
      campos.descripcion = C.mk('nwt-text-area', { label: 'Descripción', placeholder: 'Resumen del evento, alcance y notas…', rows: 3, value: s.descripcion }, function (v) { s.descripcion = String(v || ''); });
      desc.appendChild(campos.descripcion); $grid.appendChild(desc);

      /* Sin interruptor de ciclo: lo fija el rol (coc nace con ciclo, suid sin él); nunca FULL. */
      if (window.ROLES.rol.crea === 'coc') { var ci = col('c-ciclo-info', true); ci.innerHTML = '<p class="nwt-caption-font-regular cr-hint">' + (editar ? 'Este es un evento del Ciclo Olímpico.' : 'Este evento se crea como evento del Ciclo Olímpico.') + '</p>'; $grid.appendChild(ci); }
    }

    /* Bloque del tipo de evento: se reconstruye al cambiarlo y solo trae los campos del tipo elegido. */
    function dibujarTipo() {
      var g = document.getElementById('cr-tipo-grid'); g.innerHTML = '';
      ['programa', 'otro', 'modalidad', 'deportes', 'modulos', 'sesiones', 'evaluacion'].forEach(function (k) { delete campos[k]; });
      var td = tipoDef(s.tipo), cT = col('c-tipoev', true);
      campos.tipo = C.mk('nwt-dropdown', { label: 'Tipo de evento', required: true, placeholder: 'Selecciona', options: C.opciones(TIPOS.map(function (x) { return { value: x.value, label: x.label }; })), value: s.tipo || undefined, nwtSize: 'large' }, function (v) {
        v = v || ''; if (v === s.tipo) return;
        s.tipo = v; s.programa = ''; s.otro = ''; s.modalidad = ''; s.modulos = []; s.sesiones = ''; s.evaluacion = ''; s.deportes = []; dibujarTipo(); validar();
      });
      if (!esCoc) { cT.appendChild(campos.tipo); g.appendChild(cT); }
      if (!td) return;
      if (!esCoc) { var ay = col('c-tipo-ayuda', true); ay.innerHTML = '<p class="nwt-caption-font-regular cr-hint">' + esc(td.ayuda) + '</p>'; g.appendChild(ay); }
      if (td.programas) {
        var cp = col('c-programa', true);
        campos.programa = C.mk('nwt-dropdown', { label: 'Programa estándar', required: true, placeholder: 'Selecciona', options: C.opciones(td.programas.concat([OTRO])), value: s.programa || undefined, nwtSize: 'large' }, function (v) {
          s.programa = v || ''; if (s.programa !== OTRO) s.otro = ''; dibujarOtro(); validar();
        });
        cp.appendChild(campos.programa); g.appendChild(cp);
        var co = col('c-otro', true); co.id = 'c-otro'; g.appendChild(co); dibujarOtro();
      }
      if (td.modalidad) {
        var cm = col('c-modalidad', true), lb = document.createElement('span'); lb.className = 'nwt-smalltext-font-medium'; lb.textContent = 'Modalidad *';
        campos.modalidad = C.mk('nwt-tag-group', { items: [{ id: 'competitiva', label: 'Competitiva (resultados y medallería)', value: 'competitiva' }, { id: 'formativa', label: 'Formativa (asistencia)', value: 'formativa' }], value: s.modalidad || undefined }, function (v) {
          if (!v || v === s.modalidad) return; s.modalidad = v; s.deportes = []; dibujarTipo(); validar();
        });
        cm.appendChild(lb); cm.appendChild(campos.modalidad); g.appendChild(cm);
      }
      var conDeportes = s.tipo === 'competitivo' || (td.modalidad && s.modalidad === 'competitiva');
      var formativo = td.formativo || (td.modalidad && s.modalidad === 'formativa');
      if (conDeportes) {
        var dep = col('c-deportes', true);
        campos.deportes = C.mk('nwt-dropdown', { label: 'Deportes (opcional)', placeholder: 'Sin elegir = evento multideportivo', multiple: true, options: C.opciones(OLC.catalogoDeportes().map(function (x) { return { value: x.codigo, label: x.nombre }; })), value: s.deportes, nwtSize: 'large' }, function (v) { s.deportes = v || []; });
        dep.appendChild(campos.deportes); g.appendChild(dep);
      }
      if (td.formativo) {
        var cmod = col('c-modulos', true);
        cmod.innerHTML = '<div class="cr-sedes"><div class="cr-sedes__in" id="cr-mod-in"></div><ul class="cr-chips" id="cr-mod-ul" aria-label="Temáticas o módulos agregados"></ul></div>';
        g.appendChild(cmod);
        var inp = C.mk('nwt-text-field', { label: 'Temáticas o módulos', placeholder: 'Ej. Alimentación saludable', required: true, nwtSize: 'large' }, function (v) { inp.value = v; });
        var add = C.mk('nwt-button', { nwtVariant: 'mute', nwtSize: 'large' }); add.textContent = 'Agregar';
        campos.modulos = inp;
        function pintarMod() {
          var ul = document.getElementById('cr-mod-ul');
          ul.innerHTML = s.modulos.map(function (x, i) { return '<li class="cr-chip">' + esc(x) + '<button type="button" data-q="' + i + '" aria-label="Quitar ' + esc(x) + '">×</button></li>'; }).join('');
          ul.querySelectorAll('[data-q]').forEach(function (b) { b.addEventListener('click', function () { s.modulos.splice(+b.getAttribute('data-q'), 1); pintarMod(); validar(); }); });
        }
        add.addEventListener('click', function () { var t = String(inp.value || '').trim(); if (t && s.modulos.indexOf(t) < 0) { s.modulos.push(t); inp.value = ''; pintarMod(); validar(); } });
        document.getElementById('cr-mod-in').appendChild(inp); document.getElementById('cr-mod-in').appendChild(add); pintarMod();
        var cs = col('c-sesiones'), ce = col('c-evaluacion');
        campos.sesiones = C.mk('nwt-text-field', { label: 'Número de sesiones', placeholder: 'Ej. 12', required: true, value: s.sesiones, nwtSize: 'large' }, function (v) { s.sesiones = String(v || '').trim(); validar(); });
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
    function validar() {
      if (!intentado) return;
      var f = faltas();
      ['tipo', 'programa', 'otro', 'modalidad', 'modulos', 'sesiones', 'evaluacion', 'nombre', 'inicio', 'fin', 'depto', 'muni', 'paises', 'gestor'].forEach(function (k) { if (campos[k]) campos[k].error = f.indexOf(k) >= 0; });
      var dup = duplicado(), eb = document.getElementById('cr-err');
      eb.textContent = dup ? msgDuplicado(dup) : MSG_BASE; eb.hidden = !f.length;
    }

    if (editar) {
      document.getElementById('cr-alcance').innerHTML = '<span class="cr-fijo nwt-smalltext-font-bold">' + (s.alcance === 'NACIONAL' ? 'Nacional' : 'Internacional') + '</span>';
    } else {
      campos.alcance = C.mk('nwt-tag-group', { items: [{ id: 'nacional', label: 'Nacional', value: 'NACIONAL' }, { id: 'internacional', label: 'Internacional', value: 'INTERNACIONAL' }], value: s.alcance }, function (v) { if (v && v !== s.alcance) { s.alcance = v; dibujar(); } });
      document.getElementById('cr-alcance').appendChild(campos.alcance);
    }

    campos.gestor = C.mk('nwt-dropdown', { label: 'Asignar a', required: true, placeholder: 'Selecciona una persona', value: s.gestor || undefined, options: PERSONAS.map(function (p) { return { key: p.nombre.toLowerCase(), label: p.nombre + ' · ' + p.rol, value: p.nombre }; }), nwtSize: 'large' }, function (v) {
      s.gestor = v || ''; var p = PERSONAS.filter(function (x) { return x.nombre === s.gestor; })[0], h = document.getElementById('cr-invita');
      h.hidden = !p || p.gestor; h.textContent = p && !p.gestor ? p.nombre + ' aún no es gestor: se le invitará como gestor de este evento. Podrás reasignarlo más adelante.' : ''; validar();
    });
    document.getElementById('cr-gestor').appendChild(campos.gestor);

    var cancelar = C.mk('nwt-button', { nwtVariant: 'mute' }); cancelar.textContent = 'Cancelar'; cancelar.addEventListener('click', function () { location.hash = volver; });
    var guardar = C.mk('nwt-button', { nwtVariant: 'loud' }); guardar.textContent = editar ? 'Guardar cambios' : 'Guardar';
    /* Solo viaja lo del tipo elegido; null borra lo que dejó un tipo anterior al editar. */
    function tipoDatos() {
      var td = tipoDef(s.tipo), form = !!(td && td.formativo);
      return { tipo_programa: s.tipo, programa_estandar: td && td.programas ? (s.programa === OTRO ? s.otro.trim() : s.programa) : null, modalidad: td && td.modalidad ? s.modalidad : null,
        modulos: form ? s.modulos.slice() : null, sesiones: form ? parseInt(s.sesiones, 10) : null, evaluacion: form ? s.evaluacion : null };
    }
    guardar.addEventListener('click', function () {
      intentado = true; var f = faltas(); validar();
      if (f.length) { var h1 = document.getElementById('cr-err'); if (h1) h1.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
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
      Object.keys(tipoDatos()).forEach(function (k) { var v = tipoDatos()[k]; if (v != null) ev[k] = v; });      if (s.deportes.length) ev.deportes = s.deportes.slice();
      OLC.crearEvento(ev);
      ctx.onCreated(code, ev);
    });
    var box = document.getElementById('cr-actions'); box.appendChild(cancelar); box.appendChild(guardar);

    dibujar();
    /* Guardar solo se habilita si el formulario difiere de como se abrió. */
    var inicial = JSON.stringify(s);
    function refrescarGuardar() { guardar.disabled = JSON.stringify(s) === inicial; }
    ['input', 'change', 'click', 'nwtChange'].forEach(function (t) { main.addEventListener(t, function () { setTimeout(refrescarGuardar, 0); }); });
    refrescarGuardar();
  }
  return { render: render };
})();
