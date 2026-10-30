/* Casos de la demo por rol (historias de usuario). Cada uno lleva la plataforma a donde se ve.
   go: hash destino; ver ('suid'|'todos') y hoy son capas opcionales que se aplican antes de navegar. */
(function () {
  'use strict';
  var NUEVO = '#/eventos/nuevo';
  window.HU_DEMO = {
    admin: [
      { id: 'HU-01', t: 'Ver solo los eventos SUID', q: 'Mi lista muestra únicamente lo que SUID crea.', nuevo: true, go: '#/eventos', ver: 'suid' },
      { id: 'HU-02', t: 'Crear un evento competitivo', q: 'Nombre, fechas, lugar y deportes opcionales.', go: NUEVO },
      { id: 'HU-03', t: 'Crear Actividad Física', q: 'Elijo el tipo y se piden programa, temáticas, sesiones y evaluación.', nuevo: true, go: NUEVO },
      { id: 'HU-04', t: 'Crear un evento internacional', q: 'Los países son obligatorios.', nuevo: true, go: NUEVO },
      { id: 'HU-05', t: 'Probar un nombre repetido', q: 'Escribe «Copa Nacional de Voleibol»: avisa que ya existe.', nuevo: true, go: NUEVO },
      { id: 'HU-06', t: 'Editar un evento SUID', q: 'Cambio un evento mío; el tipo y sus campos se conservan.', go: '#/eventos/hevs-barranquilla-2026/editar' },
      { id: 'HU-07', t: 'Ver todo y filtrar por Origen', q: 'A futuro: veo también ciclo y evento completo, y filtro por origen.', nuevo: true, go: '#/eventos', ver: 'todos' },
      { id: 'HU-08', t: 'Consultar un evento del ciclo', q: 'A futuro: solo consulta, sin editar ni cargar.', nuevo: true, go: '#/eventos/copa-coc-cali-2026', ver: 'todos' },
      { id: 'HU-09', t: 'Consultar un evento completo', q: 'A futuro: Información y Deportes con aviso de solo lectura.', nuevo: true, go: '#/eventos/intercolegiados-nacionales-2026', ver: 'todos' },
      { id: 'HU-10', t: 'Calendario sin eventos', q: 'Un escenario sin eventos en curso muestra el mensaje vacío.', nuevo: true, go: '#/eventos?vista=calendario', hoy: '2026-10-05' }
    ],
    gestor: [
      { id: 'HU-11', t: 'Cargar resultados de un evento mío', q: 'Solo en eventos SUID competitivos que tengo asignados.', go: '#/eventos/nacional-voleibol-2026?tab=cargas' },
      { id: 'HU-12', t: 'Ver un evento no competitivo', q: 'Sin Cargas: no hay resultados ni medallería que registrar.', nuevo: true, go: '#/eventos/hevs-barranquilla-2026' },
      { id: 'HU-13', t: 'Intentar crear un evento', q: 'No hay botón de crear: este rol no crea.', go: '#/eventos' }
    ],
    usuario: [
      { id: 'HU-14', t: 'Consultar la lista de eventos', q: 'Solo lectura, con los eventos SUID.', nuevo: true, go: '#/eventos', ver: 'suid' },
      { id: 'HU-15', t: 'Ver la analítica de un evento', q: 'Pestaña Analítica en un evento competitivo.', go: '#/eventos/nacional-voleibol-2026?tab=analitica' },
      { id: 'HU-16', t: 'Ver Actividad Física', q: 'Información, Organizaciones y Analítica.', nuevo: true, go: '#/eventos/hevs-barranquilla-2026' }
    ],
    metodologo: [
      { id: 'HU-17', t: 'Entrar al módulo de eventos', q: 'No entra: ve un aviso. Califica desde su propia vista.', go: '#/eventos' }
    ],
    comite: [
      { id: 'HU-18', t: 'Ver solo eventos del ciclo', q: 'El backend le devuelve únicamente eventos con ciclo.', go: '#/eventos' },
      { id: 'HU-19', t: 'Consultar deportistas del ciclo', q: 'Pestaña Inscripciones (nominal) del evento.', go: '#/eventos/copa-coc-cali-2026?tab=inscripciones' }
    ],
    comite_manager: [
      { id: 'HU-20', t: 'Ver resultados y medallería', q: 'Suma resultados, medallería y boletines.', go: '#/eventos/copa-coc-cali-2026?tab=medalleria' },
      { id: 'HU-21', t: 'Asignar metodólogos', q: 'Pestaña Metodólogos del evento del ciclo.', go: '#/eventos/copa-coc-cali-2026?tab=metodologos' }
    ],
    comite_admin: [
      { id: 'HU-22', t: 'Crear un evento del ciclo', q: 'Propuesto: el ciclo se marca solo, sin interruptor.', nuevo: true, go: NUEVO },
      { id: 'HU-23', t: 'Editar un evento del ciclo', q: 'Solo los del ciclo; el resto es de consulta.', nuevo: true, go: '#/eventos/copa-coc-cali-2026/editar' }
    ],
    viewer: [
      { id: 'HU-24', t: 'Ver Deportes y analítica', q: 'El rol con menos acceso: solo eventos del ciclo.', go: '#/eventos/copa-coc-cali-2026?tab=deportes' }
    ]
  };
})();
