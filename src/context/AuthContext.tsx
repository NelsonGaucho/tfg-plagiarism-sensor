
import React, { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcrypt';

type User = {
  email: string;
  password: string; // Esta será la contraseña hasheada
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SALT_ROUNDS = 12; // Factor de costo para bcrypt

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
    
    // Validar entrada de usuario
    const sanitizedEmail = sanitizeInput(email);
    if (!isValidEmail(sanitizedEmail)) return false;
    
    // Verificar si existe el usuario con ese email
    const foundUser = users.find((u: User) => u.email === sanitizedEmail);
    
    if (foundUser) {
      // Comparar contraseña usando bcrypt
      try {
        // Nota: En situaciones normales, bcrypt.compareSync NO es recomendado en el cliente
        // ya que bloquea el hilo principal. En una aplicación real, esto se haría en el servidor.
        const match = bcrypt.compareSync(password, foundUser.password);
        
        if (match) {
          // No guardar la contraseña hasheada en localStorage por seguridad
          const safeUser = { email: foundUser.email, password: '' };
          setUser(safeUser);
          localStorage.setItem('user', JSON.stringify(safeUser));
          return true;
        }
      } catch (error) {
        console.error("Error al verificar contraseña:", error);
      }
    }
    
    return false;
  };

  const register = (email: string, password: string): boolean => {
    // Validar entrada de usuario
    const sanitizedEmail = sanitizeInput(email);
    if (!isValidEmail(sanitizedEmail) || !isValidPassword(password)) {
      return false;
    }
    
    // Obtener usuarios actuales
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar si el correo ya está registrado
    if (users.some((u: User) => u.email === sanitizedEmail)) {
      return false;
    }
    
    try {
      // Hashear contraseña
      const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
      
      // Añadir nuevo usuario con contraseña hasheada
      const newUser = { email: sanitizedEmail, password: hashedPassword };
      users.push(newUser);
      
      // Guardar usuarios actualizados
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto-login después del registro (sin guardar contraseña hasheada)
      const safeUser = { email: sanitizedEmail, password: '' };
      setUser(safeUser);
      localStorage.setItem('user', JSON.stringify(safeUser));
      
      return true;
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Función para sanitizar input
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  // Validación básica de correo electrónico
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación básica de contraseña
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Datos de demostración para pruebas
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      // Añadir un usuario de demostración si no hay usuarios
      try {
        const demoPassword = bcrypt.hashSync('123456', SALT_ROUNDS);
        const demoUser = { email: 'demo@ejemplo.com', password: demoPassword };
        localStorage.setItem('users', JSON.stringify([demoUser]));
        console.log('Usuario demo creado: ', { email: demoUser.email, password: '123456' });
      } catch (error) {
        console.error("Error al crear usuario demo:", error);
      }
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
