
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Función para sanitizar entrada
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitizar entradas
    const sanitizedEmail = sanitizeInput(email);
    
    if (password !== confirmPassword) {
      toast({
        title: 'Error en la contraseña',
        description: 'Las contraseñas no coinciden.',
        variant: 'destructive',
      });
      return;
    }
    
    if (register(sanitizedEmail, password)) {
      toast({
        title: 'Registro exitoso',
        description: 'Tu cuenta ha sido creada correctamente.',
      });
      navigate('/');
    } else {
      toast({
        title: 'Error en el registro',
        description: 'Este correo electrónico ya está registrado o los datos son inválidos.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Crear cuenta</CardTitle>
            <CardDescription>
              Introduce tus datos para registrarte
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@ejemplo.com"
                  required
                  aria-describedby="email-validation"
                  pattern="[^<>]*@[^<>]*\.[^<>]*"
                  title="Introduce un correo electrónico válido"
                />
                <p id="email-validation" className="text-xs text-muted-foreground">
                  Introduce un correo electrónico válido
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  aria-describedby="password-validation"
                />
                <p id="password-validation" className="text-xs text-muted-foreground">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar contraseña
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">
                Registrarse
              </Button>
              <p className="text-sm text-center">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-primary underline">
                  Inicia sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
