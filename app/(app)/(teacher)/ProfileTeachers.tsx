import React from 'react';
import Profile from '@/components/movil/Profile';

import { NavigationProp } from '@react-navigation/native';

const ProfileTeachers = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const handleLogout = () => {
    // Lógica para cerrar sesión
    navigation.navigate('Login');
  };

  return (
    <Profile
      name="John Doe"
      email="teacher@example.com"
      role="Maestro"
      onLogout={handleLogout}
    />
  );
};

export default ProfileTeachers;