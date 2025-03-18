import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
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
            const userId = await AsyncStorage.getItem('userId');
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
        <View>
            <Text>Cambiar contraseña</Text>
            <TextInput
                placeholder="Nueva contraseña"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                placeholder="Confirmar contraseña"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Button title="Guardar" onPress={handleChangePassword} />
        </View>
    );
}
