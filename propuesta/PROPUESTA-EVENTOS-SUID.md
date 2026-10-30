# Propuesta: cómo se manejan los eventos en SUID (v5, lenguaje sencillo)

**Autor:** Jorge Guzmán (Diseño) · **Fecha:** 30-oct-2026 · **Estado:** prototipo de diseño, revisado contra lo que dijo Javier Mercado (Javi) del backend.

Aviso: todo lo del backend viene de Javi, sobre el entorno de pruebas (staging). **No está verificado en producción.** Los eventos, fechas, sedes y enlaces del prototipo son ejemplos inventados para ilustrar.

## 1. Qué proponemos, en 5 líneas

1. SUID puede **crear y editar eventos sencillos**, de cinco tipos (Competitivo, Actividad Física, Deporte Escolar y Formativo, Deporte Social Comunitario, Recreación).
2. SUID **solo consulta** los eventos del Ciclo Olímpico, los eventos completos y los de Liga. No los crea ni los edita.
3. Cada rol crea y edita **solo su tipo**: un rol de SUID, los eventos de SUID; un rol del Comité Olímpico, los del ciclo.
4. Cada tipo de evento muestra **solo las pestañas que le sirven** (un taller de salud no tiene medallas).
5. Lo que depende del backend o de otras personas está marcado con un semáforo (sección 7).

## 2. Glosario

- **Evento sencillo (LITE):** evento simple, con deporte y pruebas, sin fases ni categorías. Es el que crea SUID.
- **Evento completo (FULL):** evento grande, con fases y deportes. Por ejemplo, los Juegos Intercolegiados Nacionales. SUID solo lo mira.
- **Evento de Liga (ULTRA_LITE):** una entrada mínima de calendario (nombre, fechas, hora, enlace). La crea una Liga para su propio calendario.
- **Ciclo Olímpico:** eventos sencillos marcados como parte del ciclo del Comité Olímpico. SUID los ve en modo consulta.
- **Rol:** el "sombrero" de una persona en el sistema. Define qué ve y qué puede hacer.
- **Pestaña:** cada sección dentro de un evento (Información, Deportes, etc.).
- **Solo consulta:** se puede ver, pero no cambiar.

## 3. Qué tipos de evento hay y qué puede hacer SUID

| Tipo | Quién lo crea | Qué se ve en pantalla (rol SUID) | Pestañas (rol SUID) |
|---|---|---|---|
| Evento sencillo de SUID, competitivo | Rol SUID | Se puede crear y editar | Información, Cargas, Deportes, Organizaciones, Analítica |
| Evento sencillo de SUID, no competitivo | Rol SUID | Se puede crear y editar | Información, Organizaciones, Analítica |
| Ciclo Olímpico | Rol del Comité Olímpico | Solo consulta | Información, Deportes, Organizaciones (si es nacional), Analítica |
| Evento completo | Nadie desde esta pantalla | Solo consulta | Información y Deportes |
| Evento de Liga | La Liga | Solo consulta, con etiqueta "Liga" | Solo Información |

"No competitivo" quiere decir que no hay resultados ni medallas: por eso no tiene Cargas, y tampoco Deportes.

En la lista y el calendario hay un filtro "Origen" (SUID, Comité Olímpico, Macro Evento, Liga) para ver cada grupo por separado. Los eventos de Liga salen al final de la lista.

## 4. Los 5 tipos que SUID puede crear

Primero se elige el tipo; el formulario muestra solo lo que ese tipo necesita. Todos piden además: nombre, fechas (el fin debe ser después del inicio), lugar y a quién se asigna.

