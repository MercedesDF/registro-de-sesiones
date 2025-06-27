# Glosario de Términos

Este documento define los conceptos y términos clave utilizados en el código y la interfaz de la aplicación.

### Términos de la Aplicación

*   **Sesión (Session)**: La unidad fundamental de seguimiento de tiempo. Representa un único bloque de trabajo. Sus propiedades clave son `id`, `startTime`, `endTime`, `isPaused`, `totalPausedDuration` y `projectId`.
*   **Sesión Activa (Active Session)**: Una sesión que ha sido iniciada pero aún no detenida. Solo puede haber una sesión activa a la vez. Su estado y visualización son gestionados por el componente `CurrentSessionManager`.
*   **Sesión Completada (Completed Session)**: Una sesión que ha sido detenida. Tiene una fecha de inicio (`startTime`) y de fin (`endTime`). Se almacena en el historial y puede ser asignada a un proyecto.
*   **Proyecto (Project)**: Una categoría o etiqueta a la que se pueden asignar las sesiones completadas para organizar el trabajo. Sus propiedades son `id`, `name` y `isFinalized`.
*   **Proyecto Finalizado (Finalized Project)**: Un proyecto que se ha marcado como completado. En el momento de la finalización, se calcula su duración total sumando las duraciones de todas sus sesiones asignadas. No se pueden asignar nuevas sesiones a un proyecto finalizado a menos que se reabra.
*   **Duración Efectiva (Effective Duration)**: Representa el tiempo real de trabajo de una sesión, excluyendo las pausas. Se calcula con la fórmula: `(endTime - startTime) - totalPausedDuration`.

### Términos Técnicos (React y Web)

*   **Componente (Component)**: Bloques de construcción reutilizables que conforman la interfaz de usuario en React. Por ejemplo, `Header`, `CurrentSessionManager` y `ProjectManagementModal` son componentes.
*   **Estado (State)**: Datos internos que un componente de React gestiona y que pueden cambiar con el tiempo, provocando que el componente se vuelva a renderizar. Se gestiona principalmente con el hook `useState`.
*   **Hook**: Funciones especiales de React que permiten "engancharse" a sus características. Los más usados en este proyecto son:
    *   `useState`: Para añadir estado a los componentes funcionales.
    *   `useEffect`: Para ejecutar efectos secundarios (como la carga/guardado en `localStorage`) después de que el componente se renderice.
    *   `useCallback`: Para memoizar funciones y evitar que se recreen en cada renderizado, optimizando el rendimiento.
    *   `useMemo`: Para memoizar valores calculados (como las listas ordenadas), evitando recalcularlos en cada renderizado.
*   **Props (Propiedades)**: Datos que se pasan de un componente padre a un componente hijo para configurarlo.
*   **Transpilación (Transpilation)**: El proceso de convertir código fuente de un lenguaje a otro. En este proyecto, **Babel Standalone** transpila el código TSX (TypeScript + JSX) a JavaScript estándar que los navegadores pueden ejecutar.
*   **localStorage**: Una API del navegador que permite a las aplicaciones web almacenar datos (clave-valor) de forma persistente en el dispositivo del usuario, sin fecha de caducidad.
*   **Import Map**: Una característica del navegador que permite controlar las URLs que se obtienen al usar `import`. Se usa en `index.html` para mapear nombres de paquetes como `react` a una URL de una CDN como `esm.sh`.
