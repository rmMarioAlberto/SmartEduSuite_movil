import React from 'react';
import Profile from '@/app/components/Profile';

const ProfileStudents = ({ navigation }) => {
    const handleLogout = () => {
        // Lógica para cerrar sesión
        navigation.navigate('Login');
    };

    return (
        <Profile
            name="Jane Doe"
            email="student@example.com"
            role="Estudiante"
            onLogout={handleLogout}
        />
    );
};

export default ProfileStudents;