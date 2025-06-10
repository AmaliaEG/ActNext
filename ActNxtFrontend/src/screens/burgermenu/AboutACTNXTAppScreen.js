import React from 'react';
import { View, StyleSheet, Text, Linking, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '../../Themes/ThemeContext';


const AboutACTNXTAppScreen = () => {
    // Implement logic for working link to ActNxt website, when website is made
    const { theme } = useTheme();


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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
                About ActNxt
            </Text>

            <View
                style={[
                    styles.descriptionContainer,
                    {
                        backgroundColor: theme.colors.boxBg,
                        borderColor: theme.colors.boxBorder,
                    },
                ]}
            >
                <Text style={[styles.descriptionText, { color: theme.colors.text  }]}>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium
                    tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa
                    nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra
                    inceptos himenaeos.
                </Text>
            </View>

            <View style={styles.supportRow}>
                <Text style={[styles.supportLabel, { color: theme.colors.text  }]}>
                    Help and Support
                </Text>
                <TouchableOpacity
                    style={[
                        styles.supportButton,
                        { backgroundColor: theme.colors.primary },
                    ]}
                    onPress={handleContactSupport}
                >
                    <Text
                        style={[
                            styles.supportButtonText,
                            { color: theme.colors.buttonText },
                        ]}
                    >
                        CONTACT SUPPORT
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.versionText, { color: theme.colors.buttonText }]}> 
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