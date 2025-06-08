import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import SettingsList from '../Settings/SettingsList';
import useSettingsStore from '../../store/useSettingsStore';
import { useTheme } from '../../Themes/ThemeContext';
import LanguagePickerInput from './LanguagePickerInput';

const LanguageScreen = () => {
    const { language, setLanguage, hydrated } = useSettingsStore();
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    // Colors
    const bgColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : '#000000';

    if (!hydrated) {
        return (
            <View style={[styles.centered, { backgroundColor: bgColor }]}>
                <ActivityIndicator size="large" color={textColor} />
                <Text style={{ color: textColor, marginTop: 8 }}>Loading language settings...</Text>
            </View>
        );
    }
    

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <LanguagePickerInput
                value={language}
                onChange={(newLang) => setLanguage(newLang)}
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