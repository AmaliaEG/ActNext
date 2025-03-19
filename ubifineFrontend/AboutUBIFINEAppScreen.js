import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const AboutUBIFINEAppScreen = () => {
    return (
        <View style={styles.container}>
            <Text>About UBIFINE App</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

export default AboutUBIFINEAppScreen;