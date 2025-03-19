import React, { useContext } from 'react';
import Profile from '../../../components/movil/Profile';
import { AuthContext } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';


const ProfileTeachers = () => {
  const { logout, user } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <Profile
      name={'${user?.nombre} ${user?.apellidoPa} ${user?.apellidoMa}'}
      correo= { user?.correo }
      role="Maestro"
      onLogout={handleLogout}
    />
  );
};

export default ProfileTeachers;
