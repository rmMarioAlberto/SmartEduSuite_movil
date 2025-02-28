import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons'; // Importa los íconos que quieras usar
import StudentHomeScreen from '@/app/screens/students/StudentHomeScreen';
import StudentProfileScreen from '@/app/screens/students/ProfileStudents';

const Tab = createBottomTabNavigator();

const StudentNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="StudentHome"
      screenOptions={({ route }) => ({  
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'StudentHome') {
            iconName = focused ? 'home' : 'home-filled';
          } else if (route.name === 'StudentProfile') {
            iconName = focused ? 'person' : 'person-filled';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue', 
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="StudentHome" component={StudentHomeScreen} />
      <Tab.Screen name="StudentProfile" component={StudentProfileScreen} />
    </Tab.Navigator>
  );
};

export default StudentNavigator;