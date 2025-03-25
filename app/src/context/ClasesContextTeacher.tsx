import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getClaseActualTeacher as fetchClaseActual, getHorarioTeacher as fetchHorario } from '../services/clases/clasesServicesTeacher';
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

interface ClaseHorario {
  idclase: number;
  inicioclase: string;
  finalclase: string;
  idgrupo: number;
  gruponombre: string;
  idmateria: number;
  nombremateria: string;
  salonid: number;
  salonnombre: string;
}


interface ClasesContextProps {
  claseActual: Clase | null;
  getClaseActual: () => Promise<void>;
  horario: ClaseHorario[];
  getHorario: () => Promise<void>;
}

export const ClasesContext = createContext<ClasesContextProps>({
  claseActual: null,
  getClaseActual: async () => { },
  horario: [],
  getHorario: async () => { },
});

export const ClasesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [claseActual, setClaseActual] = useState<Clase | null>(null);
  const [horario, setHorario] = useState<ClaseHorario[]>([]);

  const getClaseActual = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user');
      if (!userData) throw new Error('No hay usuario guardado.');

      const user = JSON.parse(userData);
      console.log('Obteniendo clase actual para el usuario:', user);

      const response = await fetchClaseActual(user.id);

      console.log('Respuesta del servicio: ', response);

      if (response && response.status === 200) {
        setClaseActual(response.data.clase);
      }
    } catch (error) {
      console.error('Error al cargar clase actual:', error);
      setClaseActual(null);
    }
  };

  const getHorario = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user');
      if (!userData) throw new Error('No hay usuario guardado.');
      const user = JSON.parse(userData);

      const response = await fetchHorario(user.id);
      console.log('Horario desde context:', response);

      if (response && response.status === 200) {
        setHorario(response.data.clases);
      }
    } catch (error) {
      console.error('Error al cargar horario:', error);
      setHorario([]);
    }
  };

  useEffect(() => {
    getClaseActual();
    getHorario();
  }, []);

  return (
    <ClasesContext.Provider value={{ claseActual, getClaseActual, horario, getHorario }}>
      {children}
    </ClasesContext.Provider>
  );
};

export default ClasesProvider;
