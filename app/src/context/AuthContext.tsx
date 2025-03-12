import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

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

    const login = async (user: User, token: string) => {
        setUser(user);
        setToken(token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
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