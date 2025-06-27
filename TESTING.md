# Plan de Pruebas para Registro de Sesiones y Proyectos (v1.0.1)

Este documento describe los casos de prueba manuales para asegurar el correcto funcionamiento de la aplicación "Registro de Sesiones y Proyectos".

## Prerrequisitos

-   La aplicación debe estar ejecutándose en un navegador web compatible.
-   Se recomienda abrir la consola de desarrollador del navegador para observar logs y posibles errores.
-   Limpiar `localStorage` antes de iniciar una nueva batería de pruebas puede ser útil para asegurar un estado inicial limpio (`localStorage.clear()` en la consola).

## 1. Gestión de Sesión Activa

### 1.1 Iniciar Sesión
-   **Test 1.1.1:**
    -   **Pasos:**
        1.  Con la aplicación cargada y sin sesión activa, hacer clic en "Iniciar Nueva Sesión".
    -   **Resultado Esperado:**
        -   El temporizador aparece y comienza a contar desde 00:00:00.
        -   El indicador de estado de sesión (punto) se muestra activo (color de acento, pulsante).
        -   Los botones "Detener" y "Pausar" están visibles.
        -   El mensaje de estado indica "Sesión activa. Registrando tiempo...".
        -   En `localStorage`, la clave `appActiveSession_v1` contiene los datos de la nueva sesión.

### 1.2 Pausar Sesión
-   **Test 1.2.1:**
    -   **Pasos:**
        1.  Iniciar una sesión (Test 1.1.1).
        2.  Dejar correr el temporizador unos segundos.
        3.  Hacer clic en "Pausar".
    -   **Resultado Esperado:**
        -   El temporizador se detiene en el tiempo transcurrido.
        -   Aparece el texto "(Pausado)" debajo del temporizador.
        -   El indicador de estado de sesión cambia a color de pausa y deja de pulsar.
        -   El botón "Pausar" cambia a "Reanudar".
        -   El mensaje de estado indica "Sesión en pausa.".
        -   En `localStorage`, la sesión activa tiene `isPaused: true` y `pausedStartTime` con un timestamp.
        -   El tiempo transcurrido no avanza mientras está en pausa.

### 1.3 Reanudar Sesión
-   **Test 1.3.1:**
    -   **Pasos:**
        1.  Pausar una sesión (Test 1.2.1).
        2.  Hacer clic en "Reanudar".
    -   **Resultado Esperado:**
        -   El temporizador continúa contando desde donde se pausó.
        -   El texto "(Pausado)" desaparece.
        -   El indicador de estado de sesión vuelve a activo.
        -   El botón "Reanudar" cambia a "Pausar".
        -   El mensaje de estado indica "Sesión activa. Registrando tiempo...".
        -   En `localStorage`, la sesión activa tiene `isPaused: false`, `pausedStartTime: null`, y `totalPausedDuration` actualizado.

### 1.4 Detener Sesión
-   **Test 1.4.1:** Detener sesión activa (no pausada).
    -   **Pasos:**
        1.  Iniciar una sesión y dejarla correr unos segundos.
        2.  Hacer clic en "Detener".
    -   **Resultado Esperado:**
        -   La vista de sesión activa desaparece.
        -   Se muestra la vista inicial con el botón "Iniciar Nueva Sesión" y "HISTORIAL Y PROYECTOS".
        -   La clave `appActiveSession_v1` se elimina de `localStorage`.
        -   La sesión detenida se añade al principio de la lista en `appCompletedSessions_v1` en `localStorage`, con `endTime` y duración calculada correctamente.
        -   En el modal de Historial (pestaña Sesiones), la nueva sesión aparece al principio.

-   **Test 1.4.2:** Detener sesión pausada.
    -   **Pasos:**
        1.  Iniciar una sesión, pausarla y luego hacer clic en "Detener".
    -   **Resultado Esperado:**
        -   Mismos resultados que Test 1.4.1. La `totalPausedDuration` debe incluir la última pausa activa al momento de detener.

### 1.5 Temporizador y Duración
-   **Test 1.5.1:** Precisión del temporizador.
    -   **Pasos:**
        1.  Iniciar una sesión.
        2.  Usar un cronómetro externo para medir 1 minuto.
        3.  Comparar el tiempo mostrado en la app con el cronómetro externo.
    -   **Resultado Esperado:**
        -   El tiempo mostrado debe ser muy cercano a 1 minuto (00:01:00).

-   **Test 1.5.2:** Cálculo de duración efectiva con pausas.
    -   **Pasos:**
        1.  Iniciar sesión. Correr por 10s.
        2.  Pausar. Esperar 5s.
        3.  Reanudar. Correr por otros 10s.
        4.  Detener sesión.
    -   **Resultado Esperado:**
        -   La sesión completada debe tener una duración efectiva de aproximadamente 20s (00:00:20). El `totalPausedDuration` debe ser de aprox. 5s.

