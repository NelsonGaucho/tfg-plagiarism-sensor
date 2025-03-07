
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Asegurarse de que el elemento root exista
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("No se pudo encontrar el elemento 'root'. Verifica tu HTML.");
} else {
  createRoot(rootElement).render(<App />);
  console.log("Aplicación renderizada correctamente");
}
