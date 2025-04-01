// (app)/(student)/ProfileStudents.js
import React, { useContext } from 'react';
import Profile from '../../../components/movil/Profile';
import { AuthContext } from '../../../src/context/AuthContext';
import ProtectedRoute  from '../../../src/context/ProtectedRoute';


const ProfileStudents = () => {
  const { localLogout, user } = useContext(AuthContext);

  const handleLogout = async () => {
    await localLogout();
  };

  return (
    <ProtectedRoute allowedUserType={1}>
    <Profile
      name={`${user?.nombre} ${user?.apellidoPa} ${user?.apellidoMa}`}
      correo={user?.correo}
      role="Alumno"
      onLogout={handleLogout}
    />
    </ProtectedRoute>
  );
};

export default ProfileStudents;