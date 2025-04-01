import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { claseActualTeacher, horarioTeacher } from '../../../src/services/clases/clasesServicesTeacher';
import ProtectedRoute from '../../../src/context/ProtectedRoute';
import { AuthContext } from '../../../src/context/AuthContext';
import { useRouter } from "expo-router";

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
  const [refreshing, setRefreshing] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const router = useRouter();
  const { localLogout } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const idUsuario = await SecureStore.getItemAsync('idUsuario');
      if (!idUsuario) {
        throw new Error('No se encontró el id de usuario.');
      }
      const userId = parseInt(idUsuario, 10);

      const claseActualData = await claseActualTeacher(userId, localLogout);
      setClaseActual(claseActualData.data);

      const horarioData = await horarioTeacher(userId, localLogout);
      setHorario(horarioData.data.clases);
    } catch (error) {
      console.error('Error al obtener la clase actual o el horario:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatFechaStart = (fechaStart: string) => {
    const date = new Date(fechaStart);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ProtectedRoute allowedUserType={2}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.currentClass}>
          <View style={styles.classInfo}>
            <Text style={styles.currentClassText}>Clase actual: </Text>
            {claseActual ? (
              <>
                <Text style={styles.currentClassName}>{claseActual.nombremateria}</Text>
                <Text style={styles.currentClassDetails}>Inicio de clase: {claseActual.inicioclase} - {claseActual.finalclase}</Text>
                <Text style={styles.currentClassDetails}>Hora de inicio: {formatFechaStart(claseActual.fechaStart)}</Text>
                <Text style={styles.currentClassDetails}>Grupo: {claseActual.gruponombre}</Text>
                <Text style={styles.currentClassDetails}>Salón: {claseActual.salonnombre}</Text>
              </>
            ) : (
              <Text>No hay clase actual.</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.qrButton} 
            onPress={() => setQrVisible(true)}
          >
            <Text style={styles.qrButtonText}>Visualizar QR</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.schedule}>
          {horario.length > 0 ? (
            horario.map((clase, index) => (
              <View key={index} style={styles.classContainer}>
                <Text style={styles.day}>{`Clase: ${clase.nombremateria}`}</Text>
                <Text style={styles.classTime}>{`${clase.inicioclase} - ${clase.finalclase} - Grupo: ${clase.gruponombre}. Salón: ${clase.salonnombre}`}</Text>
              </View>
            ))
          ) : (
            <Text>No hay horario disponible.</Text>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={fetchData}
            disabled={refreshing}
          >
            <Text style={styles.refreshButtonText}>
              {refreshing ? 'Actualizando...' : 'Refrescar'}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={qrVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setQrVisible(false)}>
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: claseActual?.qrCode }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </ScrollView>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  currentClass: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e0f7fa',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  classInfo: {
    flex: 1,
  },
  currentClassText: {
    fontSize: 18,
    fontWeight: '600',
  },
  currentClassName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  currentClassDetails: {
    fontSize: 16,
    color: '#555',
  },
  schedule: {
    padding: 10,
  },
  classContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  classTime: {
    fontSize: 16,
    color: '#777',
  },
  qrButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  qrButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 30,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
});

export default TeacherHomeScreen;