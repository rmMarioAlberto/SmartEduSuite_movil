import { Link, Stack } from 'expo-router';
import { StyleSheet, Image } from 'react-native';
import * as React from 'react';

import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Bienvenido a SmartEdu Suite.</ThemedText>
        <Image
          source={require('../assets/images/SES-renderizado-dark.png')} // Cambia la URI a require
          style={styles.image}
        />
        <Link href="/(auth)/login" style={styles.link}>
          <ThemedText type="link">Ir a inicio de sesión.</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});