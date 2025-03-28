import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as authLogin } from '../services/auth/authServices';
import { logout as authLogout } from '../services/auth/authServices';
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
  tokenMovil: string | null;
  login: (correo: string, contra: string) => Promise<{ success: boolean, isFirstLogin?: boolean, error?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  tokenMovil: null,
  login: () => Promise.resolve({ success: false }), // Pendiente.
  logout: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokenMovil, setTokenMovil] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        const userTokenMovil = await SecureStore.getItemAsync('tokenMovil');
        if (userData && userTokenMovil) {
          setUser(JSON.parse(userData));
          setTokenMovil(userTokenMovil);
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
      console.log('Datos recibidos del backend: ', response);
      const { user, tokenMovil, isFirstLogin, message } = response.data;

      console.log('Token a guardar: ', tokenMovil, typeof tokenMovil);

      await SecureStore.setItemAsync('user', JSON.stringify(user));

      // Guardar el idUsuario en SecureStore
      if (user && user.id) {
        await SecureStore.setItemAsync('idUsuario', user.id.toString());
      } else {
        console.warn('No se encontró el id del usuario.');
      }

      if (!tokenMovil) {
        console.warn('Token vacío, algo salió mal');
        return { success: false, error: message || 'No se recibió token del servidor.' };
      }


      if (!user) {
        throw new Error(message || 'No se recibió user del servidor.');
      }

      // Con esto, nos aseguramos de que el token sea un String.
      await SecureStore.setItemAsync('tokenMovil', String(tokenMovil));

      setUser(user);
      setTokenMovil(tokenMovil);

      if (isFirstLogin) {
        router.push('/(auth)/changePassword');
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
    try {
      if (user && tokenMovil) {

        // Se llama al servicio para eliminar el token de la bd.
        await authLogout(user.id);

        // Se elimina el token y usuario del SecureStore.
        await SecureStore.deleteItemAsync('user');
        await SecureStore.deleteItemAsync('tokenMovil');

        setUser(null);
        setTokenMovil(null);

        router.push('/(auth)/login');
      } else {
        console.warn('No hay usuario o token para cerrar sesión.')
      }

    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, tokenMovil, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;