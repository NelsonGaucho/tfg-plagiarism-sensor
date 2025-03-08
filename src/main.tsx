
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Iniciando la aplicación");

// Asegurarse de que el elemento root exista
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("No se pudo encontrar el elemento 'root'. Verifica tu HTML.");
} else {
  console.log("Elemento root encontrado, procediendo a renderizar la aplicación");
  createRoot(rootElement).render(
    <App />
  );
  console.log("Aplicación renderizada correctamente");
}
