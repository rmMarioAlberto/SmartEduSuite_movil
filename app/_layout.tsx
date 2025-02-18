import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from '@/app/screens/login/LoginScreen';
import TeacherNavigator from '@/app/navigation/teachers/TeacherNavigator';
import StudentNavigator from '@/app/navigation/students/StudentNavigator';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'teacher' | 'student' | null>(null); // 'teacher' or 'student'

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const handleLogin = (type: 'teacher' | 'student') => {
    setIsAuthenticated(true);
    setUserType(type);
  };

  const Stack = createNativeStackNavigator();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen name="Login">
            {() => <LoginScreen onLogin={handleLogin} />}
          </Stack.Screen>
        ) : userType === 'teacher' ? (
          <Stack.Screen name="TeacherNavigator" component={TeacherNavigator} />
        ) : (
          <Stack.Screen name="StudentNavigator" component={StudentNavigator} />
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}