| Tipo | Ejemplos de programa | Qué pide el formulario | Cómo termina |
|---|---|---|---|
| Competitivo | Eventos con pruebas | Deportes (opcional; vacío = multideportivo) | Resultados y medallería |
| Actividad Física | Hábitos y Estilos de Vida Saludable (HEVS), Vías Activas y Saludables, Fuertemente Activos, Programa Nacional de Capacitación | Programa, temáticas o módulos, número de sesiones (mayor a 0), evaluación (por asistencia o por aprobación) | Asistencia o aprobación |
| Deporte Escolar y Formativo | Jornada Deportiva Escolar Complementaria (JDEC), Escuelas Deportivas para Todos | Programa y modalidad (competitiva o formativa) | Resultados, o asistencia |
| Deporte Social Comunitario | Juegos Comunales, Encuentros de Deporte Social, Programas Diferenciales e Inclusivos, Juegos Regionales Específicos | Programa y modalidad (competitiva o formativa) | Resultados, o participación |
| Recreación | Estrategias por Curso de Vida, Campamentos Juveniles, Nuevo Comienzo | Programa, temáticas o módulos, sesiones, evaluación | Participación y asistencia |

Datos comunes del formulario:

- **Alcance:** nacional o internacional, y se fija al crear. Si es nacional se pide departamento y municipio. Si es internacional, los **países son obligatorios** (y se muestran en el detalle y en la tarjeta del evento).
- **Nombre único:** no puede repetirse entre ningún tipo de evento. El backend lo valida (error 409); el prototipo avisa antes de guardar.
- Los errores del formulario se marcan solo después de intentar guardar.
- Al crear un evento, la lista salta a donde quedó y lo resalta unos segundos.
- **Editar:** con un rol SUID solo se editan eventos SUID, y al editar no se muestra el selector de tipo. Editar un evento del ciclo no aplica con roles SUID.
- **"Agregar" externos se retiró:** el backend no lo tiene.

Ejemplos del prototipo (inventados): HEVS Barranquilla 2026 (Actividad Física), Campamento Juvenil Eje Cafetero (Recreación), JDEC Tolima 2026 (Escolar), 4 eventos completos y 2 de Liga. **Todavía no hay ejemplo de Deporte Social Comunitario.**

Importante: estos cinco tipos son una decisión de **diseño**. No está confirmado que el backend de eventos sencillos los soporte; Javi indicó que un evento sencillo es "deporte y prueba", sin fases ni categorías.

## 5. Quién puede crear y editar qué

| Rol | Crea y edita | Solo consulta |
|---|---|---|
| Rol SUID (Admin Naowee, hoy) | Eventos de SUID (sin interruptor de ciclo) | Ciclo Olímpico, completos, Liga |
| Rol del Comité Olímpico (propuesto: "Administrador del Comité") | Eventos del Ciclo Olímpico (el ciclo se marca solo) | SUID, completos, Liga |
| Cualquiera | Nadie crea ni edita eventos completos ni de Liga | Completos, Liga |

Esta separación es una decisión de diseño. **Choca con el código actual:** hoy el ciclo es un interruptor dentro del mismo formulario que usa el Admin Naowee, y los roles del Comité no pueden crear eventos. El rol "Administrador del Comité" **no existe**; es una propuesta de diseño, por confirmar con Javi.

Sobre el Ciclo Olímpico: que sea "solo consulta" para SUID es una regla de pantalla; el backend no impide editarlo (Javi).

## 6. Qué ve cada tipo por dentro (pestañas)

- **SUID competitivo:** Información, Cargas, Deportes, Organizaciones, Analítica.
- **SUID no competitivo:** Información, Organizaciones, Analítica. Sin Cargas ni Deportes: no hay resultados ni medallería.
- **Ciclo Olímpico (rol SUID):** Información, Deportes, Organizaciones (si es nacional), Analítica. Solo consulta.
- **Evento completo:** Información y Deportes. Solo consulta. El backend solo entrega esas dos partes; lo demás (deportistas, resultados, medallería) está en una versión anterior del sistema.
- **Evento de Liga:** solo Información.

