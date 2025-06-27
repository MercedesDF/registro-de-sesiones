# Guía de Resolución de Errores (Troubleshooting)

Esta guía te ayudará a solucionar los problemas más comunes que podrías encontrar al usar o desarrollar la aplicación.

---

### Problema: La aplicación no carga, la página está en blanco.

*   **Causa Más Probable**: Estás intentando abrir el archivo `index.html` directamente en el navegador desde tu sistema de archivos (usando una URL `file:///...`).
*   **Explicación**: La aplicación utiliza módulos de JavaScript (`import`/`export`), que por razones de seguridad, los navegadores solo permiten cargar cuando la página se sirve a través de un protocolo HTTP (o HTTPS).
*   **Solución**: Debes usar un servidor web local. Aquí tienes algunas opciones sencillas:
    1.  **VS Code + Live Server**: Si usas Visual Studio Code, instala la extensión "Live Server", haz clic derecho en `index.html` y selecciona "Open with Live Server".
    2.  **Python**: Abre una terminal en la carpeta del proyecto y ejecuta `python3 -m http.server`. Luego, visita `http://localhost:8000` en tu navegador.
    3.  **Node.js**: Abre una terminal y ejecuta `npx serve .`. Luego, visita la URL que te indique (normalmente `http://localhost:3000`).

---

### Problema: Mis cambios en los archivos `.tsx` no se reflejan en el navegador.

*   **Causa**: El navegador está usando una versión en caché de los archivos.
*   **Solución**: Realiza una "recarga forzada" para obligar al navegador a descargar las versiones más recientes de los archivos.
    *   **Windows/Linux**: `Ctrl + Shift + R`
    *   **Mac**: `Cmd + Shift + R`
    *   Alternativamente, abre las herramientas de desarrollador (F12), ve a la pestaña "Red" (Network) y marca la opción "Desactivar caché" (Disable cache).

---

### Problema: Todas mis sesiones y proyectos han desaparecido.

*   **Causa 1**: Borraste los datos del sitio desde la configuración de tu navegador.
*   **Causa 2**: Estás usando el modo de navegación privada o de incógnito. `localStorage` no persiste entre sesiones en este modo.
*   **Explicación**: La aplicación guarda todos tus datos en una característica del navegador llamada `localStorage`. Estos datos son específicos para el navegador y el perfil de usuario que estás utilizando.
*   **Solución**:
    *   Asegúrate de no estar en modo incógnito si quieres que tus datos persistan.
    *   Evita borrar los "datos de sitios y cookies" para esta aplicación si quieres conservar tu historial.
    *   Recuerda que si usas la aplicación en Chrome y luego en Firefox, los datos no se compartirán, ya que cada navegador tiene su propio `localStorage`.

---

### Problema: El temporizador parece saltar o no actualizarse correctamente.

*   **Causa**: Es un comportamiento normal de los navegadores modernos llamado "throttling". Para ahorrar batería y recursos, los navegadores reducen la frecuencia de actualización de las pestañas que están en segundo plano.
*   **Explicación**: Aunque los "ticks" visuales del segundero puedan ralentizarse o detenerse cuando la pestaña no está visible, el cálculo de la duración total sigue siendo preciso. La duración se calcula en base a la hora de inicio (`startTime`) y la hora actual (`Date.now()`), no sumando los segundos uno a uno.
*   **Solución**: No es un error que necesite solución. Cuando vuelvas a la pestaña, verás que el temporizador se "corrige" instantáneamente al tiempo transcurrido real.

---

### Problema: Veo un error en la consola que dice "No se pudo encontrar el elemento raíz...".

*   **Causa**: El archivo `index.html` ha sido modificado y se ha eliminado o cambiado el `<div>` donde se monta la aplicación de React.
*   **Solución**: Asegúrate de que tu `index.html` contenga exactamente `<div id="root"></div>` dentro de la etiqueta `<body>`.

---

### Problema: La aplicación no carga y veo errores de CORS en la consola.

*   **Causa**: La aplicación no puede cargar sus dependencias (React) desde la CDN (`esm.sh`). Esto puede deberse a un problema con tu conexión a internet, un firewall, una extensión del navegador que bloquea scripts, o una interrupción temporal del servicio de la CDN.
*   **Solución**:
    1.  Verifica tu conexión a internet.
    2.  Intenta acceder a `https://esm.sh/react` directamente en tu navegador. Si no carga, el problema es externo.
    3.  Desactiva temporalmente extensiones de bloqueo de anuncios o scripts para ver si son la causa.
