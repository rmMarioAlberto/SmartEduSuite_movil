import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { changePassword } from '../src/services/auth/authServices';
import { useRouter } from 'expo-router';

export default function ChangePasswordScreen() {
    const router = useRouter();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            const userData = await SecureStore.getItemAsync('user');
            if (!userData) {
                Alert.alert('Error', 'No se pudo obtener la información del usuario');
                return;
            }
            
            const user = JSON.parse(userData);
            const userId = user.id;
            
            if (!userId) {
                Alert.alert('Error', 'No se pudo encontrar el ID de usuario');
                return;
            }
            
            await changePassword(userId, newPassword);
            Alert.alert('Éxito', 'Contraseña cambiada exitosamente');

            router.push('/(auth)/login');
        } catch (error) {
            Alert.alert('Error', 'No se pudo cambiar la contraseña');
            console.error('Error changing password:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cambiar contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Button title="Guardar" onPress={handleChangePassword} />
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
