import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const AboutACTNXTAppScreen = () => {
    return (
        <View style={styles.container}>
            <Text>About ACTNXT App</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

export default AboutACTNXTAppScreen;