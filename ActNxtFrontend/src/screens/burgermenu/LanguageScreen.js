import React from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';
import useSettingsStore from '../../store/useSettingsStore';

const LanguageScreen = () => {
    const { language, setLanguage, hydrated } = useSettingsStore();

    if (!hydrated) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Loading language settings...</Text>
            </View>
        );
    }
    

    return (
        <View style={styles.container}>
            <SettingsList
                settings={[
                    {
                        name: 'Language',
                        value: language,
                        function: setLanguage,
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LanguageScreen;