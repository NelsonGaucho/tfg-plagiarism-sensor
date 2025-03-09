
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Crear archivo .nojekyll en la carpeta dist durante la compilación
  if (command === 'build') {
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }
    fs.writeFileSync('dist/.nojekyll', '');
    
    // También crear un archivo 404.html que redirija al index.html
    const redirectHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Detector de Plagio TFG</title>
    <script type="text/javascript">
      // Redirigir a la página principal manteniendo la ruta
      var segmentCount = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?p=/' +
        l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
        (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
    <h1>Redirigiendo...</h1>
  </body>
</html>`;
    fs.writeFileSync('dist/404.html', redirectHTML);
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip'],
          }
        }
      }
    },
    // Configuración para GitHub Pages
    base: './',
  };
});
