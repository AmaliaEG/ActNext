import React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageAndDataScreen = () => {
    const [volume, setVolume] = useState(null);
    const [agreed, setAgreed] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const vol = await AsyncStorage.getItem('setting:Volume');
                const agree = await AsyncStorage.getItem('setting:Agree to Terms');
                if (vol !== null && !isNaN(parseInt(vol))) setVolume(parseInt(vol));
                else setVolume(50);
                if (agree !== null) setAgreed(JSON.parse(agree));
                else setAgreed(false);
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };
        load();
    }, []);

    if (volume === null || agreed === null) {
        return null;
    }

    return (
        <View style={styles.container}>
            <SettingsList
                settings={[
                    {
                        name: 'Volume',
                        value: volume,
                        function: async (value) => {
                            setVolume(value);
                            await AsyncStorage.setItem('setting:Volume', String(value));
                        },
                        type: 'slider',
                    },
                    {
                        name: 'Agree to Terms',
                        value: agreed,
                        function: async (value) => {
                            setAgreed(value);
                            await AsyncStorage.setItem('setting:Agree to Terms', JSON.stringify(value));
                        },
                        type: 'checkbox',
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

export default StorageAndDataScreen;