### 1.6 Advertencia `beforeunload`
-   **Test 1.6.1:**
    -   **Pasos:**
        1.  Iniciar una sesión.
        2.  Intentar cerrar la pestaña del navegador o recargar la página.
    -   **Resultado Esperado:**
        -   El navegador muestra un diálogo de confirmación preguntando si el usuario realmente quiere salir.

-   **Test 1.6.2:** Sin sesión activa.
    -   **Pasos:**
        1.  Asegurarse de que no hay sesión activa.
        2.  Intentar cerrar la pestaña del navegador o recargar la página.
    -   **Resultado Esperado:**
        -   No se muestra ningún diálogo de confirmación. La página se cierra/recarga directamente.


## 2. Gestión de Sesiones Completadas (Modal de Historial)

### 2.1 Visualización
-   **Test 2.1.1:**
    -   **Pasos:**
        1.  Detener varias sesiones con diferentes duraciones y tiempos de inicio/fin.
        2.  Abrir el modal "HISTORIAL Y PROYECTOS", pestaña "Sesiones Grabadas".
    -   **Resultado Esperado:**
        -   Todas las sesiones completadas se listan, ordenadas por fecha de inicio (más recientes primero).
        -   Se muestran correctamente: Fecha/Hora de Inicio, Fecha/Hora de Fin, Duración Efectiva.
        -   El selector de proyecto está presente para cada sesión.

-   **Test 2.1.2:** Sin sesiones grabadas.
    -   **Pasos:**
        1.  Limpiar `localStorage` (o asegurarse de no tener sesiones completadas).
        2.  Abrir el modal, pestaña "Sesiones Grabadas".
    -   **Resultado Esperado:**
        -   Se muestra el mensaje "No hay sesiones grabadas."

### 2.2 Asignación a Proyectos
-   **Test 2.2.1:** Asignar sesión a proyecto activo.
    -   **Pasos:**
        1.  Crear un proyecto (ej. "Proyecto Test").
        2.  Detener una sesión.
        3.  En el modal, pestaña Sesiones, encontrar la sesión y usar el dropdown para asignarla a "Proyecto Test".
    -   **Resultado Esperado:**
        -   La sesión se asigna correctamente. El dropdown muestra "Proyecto Test" seleccionado.
        -   El `projectId` de la sesión en `appCompletedSessions_v1` se actualiza.

-   **Test 2.2.2:** Desasignar sesión de proyecto.
    -   **Pasos:**
        1.  Asignar una sesión a un proyecto.
        2.  En el dropdown de la sesión, seleccionar "Sin proyecto".
    -   **Resultado Esperado:**
        -   La sesión se desasigna. El dropdown muestra "Sin proyecto".
        -   El `projectId` de la sesión en `appCompletedSessions_v1` se establece a `null`.

-   **Test 2.2.3:** Intentar asignar sesión a proyecto finalizado.
    -   **Pasos:**
        1.  Crear un proyecto y finalizarlo.
        2.  Detener una nueva sesión.
        3.  Intentar asignar esta sesión al proyecto finalizado a través del dropdown.
    -   **Resultado Esperado:**
        -   El proyecto finalizado aparece como `disabled` (o con indicación "(Finalizado)") en el dropdown.
        -   No se puede seleccionar el proyecto finalizado (o se muestra una alerta si se intenta programáticamente).
        -   La asignación de la sesión no cambia.

### 2.3 Eliminación de Sesiones
-   **Test 2.3.1:** Eliminar una sesión.
    -   **Pasos:**
        1.  Detener una sesión.
        2.  En el modal, pestaña Sesiones, seleccionar la casilla de la sesión.
        3.  Hacer clic en "Eliminar Seleccionadas (1)".
        4.  Confirmar la eliminación.
    -   **Resultado Esperado:**
        -   La sesión se elimina de la lista y de `appCompletedSessions_v1` en `localStorage`.

-   **Test 2.3.2:** Eliminar múltiples sesiones.
    -   **Pasos:**
        1.  Detener varias sesiones.
        2.  Seleccionar varias sesiones usando las casillas.
        3.  Hacer clic en "Eliminar Seleccionadas (X)".
        4.  Confirmar.
    -   **Resultado Esperado:**
        -   Todas las sesiones seleccionadas se eliminan.

-   **Test 2.3.3:** Eliminar todas las sesiones usando "Seleccionar Todas".
    -   **Pasos:**
        1.  Detener varias sesiones.
        2.  Hacer clic en la casilla "Seleccionar Todas" de la cabecera de la tabla.
        3.  Hacer clic en "Eliminar Seleccionadas (X)".
        4.  Confirmar.
    -   **Resultado Esperado:**
        -   Todas las sesiones se eliminan.

