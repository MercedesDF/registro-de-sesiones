# Registro de Sesiones y Proyectos v1.0.1

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

- **React 19**
- **TypeScript** (con transpilación en el navegador a través de **Babel Standalone**)
- **Tailwind CSS** (CDN)
- **esm.sh** (para importaciones de módulos sin `node_modules`)
- **Iconos SVG** (incrustados directamente)

## Cómo Ejecutar

Esta aplicación está diseñada para ejecutarse directamente en un navegador moderno sin necesidad de un paso de compilación local o instalación de dependencias de Node.js. Esto se logra mediante el uso de:
- **Babel Standalone**: Un transpilador que se ejecuta en el navegador para convertir el código TypeScript (TSX) a JavaScript que el navegador pueda entender.
- **Import Maps y esm.sh**: Para cargar dependencias como React directamente desde una CDN.

### Requisito: Servidor Web
Debido a que la aplicación utiliza módulos ES6 (`import`/`export`) y necesita cargar archivos como `index.tsx`, debe ser servida a través de un servidor HTTP. No funcionará abriendo `index.html` directamente desde el sistema de archivos (`file:///`).

Puedes usar cualquier servidor HTTP simple. Aquí algunos ejemplos:

*   **VS Code Live Server**: Si usas Visual Studio Code, la extensión "Live Server" es una excelente opción. Haz clic derecho en `index.html` y selecciona "Open with Live Server".
*   **Python HTTP Server**:
    ```bash
    # Si tienes Python 3.x (común en Linux/WSL2)
    python3 -m http.server
    # O si tienes Python 2.x o una versión más antigua
    # python -m SimpleHTTPServer
    ```
    Luego abre `http://localhost:8000` (o el puerto que indique) en tu navegador.
*   **Node.js `serve`**:
    ```bash
    npx serve .
    ```
    Luego abre la URL que te indique (generalmente `http://localhost:3000`).


## Despliegue en GitHub Pages

Puedes desplegar esta aplicación gratuitamente usando GitHub Pages. Asumiendo que ya tienes tu proyecto como un repositorio Git y los cambios confirmados, y estás usando una terminal Linux/Ubuntu/WSL2:

1.  **Crea un Repositorio en GitHub**:
    Si aún no lo has hecho, ve a [GitHub](https://github.com/new) y crea un nuevo repositorio. No inicialices con un README, .gitignore o licencia si ya los tienes localmente.

2.  **Conecta tu Repositorio Local con GitHub (si no lo has hecho)**:
    Reemplaza `TU_USUARIO` y `TU_REPOSITORIO` con tu nombre de usuario y el nombre del repositorio de GitHub.
    ```bash
    # Asegúrate de estar en la raíz de tu proyecto en la terminal
    # Si es un proyecto nuevo y no es un repositorio git:
    # git init -b main
    # git add .
    # git commit -m "Initial commit of project files"

    # Si ya tienes un remote llamado 'origin', puedes omitir este paso o actualizar la URL.
    # Para añadir el remote:
    git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
    
    # Verifica que el remote se haya añadido correctamente
    git remote -v
    ```

3.  **Sube tu Código a GitHub**:
    Asegúrate de que todos tus archivos (`index.html`, `index.tsx`, `App.tsx`, `components/`, `utils/`, `types.ts`, `metadata.json`, `favicon.ico`, `README.md`) están confirmados en tu rama principal (generalmente `main`).
    ```bash
    # Verifica tu rama actual (ej. 'main')
    git branch

    # Si necesitas confirmar cambios:
    # git add .
    # git commit -m "Prepare for GitHub Pages deployment"

    # Sube tus cambios a la rama principal de GitHub
    git push -u origin main  # O el nombre de tu rama principal si es diferente
    ```

4.  **Configura GitHub Pages en tu Repositorio**:
    *   Ve a tu repositorio en GitHub (`https://github.com/TU_USUARIO/TU_REPOSITORIO`).
    *   Haz clic en la pestaña "Settings" (Configuración).
    *   En el menú lateral izquierdo, busca la sección "Pages" (Páginas) bajo "Code and automation".
    *   En la sección "Build and deployment":
        *   Bajo "Source", selecciona "Deploy from a branch".
        *   Bajo "Branch", asegúrate de que esté seleccionada tu rama principal (ej. `main`) y la carpeta `/ (root)`.
        *   Haz clic en "Save".

5.  **Accede a tu Aplicación**:
    GitHub Pages tomará unos minutos para construir y desplegar tu sitio. Una vez listo, podrás acceder a él desde una URL similar a:
    `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

    La URL exacta se mostrará en la sección "Pages" de la configuración de tu repositorio una vez que el despliegue esté completo y aparezca un mensaje indicando que tu sitio está publicado.

**Importante**:
*   Gracias a la configuración con Babel Standalone, no necesitas un paso de compilación previo. GitHub Pages servirá los archivos tal cual, y la transpilación ocurrirá en el navegador del visitante.
*   Asegúrate de que tu archivo `index.html` utiliza rutas relativas para los assets (ej. `./index.tsx`, `./favicon.ico`) para que funcione correctamente cuando se sirva desde la subruta del repositorio en GitHub Pages. Esto ya está configurado en el proyecto.
*   Si tu repositorio es privado, necesitarás una cuenta de GitHub Pro, Team o Enterprise Cloud para desplegar con GitHub Pages. Para repositorios públicos, es gratuito.

## Enlaces del Proyecto y Contacto

-   **Repositorio GitHub**: [MercedesDF/02-registro-de-sesiones (v1.0.1)](https://github.com/MercedesDF/02-registro-de-sesiones-v1.0.0)
-   **LinkedIn (Principal)**: [mercedesdf](https://www.linkedin.com/in/mercedesdf)
-   **LinkedIn (Ingeniería)**: [mercedesdf-ingenieria](https://www.linkedin.com/in/mercedesdf-ingenieria)
-   **Contacto**: `mercedev@mercedev.es`

## Contribuciones

Actualmente, este es un proyecto personal. Para sugerencias o reporte de errores, contactar a través del correo electrónico proporcionado.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

&copy; 2024-2025 mercedev