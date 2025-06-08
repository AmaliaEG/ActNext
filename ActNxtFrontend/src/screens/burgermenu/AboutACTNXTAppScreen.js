import React from 'react';
import { View, StyleSheet, Text, Linking, Alert, Platform, TouchableOpacity } from 'react-native';
import SettingsList from '../Settings/SettingsList';
import { useTheme } from '../../Themes/ThemeContext';


const AboutACTNXTAppScreen = () => {
    // Implement logic for working link to ActNxt website, when website is made
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    // Colors
    const bgColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : '#000000';
    const sectionBg = isDarkMode ? '#1E1E1E' : '#F9F9F9';
    const sectionBorder = isDarkMode ? '#333333' : '#CCCCCC';
    const btnBg = isDarkMode ? '#2A2A2A' : '#007BFF';
    const buttonTextCol = isDarkMode ? '#FFFFFF' : '#000000';

    const SUPPORT_URL = 'https://actnxt.com/';

    const handleContactSupport = async () => {
        try {
            const canOpen = await Linking.canOpenURL(SUPPORT_URL);

            if (canOpen) {
                await Linking.openURL(SUPPORT_URL);
            } else {
                Alert.alert(
                    'Cannot Open Link',
                    'Your device is unable to open this link at the moment.'
                );
            }
        } catch (err) {
            console.error('Error opening support URL:', err);
            Alert.alert(
                'Error',
                'An unexpected error occurred while trying to open the support link.'
            );
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Text style={[styles.title, { color: textColor }]}>
                About ActNxt
            </Text>

            <View
                style={[
                    styles.descriptionContainer,
                    {
                        backgroundColor: sectionBg,
                        borderColor: sectionBorder
                    },
                ]}
            >
                <Text style={[styles.descriptionText, { color: textColor }]}>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium
                    tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa
                    nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra
                    inceptos himenaeos.
                </Text>
            </View>

            <View style={styles.supportRow}>
                <Text style={[styles.supportLabel, { color: textColor }]}>
                    Help and Support
                </Text>
                <TouchableOpacity
                    style={[
                        styles.supportButton,
                        { backgroundColor: btnBg },
                    ]}
                    onPress={handleContactSupport}
                >
                    <Text
                        style={[
                            styles.supportButtonText,
                            { color: buttonTextCol },
                        ]}
                    >
                        CONTACT SUPPORT
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.versionText, { color: isDarkMode ? '#AAAAAA' : '#666666' }]}>
                Version 1.0.0
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    descriptionContainer: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 24,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 22,
    },
    supportRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    supportLabel: {
        fontSize: 18,
    },
    supportButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    supportButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 14,
    },
});

export default AboutACTNXTAppScreen;