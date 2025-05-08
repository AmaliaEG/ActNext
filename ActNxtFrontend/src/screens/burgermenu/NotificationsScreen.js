import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import SettingsList from '../Settings/SettingsList';
import useSettingsStore from '../../store/useSettingsStore';

const NotificationsScreen = () => {
    const { notificationsEnabled, toggleNotifications, hydrated } = useSettingsStore();

    if (!hydrated) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Loading notifications...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SettingsList
                settings={[
                    {
                        name: 'Enable Notifications',
                        value: notificationsEnabled,
                        function: toggleNotifications,
                        type: 'switch',
                    },
                ]}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NotificationsScreen;