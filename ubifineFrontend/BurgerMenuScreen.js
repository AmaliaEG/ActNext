import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React from 'react';

const BurgerMenuScreen = ({ navigation }) => {
    // Array containing profile menu options
    const menuItems = [
        { title: 'Profile', screen: 'ProfileDetails' },
        { title: 'Language', screen: 'Language' },
        { title: 'Notifications', screen: 'Notifications' },
        { title: 'Storage and Data', screen: 'StorageAndData' },
        { title: 'About UBIFINE App', screen: 'AboutUBIFINEApp' },
    ];

    // A button is created for each item in menuItems containing a label, arrow and
    // a onPress handler that navigates to the screen of the corresponding item.
    return (
        <View style={styles.container}>
            {menuItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => navigation.navigate(item.screen)}
                >
                    <Text style={styles.menuText}>{item.title}</Text>
                    <AntDesign name="right" size={20} color="#000" />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    menuText: {
        fontSize: 16,
    },
});

export default BurgerMenuScreen;