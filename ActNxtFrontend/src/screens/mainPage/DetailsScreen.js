import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailsScreen = ({ route }) => {
    const { item } = route.params; // Assuming you pass a task or item as a parameter

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello World!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    text: {
        fontSize: 24,
        color: "Black",
        fontWeight: "bold",
    },
});

export default DetailsScreen;