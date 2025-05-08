import React from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';
import useSettingsStore from '../../store/useSettingsStore';

const LanguageScreen = () => {
    const { language, setLanguage } = useSettingsStore();

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
});

export default LanguageScreen;