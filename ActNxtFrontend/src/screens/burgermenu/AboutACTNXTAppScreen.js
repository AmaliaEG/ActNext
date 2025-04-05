import React from 'react';
import { View, StyleSheet } from 'react-native';
import SettingsList from '../Settings/SettingsList';

const AboutACTNXTAppScreen = () => {
    return (
        <View style={styles.container}>
            <SettingsList
                settings={[
                    {
                        name: 'Help and Support',
                        function: () => {
                            console.log('Redirecting to support...');
                            // Should be directed to a website or another screen
                        },
                        type: 'button',
                        options: 'Contact Support',
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

export default AboutACTNXTAppScreen;