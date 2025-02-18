import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import StudentHomeScreen from '@/app/screens/students/StudentHomeScreen';
import StudentProfileScreen from '@/app/screens/students/ProfileStudents';

const Tab = createBottomTabNavigator();

const StudentNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="StudentHome">
      <Tab.Screen name="StudentHome" component={StudentHomeScreen} />
      <Tab.Screen name="StudentProfile" component={StudentProfileScreen} />
    </Tab.Navigator>
  );
};

export default StudentNavigator;