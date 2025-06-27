# Cómo se Hizo: Arquitectura y Decisiones Técnicas

Este documento detalla las decisiones de diseño y arquitectura detrás de la aplicación "Registro de Sesiones y Proyectos".

## Filosofía del Proyecto

El objetivo principal era crear una herramienta de seguimiento de tiempo simple, funcional y **sin necesidad de un proceso de compilación local**. Esto la hace extremadamente fácil de ejecutar, modificar y desplegar en cualquier host estático, como GitHub Pages, sin requerir conocimientos de Node.js, npm o webpack por parte del usuario.

## Pila Tecnológica (Tech Stack)

*   **React 19**: Se eligió por su modelo de componentes reutilizables y su eficiente manejo del estado. Funcionalidades como `useState`, `useEffect` y `useCallback` son la base para gestionar la lógica de la aplicación de manera declarativa.
*   **TypeScript**: Aporta seguridad de tipos al código. Al definir interfaces claras para `Session` y `Project`, se minimizan los errores en tiempo de ejecución y se mejora drásticamente la mantenibilidad y la experiencia del desarrollador.
*   **Tailwind CSS (vía CDN)**: Se utiliza para un diseño rápido y consistente a través de clases de utilidad. Cargarla desde una CDN evita tener que instalarla y procesarla localmente, alineándose con la filosofía de "sin compilación".
*   **Babel Standalone**: Esta es la pieza clave que permite el enfoque "sin compilación". Se carga como un script en `index.html` y se encarga de **transpilar el código TSX (TypeScript con JSX) a JavaScript estándar directamente en el navegador del usuario**. Esto elimina la barrera de entrada más grande para muchos desarrolladores novatos.
*   **Import Maps y esm.sh**: En lugar de gestionar `node_modules`, la aplicación utiliza *Import Maps* en `index.html` para decirle al navegador dónde encontrar las dependencias (como `react` y `react-dom`). `esm.sh` es una CDN que sirve estos paquetes como módulos ES6 nativos.

## Arquitectura del Código

El proyecto está estructurado de forma modular para facilitar su comprensión y escalabilidad.

*   **`index.html`**: Es el punto de entrada. Su rol es:
    1.  Definir la estructura básica del DOM, incluyendo el `<div id="root">`.
    2.  Cargar las dependencias externas: Tailwind CSS y Babel Standalone.
    3.  Definir el `importmap` para que el navegador resuelva `import 'react'` a la URL de la CDN de `esm.sh`.
    4.  Cargar el script principal de la aplicación (`index.tsx`) con `type="text/babel"`, indicando a Babel Standalone que debe procesarlo.

*   **`index.tsx`**: Su única responsabilidad es encontrar el elemento `#root` en el DOM y renderizar el componente principal `App` dentro de él.

*   **`App.tsx`**: Es el cerebro de la aplicación.
    *   **Gestión de Estado**: Utiliza `useState` para manejar los tres pilares de datos: `activeSession`, `completedSessions` y `projects`.
    *   **Persistencia de Datos**: Emplea `useEffect` para leer y escribir en `localStorage` cada vez que el estado relevante cambia. Incluye lógica de sanitización para evitar que datos corruptos rompan la aplicación al cargar.
    *   **Lógica de Negocio**: Contiene todos los manejadores de eventos (`handleStartSession`, `handleAddProject`, etc.) que modifican el estado. Se utiliza `useCallback` para optimizar el rendimiento y evitar la recreación innecesaria de funciones.
    *   **Renderizado Condicional**: Decide qué vista mostrar: la interfaz simplificada cuando hay una sesión activa, o la interfaz completa (con el modal de historial) cuando no la hay.

*   **`components/`**: Carpeta con los componentes de React reutilizables.
    *   `CurrentSessionManager.tsx`: Gestiona la UI de la sesión activa (temporizador, botones de control). Es un componente "consciente del estado" que recibe la sesión activa y funciones de callback.
    *   `ProjectManagementModal.tsx`: Un componente complejo que encapsula toda la funcionalidad del historial y la gestión de proyectos, incluyendo las pestañas, las listas, la selección múltiple y los formularios.
    *   `Header.tsx`: Un componente de presentación simple y estático.

*   **`types.ts`**: Define las interfaces `Session` y `Project`. Centralizar los tipos aquí asegura consistencia en toda la aplicación.

*   **`utils/time.ts`**: Contiene funciones puras de utilidad para formatear duraciones y fechas, manteniendo la lógica de presentación separada de los componentes.

## Decisiones Clave de UX

*   **Widget Flotante**: La aplicación vive en un popup fijo para ser accesible desde cualquier parte de una página (si se integrara en una más grande) sin ser intrusiva.
*   **Vista de Sesión Activa Simplificada**: Al iniciar una sesión, la interfaz se reduce al mínimo (solo el temporizador y los controles) para eliminar distracciones y enfocar al usuario en la tarea que está cronometrando.
*   **Confirmación `beforeunload`**: Para prevenir la pérdida accidental de una sesión en curso, se advierte al usuario si intenta cerrar la pestaña con un temporizador activo.
*   **Persistencia Transparente**: El usuario no necesita hacer clic en "Guardar". Todos los cambios se persisten automáticamente en `localStorage`, creando una experiencia fluida.