**Qué ven solo los roles del Comité Olímpico** (no los roles SUID, ni siquiera en eventos propios): Metodólogos, Calendario y resultados, Medallería, Boletines y los tableros generales del ciclo.

Calendario: si un mes no tiene eventos visibles, muestra el mensaje "Sin eventos este mes".

## 7. Qué está confirmado y qué falta (semáforo)

Verde = Confirmado por backend. Azul = Decisión de diseño. Rojo = Por confirmar.

| Tema | Estado | Dueño del pendiente |
|---|---|---|
| Hay tipos de evento según un campo del backend; si viene vacío, cuenta como completo | Confirmado por backend | — |
| El backend filtra por rol solo al Comité Olímpico; el resto de roles ve todo y lo demás lo esconde la pantalla | Confirmado por backend | — |
| Evento completo: SUID no puede editarlo (el backend responde "no implementado") | Confirmado por backend | — |
| Evento de Liga: no se crea desde SUID; lo crea la Liga | Confirmado por backend | — |
| Nombre único (error 409) | Confirmado por backend | — |
| "Agregar" externos no existe | Confirmado por backend | — |
| Que el campo del tipo de evento solo tenga 3 valores (LITE, FULL, ULTRA_LITE) | Por confirmar | Javi (preguntado hoy) |
| Los 5 tipos de SUID y sus campos | Decisión de diseño; backend por confirmar | Javi |
| Cada rol crea solo su tipo | Decisión de diseño; choca con el código actual | Jorge y Javi |
| Rol "Administrador del Comité" con permiso de crear | Por confirmar (hoy no existe) | Javi y Jorge |
| Que el Admin Naowee marque el ciclo desde SUID | Por confirmar (choca con la regla por rol) | Javi |
| Qué más ve el rol de Liga en SUID | Por confirmar | Javi |
| Evento completo con ciclo: hoy lleva doble etiqueta | Decisión de diseño; por confirmar | Jorge |
| Quién hace las cargas de eventos del ciclo | Por confirmar | Jorge |
| Que "solo consulta" del ciclo sea regla dura en backend | Por confirmar | Javi |
| Contrato de solo lectura de deportistas, resultados y medallería de eventos completos | Por confirmar | Javi |
| Todo verificado en producción | Por confirmar | Javi |

## 8. Roles: nombre real y nombre oficial

El backend tiene estos roles hoy. La columna "Nombre oficial" sale de la documentación de la plataforma (nao-docs). **Todavía no existe en nao-docs una página de eventos.**

| Rol en el backend | Nombre oficial (nao-docs) | Qué hace en eventos |
|---|---|---|
| EVENTS_LITE_ADMIN | Admin Naowee | Hoy crea eventos y asigna al Gestor |
| EVENTS_LITE_MANAGER | Gestor de eventos Naowee | Carga inscripciones, resultados y medallería de sus eventos |
| EVENTS_LITE_MODULE_USER | Sin equivalente en nao-docs | Solo consulta: lista, detalle y analítica |
| EVENTS_LITE_LEAGUE | Administrador de organismo de su liga | Crea y edita eventos de Liga |
| EVENTS_LITE_OLYMPIC_COMMITTEE y OLYMPIC_COMMITTEE_VIEWER | Administrador de organismo del Comité Olímpico, con "marca olímpica" (un atributo del organismo, no de la persona) | Ven los eventos del ciclo |
| EVENTS_LITE_OLYMPIC_COMMITTEE_MANAGER | Gestor de comité olímpico (rol interno) | Ciclo, resultados y medallería; asigna metodólogos |
| EVENTS_LITE_METHODOLOGIST | Metodólogo (rol interno) | Califica desde su propia vista |
| "Administrador del Comité" | No existe | Propuesta de diseño |

## 9. Qué falta del documento de Danna (PR-03)

