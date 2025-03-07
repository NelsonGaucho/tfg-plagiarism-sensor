
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Comprobar si hay un usuario guardado en localStorage al cargar
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar si existe el usuario y la contraseña coincide
    const foundUser = users.find((u: User) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const register = (email: string, password: string): boolean => {
    // Obtener usuarios actuales
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar si el correo ya está registrado
    if (users.some((u: User) => u.email === email)) {
      return false;
    }
    
    // Añadir nuevo usuario
    const newUser = { email, password };
    users.push(newUser);
    
    // Guardar usuarios actualizados
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login después del registro
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Datos de demostración para pruebas
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      // Añadir un usuario de demostración si no hay usuarios
      const demoUser = { email: 'demo@ejemplo.com', password: '123456' };
      localStorage.setItem('users', JSON.stringify([demoUser]));
      console.log('Usuario demo creado: ', demoUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
