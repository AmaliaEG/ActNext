import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const LanguageScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Language Settings</Text>
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