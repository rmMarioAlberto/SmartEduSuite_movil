import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity  } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ClasesContext } from '../../src/context/ClasesContext';

type RootStackParamList = {
  TeacherHome: undefined;
  QRScanner: undefined;
};

type TeacherHomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'TeacherHome'
>;

type TeacherHomeScreenRouteProp = RouteProp<RootStackParamList, 'TeacherHome'>;

type Props = {
  navigation: TeacherHomeScreenNavigationProp;
  route: TeacherHomeScreenRouteProp;
};

const TeacherHomeScreen: React.FC<Props> = ({ navigation }) => {
  const {claseActual, getClaseActual } = useContext(ClasesContext);

  useEffect(() => {
    getClaseActual();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.currentClass}>
        <Text style={styles.currentClassText}>  Clase actual: </Text>
        {claseActual ? (
          <>
          <Text style={styles.currentClassName}>{claseActual.materia}</Text>
          <Text style={styles.currentClassDetails}> Grupo: {claseActual.grupo} </Text>
          <Text style={styles.currentClassDetails}> Salón: {claseActual.salon} </Text>
          </>
        ) :(
          <Text style={styles.currentClassDetails}> No hay clase activa. </Text>
        )}
        <TouchableOpacity 
          style={styles.qrButton}
          onPress={() => navigation.navigate('QRScanner')}
        >
          <Text style={styles.qrButtonText}>Generar QR</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.schedule}>
        <Text style={styles.day}>Lunes</Text>
        <Text style={styles.classTime}>7:00-8:00 - Base de datos. T244. J8</Text>
        <Text style={styles.classTime}>8:00-9:00 - Base de datos. T244. J8</Text>
        <Text style={styles.classTime}>9:00-10:00 - Base de datos. T244. J8</Text>
        <Text style={styles.classTime}>10:00-11:00 - Base de datos. T244. J8</Text>
        <Text style={styles.classTime}>11:00-12:00 - Base de datos. T244. J8</Text>
        <Text style={styles.classTime}>12:00-1:00 - Base de datos. T244. J8</Text>
        <Text style={styles.day}>Martes</Text>
        <Text style={styles.classTime}>7:00-8:00 - Base de datos. T244. J8</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 35,
    flex: 1,
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