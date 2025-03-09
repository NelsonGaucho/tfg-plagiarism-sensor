
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Starting application");

// Ensure root element exists
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Could not find 'root' element. Check your HTML.");
  // Crear un elemento de fallback para mostrar el error
  const fallbackElement = document.createElement('div');
  fallbackElement.innerHTML = `
    <div style="padding: 20px; font-family: system-ui;">
      <h1>Error al iniciar la aplicación</h1>
      <p>No se encontró el elemento 'root'. Revise el HTML.</p>
    </div>
  `;
  document.body.appendChild(fallbackElement);
} else {
  console.log("Root element found, proceeding to render application");
  const root = createRoot(rootElement);
  
  // Add error boundary for the entire app to prevent white screen issues
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Application rendered successfully");
  } catch (error) {
    console.error("Failed to render application:", error);
    // Display a fallback UI instead of blank screen
    root.render(
      <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
        <h1>Something went wrong</h1>
        <p>The application failed to load. Please refresh the page.</p>
        <pre>{String(error)}</pre>
      </div>
    );
  }
}

// Agregar un listener para capturar errores no controlados
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
  const rootEl = document.getElementById("root");
  if (rootEl && rootEl.innerHTML === '') {
    rootEl.innerHTML = `
      <div style="padding: 20px; font-family: system-ui;">
        <h1>Error inesperado</h1>
        <p>Ocurrió un error inesperado. Por favor, recarga la página.</p>
        <pre>${event.error?.message || 'Error desconocido'}</pre>
      </div>
    `;
  }
});
