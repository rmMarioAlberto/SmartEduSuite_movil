import * as SecureStore from 'expo-secure-store';

export const getClasesActivasDiaAlumno = async (idUsuario: number, logout: () => void) => {
    try {
        const tokenMovil = await SecureStore.getItemAsync('tokenMovil');
        if (!tokenMovil) {
            throw new Error('No se encontró el token de sesión.');
        }

        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/clasesActivasAlumno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUsuario, token: tokenMovil }),
        });

        const data = await response.json();

        switch (response.status) {
            case 200:
                return { status: response.status, data };
            case 400:
                throw new Error(data.message || 'Faltan datos en la solicitud.');
            case 401:
                console.warn('Token inválido o expirado. Cerrando sesión...');
                logout();
                throw new Error(data.message || 'Token inválido o expirado.');
            case 404:
                throw new Error(data.message || 'No hay clases activas.');
            case 500:
                throw new Error('Error en el servidor al consultar las clases activas.');
            default:
                if (!response.ok) {
                    throw new Error(data.message || 'Error desconocido al consultar clases activas.');
                }
        }
    } catch (error) {
        console.log('Error al obtener las clases activas del día: ', error);
        throw error;
    }
}

export const getHorarioDiaAlumno = async (idUsuario: number, logout: () => void) => {
    try {
        const tokenMovil = await SecureStore.getItemAsync('tokenMovil');
        if (!tokenMovil) {
            throw new Error('No se encontró el token de sesión.');
        }

        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/horarioAlumno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUsuario, token: tokenMovil }),
        });

        const data = await response.json();

        switch (response.status) {
            case 200:
                return { status: response.status, data };
            case 400:
                throw new Error(data.message || 'Faltan datos en la solicitud.');
            case 401:
                console.warn('Token inválido o expirado. Cerrando sesión...');
                logout();
                throw new Error(data.message || 'Token inválido o expirado.');
            case 404:
                throw new Error(data.message || 'No hay horario disponible.');
            case 500:
                throw new Error('Error en el servidor al consultar el horario.');
            default:
                if (!response.ok) {
                    throw new Error(data.message || 'Error desconocido al consultar el horario.');
                }
        }
    } catch (error) {
        console.log('Error al obtener el horario del día: ', error);
        throw error;
    }
}