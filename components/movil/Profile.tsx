import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface ProfileProps {
    name: string;
    correo: string;
    role: string;
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ name, correo, role, onLogout }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil de Usuario</Text>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{name}</Text>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{correo}</Text>
            <Text style={styles.label}>Rol:</Text>
            <Text style={styles.value}>{role}</Text>
            <Button title="Cerrar Sesión" onPress={onLogout} />
        </View>
    );
};

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
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    value: {
        fontSize: 18,
        marginBottom: 8,
    },
});

export default Profile;