import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const StorageAndDataScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Storage and Data Settings</Text>
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