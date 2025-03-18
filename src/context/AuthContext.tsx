import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as authLogin } from '../services/auth/authServices';
import { useRouter } from 'expo-router';

interface User {
  id: number;
  nombre: string;
  apellidoMa: string;
  apellidoPa: string;
  correo: string;
  tipo: number;
  status: number;
  huella: string;
  idGoogle: string | null;
  idGrupo: number;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (correo: string, contra: string) => Promise<{ success: boolean, isFirstLogin?: boolean, error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: () => Promise.resolve({ success: false }), // Pendiente.
  logout: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        const userToken = await SecureStore.getItemAsync('token');
        if (userData && userToken) {
          setUser(JSON.parse(userData));
          setToken(userToken);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };

    loadUser();
  }, []);

  const login = async (correo: string, contra: string): Promise<{ success: boolean, isFirstLogin?: boolean, error?: string }> => {
    try {

      // Primero necesitamos acceder a data, user y token.
      const response = await authLogin(correo, contra);
      const { user, token, isFirstLogin } = response.data;

      console.log( 'Datos recibidos del backend: ', response.data );
      console.log ( 'Token a guardar: ', token, typeof token );

      await SecureStore.setItemAsync('user', JSON.stringify(user));

      if ( !token ) {
        throw new Error('No se recibió token del servidor.');
      }

      if ( !user ) {
        throw new Error('No se recibió user del servidor.');
      }
      
      // Con esto, nos aseguramos de que el token sea un String.
      await SecureStore.setItemAsync('token', String(token));
      await SecureStore.setItemAsync('token', token);

      setUser(user);
      setToken(token);

      if (isFirstLogin) {
        router.push('/(auth)/ChangePasswordScreen');
      } else {
        if (user.tipo === 2) {
          router.push('/(app)/(teacher)/TeacherHomeScreen');
        } else if (user.tipo === 1) {
          router.push('/(app)/(student)/StudentHomeScreen');
        } else {
          console.warn('El tipo de usuario es desconocido.');
        }
      }

      return { success: true, isFirstLogin };
    } catch (error: any) {
      console.error('Login fallido:', error);
      return { success: false, error: error.message };
    }
  };


  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync('user');
    await SecureStore.deleteItemAsync('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;