
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
  
  // Add error boundary for the entire app to prevent white screen issues
  try {
    root.render(<App />);
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
