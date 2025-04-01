import * as SecureStore from 'expo-secure-store';

export const login = async (correo: string, contra: string) => {
    try {
        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, contra })
        });

        const data = await response.json();

        // Verificar los diferentes códigos de estado
        switch (response.status) {
            case 200:
                // Login exitoso normal
                await saveUserSession(data.user.id, data.tokenMovil);
                return { 
                    status: response.status, 
                    data,
                    isFirstLogin: false
                };

            case 300:
                // Primer login (usuario sin contraseña)
                await saveUserSession(data.user.id, data.tokenMovil);
                return { 
                    status: response.status, 
                    data,
                    isFirstLogin: true
                };

            case 301:
                // Usuario deshabilitado
                throw new Error('Usuario deshabilitado');

            case 400:
                // Datos faltantes
                throw new Error(data.message || 'Faltan datos en la solicitud');

            case 401:
                // Credenciales incorrectas
                throw new Error('Credenciales incorrectas');

            case 403:
                // Sin permisos para la app móvil
                throw new Error('No tienes permisos para acceder a esta aplicación');

            case 404:
                // Usuario no encontrado
                throw new Error('Usuario no encontrado');

            case 500:
                // Error de servidor
                throw new Error('Error en el servidor. Intenta más tarde.');

            default:
                throw new Error(data.message || 'Error desconocido en el login');
        }
    } catch (error) {
        console.error('Error en el login:', error);
        throw error;
    }
};

// Función auxiliar para guardar la sesión del usuario
const saveUserSession = async (userId: number, token: string) => {
    try {
        await SecureStore.setItemAsync('tokenMovil', token);
        await SecureStore.setItemAsync('idUsuario', userId.toString());
    } catch (error) {
        console.error('Error al guardar la sesión:', error);
        throw new Error('No se pudo guardar la sesión del usuario');
    }
};

export const changePassword = async (id: string, newPassword: string) => {
    try {
        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cambiar la contraseña');
        }

        return data;
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const idUsuario = await SecureStore.getItemAsync('idUsuario');
        const tokenMovil = await SecureStore.getItemAsync('tokenMovil');

        if (!idUsuario || !tokenMovil) {
            throw new Error('No se encontró el token de sesión o el ID de usuario.');
        }

        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUsuario: parseInt(idUsuario, 10), tokenMovil }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cerrar sesión.');
        }

        // Limpiar el token de sesión
        await SecureStore.deleteItemAsync('tokenMovil');
        await SecureStore.deleteItemAsync('idUsuario');

        return data;
    } catch (error) {
        console.error('Error en el logout:', error);
        throw error;
    }
};