import React, { useContext } from 'react';
import Profile from '../../../components/movil/Profile';
import { AuthContext } from '../../../src/context/AuthContext';

const ProfileStudents = () => {
    const { logout, user } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Profile
            name={`${user?.nombre} ${user?.apellidoPa} ${user?.apellidoMa}`}
            correo={user?.correo}
            role="Alumno."
            onLogout={handleLogout}
        />
    );
};

export default ProfileStudents;