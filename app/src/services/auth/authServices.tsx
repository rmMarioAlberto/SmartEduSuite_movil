export const login = async (correo: string, contra: string) => {
    let isFirstLogin = false; // Flag to check if it's the first login

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

        if (!response.ok) {
            throw new Error(data.message || 'Error desconocido');
        }

        // Asegúrate de usar 'tokenMovil' en lugar de 'token'.
        if (data.user && data.tokenMovil) {
            isFirstLogin = data.user.firstLogin; // Check if it's the first login

            if (data.user.tipo === 3) {
                throw new Error('El tipo de usuario no tiene acceso al sistema');
            }
            return { user: data.user, token: data.tokenMovil, isFirstLogin }; // Return the flag

        } else {
            throw new Error("Datos de usuario o token no válidos ${data.user} hhh");
        }
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