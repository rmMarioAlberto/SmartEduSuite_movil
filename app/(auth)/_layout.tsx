import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../../src/context/AuthContext';

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
