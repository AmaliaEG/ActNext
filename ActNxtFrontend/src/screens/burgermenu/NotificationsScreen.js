import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import SettingsList from '../Settings/SettingsList';
import useSettingsStore from '../../store/useSettingsStore';
import { useTheme } from './ThemeContext';

const NotificationsScreen = () => {
    const { notificationsEnabled, toggleNotifications, hydrated } = useSettingsStore();
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    // Colors
    const bgColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : '#000000';
    const borderColor = isDarkMode ? '#333333' : '#CCCCCC';

    const switchTrackColor = {
        false: isDarkMode ? '#444444' : '#CCCCCC',
        true: isDarkMode ? '#81b0ff' : '#007BFF',
    };
    const switchThumbColor = isDarkMode ? '#FFFFFF' : '#FFFFFF';

    if (!hydrated) {
        return (
            <View style={[styles.centered, { backgroundColor: bgColor }]}>
                <ActivityIndicator size="large" color={textColor} />
                <Text style={{ color: textColor, marginTop: 8 }}>Loading notifications...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <SettingsList
                settings={[
                    {
                        name: 'Enable Notifications',
                        value: notificationsEnabled,
                        function: toggleNotifications,
                        type: 'switch',
                        labelStyle: { color: textColor },
                        trackColor: switchTrackColor,
                        thumbColor: switchThumbColor,
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