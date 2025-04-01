import * as SecureStore from 'expo-secure-store';

interface ScanQRResponse {
    message: string;
    result?: any;
    tipoAsistencia?: string; // Hacerlo opcional ya que no siempre estará presente
}

export const scanQR = async (
    classId: string,
    startTime: string,
    validDuration: number,
    qrIdentifier: string
): Promise<ScanQRResponse> => {
    try {
        const idUsuario = await SecureStore.getItemAsync('idUsuario');
        const tokenMovil = await SecureStore.getItemAsync('tokenMovil');

        if (!idUsuario) {
            throw new Error('No se encontró el id de usuario.');
        }
        if (!tokenMovil) {
            throw new Error('No se encontró el token de sesión.');
        }

        const response = await fetch('https://smar-edu-suite-backend.vercel.app/movil/paseLista', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                classId,
                startTime,
                validDuration,
                idUsuario,
                token: tokenMovil,
                qrIdentifier
            }),
        });

        const data: ScanQRResponse = await response.json();

        // Manejo de respuestas según el código de estado
        if (response.ok) {
            return data; // Retornar la respuesta de la API para que el componente la maneje
        } else {
            // Aquí puedes manejar mensajes informativos como advertencias
            return { message: data.message || 'Error desconocido.' }; // Retornar el mensaje sin lanzar un error
        }
    } catch (error) {
        console.error('Error al registrar el pase de lista:', error);
        throw error; // Lanzar el error para que el componente lo maneje si es necesario
    }
};