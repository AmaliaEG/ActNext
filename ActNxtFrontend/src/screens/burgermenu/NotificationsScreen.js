import React from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';
import useSettingsStore from '../../store/useSettingsStore';

const NotificationsScreen = () => {
    const { notificationsEnabled, toggleNotifications } = useSettingsStore();

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
});

export default NotificationsScreen;