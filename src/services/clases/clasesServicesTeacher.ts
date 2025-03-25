import * as SecureStore from 'expo-secure-store';

export const getClaseActualTeacher = async (idUsuario: number) => {
    try {
        const tokenMovil = await SecureStore.getItemAsync('tokenMovil');
        if (!tokenMovil) {
            throw new Error('No se encontró el token de sesión.');
        }

        console.log( 'Token obtenido de SecureStore: ', tokenMovil );

        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/claseActualTeacher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUsuario, tokenMovil }),
        });

        console.log('Respuesta de la clase actual:', response);
        const data = await response.json();

        console.log('Datos JSON recibidos (clase actual): ', data);

        switch (response.status) {
            case 200:
                return { status: response.status, data };
            case 400:
                throw new Error(data.message || 'Faltan datos en la solicitud.');
            case 401:
                throw new Error(data.message || 'Token inválido o expirado.');
            case 404:
                throw new Error(data.message || 'No hay clases activas.');
            case 500:
                throw new Error('Error en el servidor al consultar la clase actual.');
            default:
                if (!response.ok) {
                    throw new Error(data.message || 'Error desconocido al consultar clase actual.');
                }
        }

    } catch (error) {
        console.log('Error al obtner la clase actual: ', error);
        throw error;
    }

}

export const getHorarioTeacher = async (idUsuario: number) => {
    try {
        const tokenMovil = await SecureStore.getItemAsync('tokenMovil');
        if (!tokenMovil) {
            throw new Error('No se encontró el token de sesión.');
        }

        console.log( 'Token obtenido de SecureStore: ', tokenMovil );

        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/horarioTeacher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUsuario, tokenMovil }),
        });

        console.log('Respuesta de la clase actual:', response);

        const data = await response.json();
        console.log('Datos JSON recibidos (clase actual): ', data);


        switch (response.status) {
            case 200:
                return { status: response.status, data };
            case 400:
                throw new Error(data.message || 'Faltan datos en la solicitud.');
            case 401:
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
        console.log('Error al obtener el horario: ', error);
        throw error;
    }
}
