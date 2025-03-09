
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PricingPage from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import { useState, useEffect } from "react";

// Create a QueryClient instance with default options to handle errors better
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("Rendering App component");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("App mounted successfully");
    return () => {
      console.log("App unmounted");
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
        <h1>Error inesperado en la aplicación</h1>
        <p>Ha ocurrido un error al cargar la aplicación:</p>
        <pre style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '4px',
          overflowX: 'auto' 
        }}>
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          Recargar página
        </button>
      </div>
    );
  }

  try {
    // Siempre usar HashRouter para GitHub Pages
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <AuthProvider>
            <TooltipProvider>
              <HashRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </HashRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  } catch (e) {
    console.error("Error rendering application:", e);
    const error = e instanceof Error ? e : new Error(String(e));
    setError(error);
    return null;
  }
};

export default App;
