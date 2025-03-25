import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ClasesContext } from '../../../src/context/ClasesContextTeacher';

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
  const { claseActual, getClaseActual, horario, getHorario } = useContext(ClasesContext);

  useEffect(() => {
    getClaseActual();
    getHorario();
  }, []);

  useEffect(() => {
    console.log("Clase actual después de actualizar estado:", claseActual);
  }, [claseActual]);

  useEffect(() => {
    console.log("Horario después de actualizar estado:", horario);
  }, [horario]);

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
        ) : (
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
        <Text style={styles.day}>Horario de hoy.</Text>
        {horario.length > 0 ? (
          horario.map((clase) => (
            <Text key={clase.idclase} style={styles.classTime}>
              {clase.inicioclase} - {clase.finalclase} {clase.nombremateria} - {clase.salonnombre}
            </Text>
          ))
        ) : (
          <Text style={styles.classTime}>No hay clases programadas.</Text>
        )}
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