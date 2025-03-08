
import React from 'react';
import { User, Diamond } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function LoginButton() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-5 w-5" />
          {isAuthenticated && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isAuthenticated ? (
          <>
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium">{user?.email}</p>
              <div className="flex items-center mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                <Diamond className="h-4 w-4 mr-1.5" />
                <span>0 créditos</span>
              </div>
            </div>
            <DropdownMenuItem onClick={() => navigate('/pricing')}>
              Comprar créditos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Cerrar sesión
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => navigate('/login')}>
              Iniciar sesión
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/register')}>
              Registrarse
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
