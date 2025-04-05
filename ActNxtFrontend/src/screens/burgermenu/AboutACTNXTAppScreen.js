import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';

const AboutACTNXTAppScreen = () => {
    const settings = [
        {
            name: 'Help and Support',
            function: () => console.log('Button Pressed'),
            type: 'button',
            options: 'Contact Support',
        },
    ];

    return (
        <View style={styles.container}>
            <SettingsList settings={settings} />
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