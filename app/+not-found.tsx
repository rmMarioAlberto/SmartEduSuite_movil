import { Stack } from 'expo-router';
import { StyleSheet, Image, View } from 'react-native';
import * as React from 'react';
import { Button, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../src/context/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // Redirige al usuario a la pantalla correspondiente si ya está autenticado
      if (user.tipo === 2) {
        router.replace('/(app)/(teacher)/TeacherHomeScreen');
      } else if (user.tipo === 1) {
        router.replace('/(app)/(student)/StudentHomeScreen');
      }
    }
  }, [user]);

  const handleNavigateToLogin = () => {
    router.push('/(auth)/login'); // Navega a la pantalla de inicio de sesión
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Bienvenido' }} />
      <View style={styles.container}>
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          SmartEdu Suite
        </Animatable.Text>
        <Animatable.Text animation="fadeInDown" delay={200} style={styles.subtitle}>
          La plataforma educativa del futuro
        </Animatable.Text>
        <Animatable.Image
          animation="bounceIn"
          delay={400}
          source={require('../assets/images/logo.jpg')}
          style={styles.image}
        />
        <Animatable.Text animation="fadeInUp" delay={600} style={styles.description}>
          Con SmartEdu Suite, accede a herramientas innovadoras para mejorar tu experiencia educativa. Conéctate, aprende y crece con nosotros.
        </Animatable.Text>
        <Animatable.View animation="fadeInUp" delay={800}>
          <Button
            mode="contained"
            onPress={handleNavigateToLogin}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Comenzar
          </Button>
        </Animatable.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007BFF',
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
  },
});