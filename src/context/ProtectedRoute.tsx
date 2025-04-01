import React, { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useRouter } from 'expo-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserType?: number; // Define el tipo de usuario permitido para esta ruta (opcional)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedUserType }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Si no hay usuario autenticado, redirige al login
      router.replace('/(auth)/login');
    } else if (allowedUserType && user.tipo !== allowedUserType) {
      // Si el tipo de usuario no coincide, redirige a la vista correcta
      if (user.tipo === 1) {
        router.replace('/(app)/(student)/StudentHomeScreen');
      } else if (user.tipo === 2) {
        router.replace('/(app)/(teacher)/TeacherHomeScreen');
      }
    }
  }, [user, allowedUserType, router]);

  // Renderiza los hijos solo si el usuario está autenticado y tiene el tipo correcto
  return user && (!allowedUserType || user.tipo === allowedUserType) ? <>{children}</> : null;
};

export default ProtectedRoute;