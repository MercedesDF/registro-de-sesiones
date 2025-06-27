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

Guía para desplegar proyecto Vite con gh-pages en GitHub Pages

1. Asegúrate de tener Git y un repositorio en GitHub

Tu proyecto debe estar conectado a un repositorio en GitHub.

La rama principal suele ser main o master.

Si no lo has hecho:

git init
git remote add origin https://github.com/tu-usuario/tu-repo.git
git add .
git commit -m "Proyecto inicial"
git push -u origin main

2. Instala la dependencia gh-pages

npm install --save-dev gh-pages

3. Configura el base en vite.config.js

Abre o crea el archivo vite.config.js en la raíz de tu proyecto y asegúrate que incluye la configuración correcta del base (la ruta de tu repo):

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/tu-repo/',  // Cambia 'tu-repo' por el nombre real de tu repo GitHub
})
Esto es fundamental para que los enlaces y recursos se carguen bien.

4. Añade scripts en package.json

Edita tu package.json y bajo "scripts" agrega estos comandos:

"scripts": {
  "build": "vite build",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

build: construye el proyecto listo para producción.

predeploy: se ejecuta antes del deploy para crear la carpeta dist.

deploy: sube la carpeta dist a la rama gh-pages usando la librería gh-pages.

5. Ejecuta el despliegue

Cada vez que quieras publicar o actualizar la web:

npm run deploy

Este comando hará:

Construir el proyecto con vite build.

Subir el contenido generado (dist) a la rama gh-pages.

6. Configura GitHub Pages en GitHub

Entra a tu repositorio en GitHub.

Ve a Settings > Pages.

En Source, selecciona:

Rama: gh-pages

Carpeta: / (root)

Guarda.

7. Visita tu página web

Pasados unos minutos, tu web estará accesible en:

https://tu-usuario.github.io/tu-repo/

8. Flujo típico para actualizar el proyecto

Modifica código en tu rama principal (main).

Haz commit y push:

git add .
git commit -m "Cambios en el proyecto"
git push origin main

Ejecuta despliegue para actualizar la web:

npm run deploy

5.  **Accede a tu Aplicación**:
    GitHub Pages tomará unos minutos para construir y desplegar tu sitio. Una vez listo, podrás acceder a él desde una URL similar a:
    `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

    La URL exacta se mostrará en la sección "Pages" de la configuración de tu repositorio una vez que el despliegue esté completo y aparezca un mensaje indicando que tu sitio está publicado.

## Enlaces del Proyecto y Contacto

-   **En acción**: [MercedesDF/egistro-de-sesiones](https://mercedesdf.github.io/registro-de-sesiones)
-   **LinkedIn (Principal)**: [mercedesdf](https://www.linkedin.com/in/mercedesdf)
-   **LinkedIn (Ingeniería)**: [mercedesdf-ingenieria](https://www.linkedin.com/in/mercedesdf-ingenieria)
-   **Contacto**: `mercedev@mercedev.es`

## Contribuciones

Actualmente, este es un proyecto personal. Para sugerencias o reporte de errores, contactar a través del correo electrónico proporcionado.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

&copy; 2024-2025 mercedev