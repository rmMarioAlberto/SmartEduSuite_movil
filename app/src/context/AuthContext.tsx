// filepath: [AuthContext.tsx](http://_vscodecontentref_/11)
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { login as authLogin } from '../services/auth/authServices';
import ChangePasswordScreen from '../../(auth)/changePasswordScreen';

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
  login: (correo: string, contra: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const userToken = await AsyncStorage.getItem('token');
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

  const login = async (correo: string, contra: string) => {
    try {
      const { user, token, isFirstLogin } = await authLogin(correo, contra);
      if (isFirstLogin) {
        navigation.navigate('ChangePasswordScreen');
        return;
      } else {
        setUser(user);
        setToken(token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
      }
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;