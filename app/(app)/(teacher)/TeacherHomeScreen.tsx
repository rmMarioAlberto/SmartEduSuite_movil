import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TeacherHomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenido, Maestro</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    text: {
        fontSize: 24,
    },
});

export default TeacherHomeScreen;