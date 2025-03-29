import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { claseActualTeacher, horarioTeacher } from '../../../src/services/clases/clasesServicesTeacher';

type RootStackParamList = {
  TeacherHome: undefined;
  QRScanner: undefined;
};

type TeacherHomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TeacherHome'>;
type TeacherHomeScreenRouteProp = RouteProp<RootStackParamList, 'TeacherHome'>;

type Props = {
  navigation: TeacherHomeScreenNavigationProp;
  route: TeacherHomeScreenRouteProp;
};

const TeacherHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [claseActual, setClaseActual] = useState<any>(null);
  const [horario, setHorario] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idUsuario = await SecureStore.getItemAsync('idUsuario');
        console.log('idUsuario recuperado: ', idUsuario);
        if (!idUsuario) {
          throw new Error('No se encontró el id de usuario.');
        }
        const userId = parseInt(idUsuario, 10);

        const claseActualData = await claseActualTeacher(userId);
        setClaseActual(claseActualData);

        const horarioData = await horarioTeacher(userId);
        setHorario(horarioData.clases); // Asegúrate de acceder a la propiedad correcta
      } catch (error) {
        console.error('Error al obtener la clase actual o el horario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.currentClass}>
        <Text style={styles.currentClassText}>Clase actual: </Text>
        {claseActual ? (
          <>
            <Text style={styles.currentClassName}>{claseActual.nombreClase}</Text>
            <Text style={styles.currentClassDetails}>Grupo: {claseActual.grupo}</Text>
            <Text style={styles.currentClassDetails}>Salón: {claseActual.salon}</Text>
          </>
        ) : (
          <Text>No hay clase actual.</Text>
        )}
        <TouchableOpacity 
          style={styles.qrButton}
          onPress={() => navigation.navigate('QRScanner')}
        >
          <Text style={styles.qrButtonText}>Generar QR</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.schedule}>
        {horario.length > 0 ? (
          horario.map((clase, index) => (
            <View key={index}>
              <Text style={styles.day}>{clase.dia}</Text>
              <Text style={styles.classTime}>{`${clase.inicio} - ${clase.final} - ${clase.nombremateria}. Grupo: ${clase.gruponombre}. Salón: ${clase.salonnombre}`}</Text>          
      </View>
          ))
        ) : (
          <Text>No hay horario disponible.</Text>
        )}
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 45,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  currentClass: {
    backgroundColor: '#e0f7fa',
    padding: 10,
    margin: 10,
    borderRadius: 22,
    position: 'relative',
  },
  currentClassText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentClassName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  currentClassDetails: {
    fontSize: 16,
  },
  qrButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  qrButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  schedule: {
    padding: 10,
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  classTime: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default TeacherHomeScreen;
