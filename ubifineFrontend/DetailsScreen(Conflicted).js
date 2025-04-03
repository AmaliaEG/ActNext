import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailsScreen = ({ route }) => {
    const { item } = route.params;

    return (
        <View style={[styles.container, { backgroundColor: item.colour }]}>
            <Text style={styles.text}>You clicked on: {item.description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        color: "white",
        fontWeight: "bold",
    },
});

export default DetailsScreen;
