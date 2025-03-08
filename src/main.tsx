
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Starting application");

// Ensure root element exists
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Could not find 'root' element. Check your HTML.");
} else {
  console.log("Root element found, proceeding to render application");
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log("Application rendered successfully");
}
