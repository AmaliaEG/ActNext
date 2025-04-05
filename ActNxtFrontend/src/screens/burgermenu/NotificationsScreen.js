import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';

const NotificationsScreen = () => {
    const settings = [
        {
            name: 'Enable Notifications',
            function: (value) => console.log('Notifications:', value),
            type: 'switch',
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

export default NotificationsScreen;