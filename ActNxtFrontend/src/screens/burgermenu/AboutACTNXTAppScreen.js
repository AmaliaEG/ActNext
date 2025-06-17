import React from 'react';
import { View, StyleSheet, Text, Linking, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../Themes/ThemeContext';

/**
 * This screen displays information about the ActNxt application, including a scrollable description of the company's mission, approach,
 * and focus. It also includes a button that navigates to the official ActNxt website for support and additional information.
 * 
 * If unable to open the website an error alert is shown to the user.
 * 
 * @component
 * @returns {JSX.Element} A screen with app description, support link and version info.
 * 
 * @example
 * <AboutACTNXTAppScreen />
 */

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
                <ScrollView>
                    <Text style={[styles.italicText, { color: theme.colors.text }]}>
                        Sales Instinct. Superpowered
                    </Text>
                    <Text style={[styles.descriptionText, { color: theme.colors.text  }]}>
                        {'\n'}ActNxt is an innovative company that develops AI-powered solutions to solve the data overwhelm problem that sales 
                        teams face every day. We believe businesses shouldn't struggle with decision paralysis when they have valuable 
                        data at their fingertips.{'\n\n'}
                        
                        <Text style={styles.boldText}>Our Mission{'\n'}</Text>
                        We transform complex invoice and sales data into clear, actionable insights that drive real business results. Our 
                        goal is to help sales teams focus on what matters most - building relationships and growing revenue.{'\n\n'}

                        <Text style={styles.boldText}>Our Approach{'\n'}</Text>
                        Rather than adding another complex dashboard to your workflow, we deliver simple, targeted recommendations 
                        directly to your team when action is needed. We've designed our platform to work seamlessly with existing 
                        systems like SuperOffice, Microsoft Dynamics, and Visma.{'\n\n'}

                        <Text style={styles.boldText}>Our Focus{'\n'}</Text>
                        We specialize in serving small to medium-sized enterprises who want to leverage their existing data effectively 
                        without the complexity of traditional analytics platforms.{'\n\n'}

                        At ActNxt, we turn data into revenue-generating actions.
                    </Text>
                </ScrollView>
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
            <Text style={[styles.versionText, { color: theme.colors.text }]}> 
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
    italicText: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    boldText: {
        fontWeight: 'bold'
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