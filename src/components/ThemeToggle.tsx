
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="rounded-full w-10 h-10 transition-all duration-300 ease-in-out"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300" />
      )}
    </Button>
  );
}
