import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';

const StorageAndDataScreen = () => {
    const settings = [
        {
            name: 'Volume',
            function: (value) => console.log('Volume:', value),
            type: 'slider',
        },
        {
            name: 'Agree to Terms',
            function: (value) => console.log('Checkbox:', value),
            type: 'checkbox',
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

export default StorageAndDataScreen;