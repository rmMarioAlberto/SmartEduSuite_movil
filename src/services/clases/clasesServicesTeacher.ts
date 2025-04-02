import * as SecureStore from 'expo-secure-store';

export const saveUserSession = async (idUsuario: number, tokenMovil: string) => {
    try {
        console.log('Guardando sesión de usuario: ', idUsuario, tokenMovil);
        await SecureStore.setItemAsync('idUsuario', idUsuario.toString());
        await SecureStore.setItemAsync('tokenMovil', tokenMovil);
        console.log('Sesión guardada exitosamente');
    } catch (error) {
        console.error('Error al guardar sesión de usuario:', error);
    }
};

export const claseActualTeacher = async (idUsuario: number, logout: () => void) => {
    try {
        const tokenMovil = await SecureStore.getItemAsync('tokenMovil');
        if (!tokenMovil) {
            throw new Error('No se encontró el token de sesión.');
        }

        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/clasesActivasMaestro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUsuario, token: tokenMovil }),
        });

        const data = await response.json();

        switch (response.status) {
            case 200:
                console.log('Clases activas obtenidas exitosamente');
                return { status: response.status, data };
            case 400:
                throw new Error(data.message || 'Usuario no encontrado');
            case 401:
                console.warn('Token inválido o expirado. Cerrando sesión...');
                logout();
                throw new Error(data.message || 'Token inválido o expirado.');
            case 404:
                // En lugar de lanzar un error, devuelve un objeto con un mensaje
                return { status: response.status, data: null, message: 'No hay clases activas' };
            case 500:
                throw new Error(data.message || 'Error en el servidor');
            default:
                if (!response.ok) {
                    throw new Error(data.message || 'Error desconocido');
                }
        }
    } catch (error) {
        console.error('Error al obtener las clases activas:', error);
        throw error;
    }
}
export const horarioTeacher = async (idUsuario: number, logout: () => void) => {
    try {
        const tokenMovil = await SecureStore.getItemAsync('tokenMovil');
        if (!tokenMovil) {
            throw new Error('No se encontró el token de sesión.');
        }

        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/horarioMaestro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUsuario, token: tokenMovil }),
        });

        const data = await response.json();

        switch (response.status) {
            case 200:
                console.log('Horario obtenido exitosamente');
                return { status: response.status, data };
            case 400:
                throw new Error(data.message || 'Usuario no encontrado');
            case 401:
                console.warn('Token inválido o expirado. Cerrando sesión...');
                logout();
                throw new Error(data.message || 'Token inválido o expirado.');
            case 404:
                throw new Error(data.message || 'No hay horario disponible.');
            case 500:
                throw new Error(data.message || 'Error en el servidor');
            default:
                if (!response.ok) {
                    throw new Error(data.message || 'Error desconocido');
                }
        }
    } catch (error) {
        console.error('Error al obtener el horario:', error);
        throw error;
    }
}