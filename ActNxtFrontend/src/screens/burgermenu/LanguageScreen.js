import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';

const LanguageScreen = () => {
    const settings = [
        {
            name: 'Language',
            function: (value) => console.log('Selected Language:', value),
            type: 'dropdown',
            options: ['English', 'Danish', 'Lorem Ipsum'],
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

export default LanguageScreen;