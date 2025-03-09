
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

export function LoginButton() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [credits, setCredits] = useState<number>(0);
  const [hasUnlimited, setHasUnlimited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCredits();
    }
  }, [isAuthenticated, user]);

  const fetchCredits = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      console.log("Fetching credits...");
      // Safely call the function
      let data, error;
      try {
        const response = await supabase.functions.invoke('check-credits');
        data = response.data;
        error = response.error;
      } catch (invokeError) {
        console.error("Error invoking function:", invokeError);
        error = invokeError;
      }
      
      if (error) {
        console.error("Error fetching credits:", error);
        return;
      }
      
      console.log("Credits data:", data);
      setCredits(data?.creditsCount || 0);
      setHasUnlimited(data?.hasUnlimited || false);
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCreditsText = () => {
    if (loading) return 'Cargando...';
    if (hasUnlimited) return 'Créditos ilimitados';
    return `${credits} créditos`;
  };

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
                <span>{getCreditsText()}</span>
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
