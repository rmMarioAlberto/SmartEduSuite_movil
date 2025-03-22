export const login = async (correo: string, contra: string) => {
    let isFirstLogin = false;

    try {
        const response = await fetch(
            'https://smar-edu-suite-backend.vercel.app/movil/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, contra })
        });

        const data = await response.json();

        // Con esto, solo retornará la respuesta y otro componente lo manejará. :p 
        return { status: response.status, data };

    } catch (error) {
        console.error('Error en el login:', error);
        throw error;
    }
};

export const changePassword = async (id: string, newPassword: string) => {
    try {
        const response = await fetch(
            'https://smar-edu-suite-backend.vercel.app/movil/change-password',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, newPassword })
            }
        );

        const data = await response.json();

        switch (response.status) {
            case 200:
                console.log('Contraseña cambiada exitosamente');
                return data;
            case 400:
                throw new Error('Nueva contraseña es requerida');
            case 404:
                throw new Error('Usuario no encontrado');
            case 500:
                throw new Error('Error en el servidor');
            default:
                if (!response.ok) {
                    throw new Error(data.message || 'Error desconocido');
                }
        }
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        throw error;
    }
};

import * as SecureStore from 'expo-secure-store';

export const logout = async (idUsuario: number) => {
    try {
        const tokenMovil = await SecureStore.getItemAsync('tokenMovil');
        if (!tokenMovil) {
            throw new Error('No se encontró el token de sesión.');
        }

        console.log('Enviando al backend:', { idUsuario, tokenMovil });
        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUsuario, tokenMovil }),
        });
        console.log(`${idUsuario} ------  ${tokenMovil}`);

        const data = await response.json();
        console.log('Respuesta del backend logout: ', data);

        if (!response.ok) {
            throw new Error(data.message + (data.err ? ' - ' + JSON.stringify(data.err) : '') || 'Error al cerrar sesión.');
        }

        return data;
    } catch (error) {
        console.error('Error en el logout:', error);
        throw error;
    }
};