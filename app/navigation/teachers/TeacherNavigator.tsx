import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import TeacherHomeScreen from '@/app/screens/teachers/TeacherHomeScreen';
import TeacherProfileScreen from '@/app/screens/teachers/ProfileTeachers';

const Tab = createBottomTabNavigator();

const TeacherNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="TeacherHome">
      <Tab.Screen name="TeacherHome" component={TeacherHomeScreen} />
      <Tab.Screen name="TeacherProfile" component={TeacherProfileScreen} />
    </Tab.Navigator>
  );
};

export default TeacherNavigator;