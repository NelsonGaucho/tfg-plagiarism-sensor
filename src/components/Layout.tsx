
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';
import { LoginButton } from './LoginButton';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  console.log("Renderizando componente Layout");
  
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/70 fixed top-0 w-full z-10">
        <div className="page-container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
              Detector de Plagio TFG
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="text-foreground hover:text-primary transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
                    Premium
                  </Link>
                </li>
              </ul>
            </nav>
            <LoginButton />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 page-container pt-24">
        {children}
      </main>
      <footer className="border-t border-border/40 backdrop-blur-sm bg-background/70">
        <div className="page-container py-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Detector de Plagio TFG. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
