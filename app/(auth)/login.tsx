import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';

export default function LoginScreen() {
    const [correo, setEmail] = useState('');
    const [contra, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user, login } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            // Redirige al usuario a la pantalla correspondiente si ya está autenticado
            if (user.tipo === 2) {
                router.replace('/(app)/(teacher)/TeacherHomeScreen');
            } else if (user.tipo === 1) {
                router.replace('/(app)/(student)/StudentHomeScreen');
            }
        }
    }, [user]);

    const handleLogin = async () => {
        try {
            const result = await login(correo, contra);
            if (!result.success) {
                setErrorMessage(result.error || 'Error al iniciar sesión');
            } else {
                setErrorMessage('');
                if (result.isFirstLogin) {
                    router.replace('/(auth)/changePassword')
                    Alert.alert('Primer login', 'Debes cambiar tu contraseña');
                } else {
                    Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
                }
            }
        } catch (error) {
            setErrorMessage('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
        }
    };

    const isFormValid = correo.trim() !== '' && contra.trim() !== '';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                label="Email"
                mode="outlined"
                value={correo}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                cursorColor='#007BFF'
                activeOutlineColor='#007BFF'
            />
            <TextInput
                label="Contraseña"
                mode="outlined"
                value={contra}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                cursorColor='#007BFF'
                activeOutlineColor='#007BFF'
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                disabled={!isFormValid} // Deshabilitar el botón si el formulario no es válido
                buttonColor='#007BFF'
            >
                Iniciar Sesión
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        marginTop: 16,
    },
});