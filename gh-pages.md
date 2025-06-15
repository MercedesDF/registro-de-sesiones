Instala el paquete gh-pages en tu proyecto:

sh
npm install --save-dev gh-pages
Configura tu package.json añadiendo un script para publicar. Dentro de "scripts", agrega esto:

json
"scripts": {
  "deploy": "gh-pages -d dist"
}
Aquí dist es la carpeta donde se genera tu versión estática. Si usas React, es build.

Asegúrate de tener tu repositorio correctamente configurado:

Si aún no lo has hecho, inicia Git y agrega la URL de tu repositorio:

sh
git remote add origin https://github.com/tu-usuario/tu-repo.git
Despliega tu proyecto ejecutando:

sh
npm run build  # Genera los archivos estáticos
npm run deploy  # Publica en GitHub Pages
Esto creará una nueva rama gh-pages en tu repositorio y servirá los archivos desde allí. Luego puedes acceder a tu sitio web en https://tu-usuario.github.io/tu-repo/. 🚀