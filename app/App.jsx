import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StudentNavigator from '@/app/navigation/students/StudentNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <StudentNavigator />
    </NavigationContainer>
  );
};

export default App;

