import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons'; // Importa los íconos que quieras usar
import TeacherHomeScreen from '@/app/screens/teachers/TeacherHomeScreen';
import TeacherProfileScreen from '@/app/screens/teachers/ProfileTeachers';

const Tab = createBottomTabNavigator();

const TeacherNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="TeacherHome"
      screenOptions={({ route }) => ({  
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Horario') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue', 
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Horario" component={TeacherHomeScreen} />
      <Tab.Screen name="Perfil" component={TeacherProfileScreen} />
    </Tab.Navigator>
  );
};

export default TeacherNavigator;
