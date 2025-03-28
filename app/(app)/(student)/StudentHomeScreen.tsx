import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  StudentHome: undefined;
  QRScanner: undefined;
};

type StudentHomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'StudentHome'
>;

type StudentHomeScreenRouteProp = RouteProp<RootStackParamList, 'StudentHome'>;

type Props = {
  navigation: StudentHomeScreenNavigationProp;
  route: StudentHomeScreenRouteProp;
};

const StudentHomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.currentClass}>
        <Text style={styles.currentClassText}>Clase actual:</Text>
        <Text style={styles.currentClassName}>Inglés V.</Text>
        <Text style={styles.currentClassDetails}>Maestro: José Eduardo Rodríguez.</Text>
        <Text style={styles.currentClassDetails}>Salón: I-10.</Text>
        <TouchableOpacity 
          style={styles.qrButton}
          onPress={() => navigation.navigate('QRScanner')}
        >
          <Text style={styles.qrButtonText}>Leer QR</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.schedule}>
        <Text style={styles.day}>Lunes</Text>
        <Text style={styles.classTime}>7:00-8:00 - Base de datos. Ana Estrada. J8</Text>
        <Text style={styles.classTime}>8:00-9:00 - Base de datos. Ana Estrada. J8</Text>
        <Text style={styles.classTime}>9:00-10:00 - Base de datos. Ana Estrada. J8</Text>
        <Text style={styles.classTime}>10:00-11:00 - Base de datos. Ana Estrada. J8</Text>
        <Text style={styles.classTime}>11:00-12:00 - Base de datos. Ana Estrada. J8</Text>
        <Text style={styles.classTime}>12:00-1:00 - Base de datos. Ana Estrada. J8</Text>
        <Text style={styles.day}>Martes</Text>
        <Text style={styles.classTime}>7:00-8:00 - Base de datos. Ana Estrada. J8</Text>
        {/* Agrega más clases según sea necesario */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 30,
    top: 45,
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
    right: 15,
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

export default StudentHomeScreen;