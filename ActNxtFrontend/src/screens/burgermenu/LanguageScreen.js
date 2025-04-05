import React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageScreen = () => {
    const [selectedLang, setSelectedLang] = useState('English');

    useEffect(() => {
        const loadLang = async () => {
            const saved = await AsyncStorage.getItem('setting:Language');
            if (saved) setSelectedLang(saved);
        };
        loadLang();
    }, []);

    return (
        <View style={styles.container}>
            <SettingsList
                settings={[
                    {
                        name: 'Language',
                        value: selectedLang,
                        function: async (value) => {
                            setSelectedLang(value);
                            await AsyncStorage.setItem('setting:Language', value);
                        },
                        type: 'dropdown',
                        options: ['English', 'Danish', 'Lorem Ipsum'],
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

export default LanguageScreen;