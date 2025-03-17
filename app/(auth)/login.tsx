import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { login as loginService } from '../src/services/auth/authServices';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from 'expo-router';
import ChangePasswordScreen from './changePasswordScreen';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const data = await loginService(email, password);
            setErrorMessage('');

            // Guardar token y userId en SecureStore
            await SecureStore.setItemAsync('token', data.token);
            await SecureStore.setItemAsync('userId', data.user.id.toString());

            // Verificar si es el primer login
            if (data.isFirstLogin) {
                Alert.alert(
                    'Primer inicio de sesión',
                    'Debes cambiar tu contraseña antes de continuar.',
                    [{ text: 'OK', onPress: () => navigation.navigate('ChangePasswordScreen') }]
                );
            } else {
                console.log('Inicio de sesión exitoso');
            }

        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <Button title="Iniciar Sesión" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#cccccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },
});
