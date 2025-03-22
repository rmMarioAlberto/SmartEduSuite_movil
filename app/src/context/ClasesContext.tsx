import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getClaseActual as fetchClaseActual} from '../../src/services/clases/clasesServices';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

interface Clase {
  id: number;
  materia: string;
  grupo: string;
  salon: string;
  horaInicio: string;
  horaFin: string;
}

interface ClasesContextProps {
  claseActual: Clase | null;
  getClaseActual: () => Promise<void>;
}

export const ClasesContext = createContext<ClasesContextProps>({
  claseActual: null,
  getClaseActual: async () => { },
});

export const ClasesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [claseActual, setClaseActual] = useState<Clase | null>(null);

  const getClaseActual = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user');
      if (!userData) throw new Error('No hay usuario guardado.');

      const user = JSON.parse(userData);
      const response = await fetchClaseActual(user.id);
      
      console.log('Clase actual desde context:', response);

      if (response && response.status === 200) {
        setClaseActual(response.data.clase);
      }
    } catch (error) {
      console.error('Error al cargar clase actual:', error);
      setClaseActual(null); // Reset si hay error.
    }
  };

  useEffect(() => {
    getClaseActual();
  }, []);

  return (
    <ClasesContext.Provider value={{ claseActual, getClaseActual }}>
      {children}
    </ClasesContext.Provider>
  );
};

export default ClasesProvider;
