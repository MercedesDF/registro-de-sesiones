# Registro de Sesiones y Proyectos v1.0.0

Una aplicación web para registrar manualmente las sesiones de trabajo y asignarlas a proyectos. Permite iniciar y detener temporizadores para llevar un control del tiempo invertido, incluyendo funcionalidad de pausa y reanudación.

## Características Principales

- **Seguimiento Manual de Sesiones**: Inicia, pausa, reanuda y detiene temporizadores para registrar el tiempo de trabajo.
- **Gestión de Proyectos**: Crea proyectos y asigna sesiones completadas a ellos.
- **Cálculo de Duración Efectiva**: El tiempo de pausa se descuenta de la duración total de la sesión.
- **Finalización de Proyectos**: Marca proyectos como finalizados, calculando y almacenando su tiempo total invertido. Posibilidad de reabrir proyectos.
- **Persistencia de Datos**: Toda la información (sesiones activas, sesiones completadas, proyectos) se guarda en el `localStorage` del navegador, persistiendo entre visitas.
- **Interfaz de Popup Flotante**: La aplicación se presenta como un widget o popup fijo en la esquina de la ventana del navegador.
- **Historial Detallado**: Visualiza un historial de todas las sesiones completadas, con opción de asignarlas a proyectos o eliminarlas.
- **Selección Múltiple**: Permite seleccionar múltiples sesiones o proyectos para eliminarlos en lote.
- **Diseño Responsivo**: Adaptado para una correcta visualización en diferentes tamaños de pantalla, enfocado en su uso como widget.
- **Confirmación de Salida**: Advierte al usuario si intenta cerrar la pestaña con una sesión activa.

## Tech Stack

- **React 19** (utilizando ESM.sh para importaciones directas sin `node_modules`)
- **TypeScript**
- **Tailwind CSS** (CDN)
- **Iconos SVG** (incrustados directamente)

## Cómo Ejecutar

Esta aplicación está diseñada para ejecutarse directamente en un navegador moderno sin necesidad de un paso de compilación complejo o instalación de dependencias de Node.js.

1.  **Servidor Web Local**:
    Debido a que la aplicación utiliza módulos ES6 (`import`/`export`), los archivos deben ser servidos a través de un servidor HTTP. No funcionará abriendo `index.html` directamente desde el sistema de archivos (`file:///`).
    Puedes usar cualquier servidor HTTP simple. Aquí algunos ejemplos:

    *   **VS Code Live Server**: Si usas Visual Studio Code, la extensión "Live Server" es una excelente opción. Haz clic derecho en `index.html` y selecciona "Open with Live Server".
    *   **Python HTTP Server**:
        ```bash
        # Si tienes Python 3.x
        python -m http.server
        ```
        Luego abre `http://localhost:8000` en tu navegador.
    *   **Node.js `serve`**:
        ```bash
        npx serve .
        ```
        Luego abre la URL que te indique (generalmente `http://localhost:3000`).

2.  **Abrir en el Navegador**:
    Una vez que el servidor esté corriendo, abre la dirección proporcionada (ej. `http://localhost:8000` o `http://localhost:3000`) en tu navegador web.

## Enlaces del Proyecto y Contacto

-   **Repositorio GitHub**: [MercedesDF/02-registro-de-sesiones-v1.0.0](https://github.com/MercedesDF/02-registro-de-sesiones-v1.0.0)
-   **LinkedIn (Principal)**: [mercedesdf](https://www.linkedin.com/in/mercedesdf)
-   **LinkedIn (Ingeniería)**: [mercedesdf-ingenieria](https://www.linkedin.com/in/mercedesdf-ingenieria)
-   **Contacto**: `mercedev@mercedev.es`

## Contribuciones

Actualmente, este es un proyecto personal. Para sugerencias o reporte de errores, contactar a través del correo electrónico proporcionado.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

&copy; 2024-2025 mercedev