-   **Test 2.3.4:** Cancelar eliminación.
    -   **Pasos:**
        1.  Seleccionar una o más sesiones para eliminar.
        2.  Hacer clic en "Eliminar Seleccionadas".
        3.  Cancelar en el diálogo de confirmación.
    -   **Resultado Esperado:**
        -   Las sesiones no se eliminan.


## 3. Gestión de Proyectos (Modal de Historial)

### 3.1 Creación de Proyectos
-   **Test 3.1.1:** Crear proyecto con nombre válido.
    -   **Pasos:**
        1.  Abrir modal, pestaña "Gestionar Proyectos".
        2.  Ingresar un nombre en "Nombre del nuevo proyecto" (ej. "Diseño Web").
        3.  Hacer clic en "Crear".
    -   **Resultado Esperado:**
        -   El nuevo proyecto aparece en la lista de proyectos.
        -   El campo de entrada se limpia.
        -   El proyecto se guarda en `appProjects_v1` en `localStorage`.

-   **Test 3.1.2:** Intentar crear proyecto con nombre vacío.
    -   **Pasos:**
        1.  Dejar vacío el campo "Nombre del nuevo proyecto".
        2.  Hacer clic en "Crear".
    -   **Resultado Esperado:**
        -   Se muestra una alerta indicando que el nombre no puede estar vacío.
        -   No se crea ningún proyecto.

### 3.2 Eliminación de Proyectos
-   **Test 3.2.1:** Eliminar un proyecto.
    -   **Pasos:**
        1.  Crear un proyecto.
        2.  Seleccionar la casilla del proyecto.
        3.  Hacer clic en "Eliminar Seleccionados (1)".
        4.  Confirmar.
    -   **Resultado Esperado:**
        -   El proyecto se elimina de la lista y de `appProjects_v1`.
        -   Si alguna sesión estaba asignada a este proyecto, su `projectId` se actualiza a `null`.

-   **Test 3.2.2:** Eliminar múltiples proyectos.
    -   **Pasos:**
        1.  Crear varios proyectos.
        2.  Seleccionar varios.
        3.  Hacer clic en "Eliminar Seleccionados (X)" y confirmar.
    -   **Resultado Esperado:**
        -   Los proyectos seleccionados se eliminan. Sesiones asociadas se desasignan.

### 3.3 Finalización de Proyectos
-   **Test 3.3.1:** Finalizar un proyecto con sesiones.
    -   **Pasos:**
        1.  Crear un proyecto "Proyecto A".
        2.  Crear dos sesiones: Sesión1 (10 min), Sesión2 (5 min). Asignar ambas a "Proyecto A".
        3.  En la pestaña Proyectos, hacer clic en el icono "Finalizar" (tick) para "Proyecto A".
    -   **Resultado Esperado:**
        -   "Proyecto A" se marca como "(Finalizado)".
        -   Se muestra la duración total calculada (ej. 00:15:00).
        -   En `appProjects_v1`, `isFinalized: true` y `finalizedTotalDuration` se guarda.
        -   El icono de finalizar cambia a "Reabrir".

-   **Test 3.3.2:** Finalizar un proyecto sin sesiones.
    -   **Pasos:**
        1.  Crear "Proyecto B" sin asignarle sesiones.
        2.  Finalizar "Proyecto B".
    -   **Resultado Esperado:**
        -   "Proyecto B" se marca como "(Finalizado)" con duración 00:00:00.

### 3.4 Reapertura de Proyectos
-   **Test 3.4.1:**
    -   **Pasos:**
        1.  Finalizar un proyecto (Test 3.3.1).
        2.  Hacer clic en el icono "Reabrir" (flecha circular) para ese proyecto.
    -   **Resultado Esperado:**
        -   El proyecto ya no está marcado como "(Finalizado)".
        -   La duración total finalizada desaparece y se muestra la duración dinámica (si hay sesiones).
        -   En `appProjects_v1`, `isFinalized: false` y `finalizedTotalDuration` se elimina o pone a `undefined`.
        -   El icono de reabrir cambia a "Finalizar".
        -   Ahora se pueden asignar nuevas sesiones a este proyecto.

### 3.5 Visualización y Ordenación de Proyectos
-   **Test 3.5.1:**
    -   **Pasos:**
        1.  Crear ProyA, ProyB (activo), ProyC (finalizado), ProyD (activo).
    -   **Resultado Esperado:**
        -   En la lista, los proyectos se ordenan: primero los activos (ProyA, ProyB, ProyD - alfabéticamente entre ellos), luego los finalizados (ProyC - alfabéticamente).
        -   Los proyectos finalizados muestran su estado y duración registrada. Los activos muestran duración dinámica.