- **Error del documento:** en PR-03 §2, "Juegos Intercolegiados Nacionales" aparece como tipo que SUID puede crear. Es un evento completo (FULL) de ese torneo; SUID no crea ninguno. Se corrige con Danna.
- **Los 6 roles de PR-03 no existen hoy** en el backend, ni hay un rol "Operador". La matriz de roles por módulo del Ministerio está pendiente (compromiso C-8, Danna).
- **Reglas del PR-03:**

| Regla | Estado en el prototipo |
|---|---|
| RN-01 Tipos de evento | Aplicado (backend por confirmar) |
| RN-03 Carga masiva por archivo | Parcial |
| RN-02 Formularios externo e interno | No aplicado |
| RN-04 Condicionales | No aplicado |
| RN-05 Etapa documental y subsanación | No aplicado |
| RN-06 Habilitación excepcional | No aplicado |
| RN-07 Estados Configuración, Activo e Inactivo | No aplicado; choca con el estado por fechas del backend |
| RN-08 Historial de rendimiento | No aplicado |
| RN-09 Reversión en dos niveles y bitácora | No aplicado |

Por aclarar con Danna y Javi: si estas reglas son una evolución de los eventos sencillos o un módulo nuevo.

## 10. Apéndice: detalle técnico

**Fuentes:** [Javi] auditoría del backend del 29-oct (staging, leída de migraciones) · [Decisión] decisión de Jorge · [perm.ts] `permissions.ts` de `suite-mf-events-lite` · [PR-03] documento de Danna · [nao-docs] `suid/jerarquia-organizaciones/roles-y-permisos.md` · [Inferencia] deducción sin confirmar.

- **Tipos:** `event_type` = `LITE`, `FULL` o `ULTRA_LITE`; `null` se trata como FULL. `LITE` con `olympic_cycle` es Ciclo Olímpico [Javi]. El prototipo deriva el origen en `tipoDe` (`platform/roles.js`).
- **Edición:** `PATCH /v2/events/{code}` con permiso `event:update` (`EVENTS_LITE_ADMIN`) [Javi].
- **Nombre único:** el backend lo convierte a slug (sin tildes, minúsculas, caracteres especiales a guion) y responde 409 [Javi].
- **Completo (FULL):** `PATCH` y sub-recursos v2 responden 501; `POST /v2/events` crea un "FULL mínimo"; deportistas, resultados y medallería están en v1. El detalle v2 entrega fases y deportes [Javi].
- **Liga (`ULTRA_LITE`):** solo `EVENTS_LITE_LEAGUE` lo crea desde su CRUD; `POST /v2/events` da 501 [Javi].
- **Filtrado:** el Comité recibe solo `LITE` con ciclo (404 en el resto); los demás roles con `event:list` ven todo [Javi].
- **Permisos por rol:** ADMIN: lista/detalle, `event:update`, `athlete:list/read`, marca y desmarca ciclo. MANAGER: `registration:write`, `result:write`, `medal:write`. MODULE_USER: `event:list`, `event:read`, `athlete:*`, `dashboard:read`. Roles del Comité: sin `event:create` [Javi, perm.ts]. Ciclo como interruptor del mismo formulario (SUV2-1741) [perm.ts].
- **Pestañas en el prototipo:** `pestanasDe` en `platform/roles.js`. Cargas solo en eventos SUID competitivos; Metodólogos, Calendario y resultados, Medallería y Boletines (`SOLO_CICLO`) solo para roles con lista de ciclo; completos: `informacion` y `deportes`; Liga: `informacion`. Deportes se oculta en eventos sin deportes (`sinDeportes`, `platform/app.js`).
- **Formularios:** `platform/crear.js`; tipos `competitivo`, `actividad_fisica`, `escolar`, `social`, `recreacion`.
- **Datos de ejemplo:** `shared/data.js`. Rol propuesto: `comite_admin`, código `PROPUESTO`.
- **Matriz completa de roles:** `mapa-roles.html` y `mapa-roles.json`. Presentación: `propuesta/index.html` (16 láminas).
