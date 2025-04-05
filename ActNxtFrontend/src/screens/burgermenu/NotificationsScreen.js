import React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationsScreen = () => {
const [enabled, setEnabled] = useState(false);

useEffect(() => {
    const load = async () => {
        const saved = await AsyncStorage.getItem('setting:Enable Notifications');
        if (saved) setEnabled(JSON.parse(saved));
    };
    load();
}, []);

return (
    <View style={styles.container}>
        <SettingsList
            settings={[
                {
                    name: 'Enable Notifications',
                    value: enabled,
                    function: async (value) => {
                        setEnabled(value);
                        await AsyncStorage.setItem('setting:Enable Notifications', JSON.stringify(value));
                    },
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