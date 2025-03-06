
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/70 fixed top-0 w-full z-10">
        <div className="page-container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              TFG Plagiarism Sensor
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 page-container pt-24">
        {children}
      </main>
      <footer className="border-t border-border/40 backdrop-blur-sm bg-background/70">
        <div className="page-container py-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} TFG Plagiarism Sensor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