## 4. Persistencia en `localStorage`

### 4.1 Carga de Estado
-   **Test 4.1.1:** Persistencia de sesión activa.
    -   **Pasos:**
        1.  Iniciar una sesión. Dejarla correr unos segundos. Pausarla.
        2.  Recargar la página.
    -   **Resultado Esperado:**
        -   La sesión activa se restaura con su tiempo transcurrido, estado de pausa y `totalPausedDuration`.

-   **Test 4.1.2:** Persistencia de sesiones completadas y proyectos.
    -   **Pasos:**
        1.  Crear varios proyectos.
        2.  Completar varias sesiones, algunas asignadas a proyectos.
        3.  Finalizar algún proyecto.
        4.  Recargar la página.
        5.  Abrir el modal de Historial.
    -   **Resultado Esperado:**
        -   Todas las sesiones completadas, proyectos (con su estado de finalización y duración) y asignaciones se restauran correctamente.

### 4.2 Manejo de Datos Corruptos (Conceptual)
-   **Test 4.2.1:** (Difícil de simular manualmente sin corromper `localStorage` intencionadamente)
    -   **Pasos:**
        1.  Manualmente editar una entrada en `localStorage` (ej. `appActiveSession_v1`) para que sea JSON inválido o tenga una estructura incorrecta.
        2.  Recargar la página.
    -   **Resultado Esperado:**
        -   La aplicación debería cargar sin errores fatales.
        -   La entrada corrupta debería ser ignorada o eliminada de `localStorage`.
        -   Se podría ver un `console.warn` o `console.error` sobre los datos corruptos.

## 5. UI/UX General

### 5.1 Navegación y Modal
-   **Test 5.1.1:** Abrir y cerrar modal.
    -   **Pasos:**
        1.  Hacer clic en "HISTORIAL Y PROYECTOS".
        2.  Hacer clic en el botón "X" del modal o presionar la tecla "Escape" (si está implementado, no especificado).
    -   **Resultado Esperado:**
        -   El modal se abre y se cierra correctamente.

-   **Test 5.1.2:** Cambio de pestañas en modal.
    -   **Pasos:**
        1.  Abrir modal.
        2.  Alternar entre las pestañas "Sesiones Grabadas" y "Gestionar Proyectos".
    -   **Resultado Esperado:**
        -   El contenido cambia correctamente. La pestaña activa se resalta visualmente.
        -   Las selecciones (checkboxes) se resetean al cambiar de pestaña.

### 5.2 Botones "Seleccionar Todo"
-   **Test 5.2.1:**
    -   **Pasos:**
        1.  En la pestaña Sesiones (con varias sesiones), hacer clic en "Seleccionar Todo".
        2.  Volver a hacer clic en "Seleccionar Todo".
    -   **Resultado Esperado:**
        -   Todas las sesiones se seleccionan. Al segundo clic, todas se deseleccionan.
        -   Repetir para la pestaña Proyectos.

### 5.3 Widget Flotante
-   **Test 5.3.1:** Vista sin sesión activa.
    -   **Pasos:**
        1.  Asegurar que no hay sesión activa.
    -   **Resultado Esperado:**
        -   El widget muestra el Header, el `CurrentSessionManager` con el botón "Iniciar Nueva Sesión", el botón "HISTORIAL Y PROYECTOS" y el Footer.

-   **Test 5.3.2:** Vista con sesión activa.
    -   **Pasos:**
        1.  Iniciar una sesión.
    -   **Resultado Esperado:**
        -   El widget se simplifica y solo muestra el `CurrentSessionManager` con el temporizador y los controles de la sesión activa (Detener, Pausar/Reanudar). No hay Header, ni Footer, ni botón de Historial.

### 5.4 Responsividad
-   **Test 5.4.1:**
    -   **Pasos:**
        1.  Redimensionar la ventana del navegador a diferentes anchos (móvil, tablet, escritorio).
    -   **Resultado Esperado:**
        -   El widget flotante y el modal se adaptan razonablemente bien, sin solapamientos importantes o elementos cortados.
        -   El texto y los botones siguen siendo legibles y utilizables.

### 5.5 Estado de Carga
-   **Test 5.5.1:**
    -   **Pasos:**
        1.  (Si es posible simular una carga lenta, o al menos observar en la primera carga) Recargar la página.
    -   **Resultado Esperado:**
        -   Se muestra brevemente el mensaje "Cargando datos..." antes de que aparezca la interfaz principal.

Este plan de pruebas cubre las funcionalidades esenciales. Se pueden añadir más casos específicos o de borde según sea necesario.
