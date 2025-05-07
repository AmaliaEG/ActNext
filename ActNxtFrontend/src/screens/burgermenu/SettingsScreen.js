import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Switch,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React from 'react';
import useSettingsStore from "../../store/useSettingsStore";

const SettingsScreen = ({ navigation }) => {
    const {
        theme,
        language,
        notificationsEnabled,
        toggleNotifications,
        _hasHydrated: isHydrated
    } = useSettingsStore();

    if (!isHydrated) {
        return (
          <View style={styles.centered}>
            <Text>Loading settings...</Text>
          </View>
        );
    }

    const isDarkMode = theme.mode === 'dark';
    
    const menuItems = [
        { title: 'Profile', screen: 'ProfileDetails' },
        {
            title: 'Themes', 
            screen: 'Themes',
            rightText: theme.mode === 'system' ? 'System' : theme.mode === 'dark' ? 'Dark' : 'Light'
        },
        {
            title: 'Language',
            screen: 'Language',
            rightText: language.toUpperCase()
        },
        {
            title: 'Notifications',
            screen: 'Notifications',
            rightComponent: (
                <Switch
                    value={notificationsEnabled}
                    onValueChange={toggleNotifications}
                />
            )
        },
        { title: 'Storage and Data', screen: 'StorageAndData' },
        { title: 'About ACTNXT App', screen: 'AboutACTNXTApp' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
            {menuItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.menuItem, {
                        borderBottomColor: isDarkMode ? '#333' : '#ccc'
                    }]}
                    onPress={() => navigation.navigate(item.screen)}
                >
                    <Text style={[styles.menuText, {
                        color: isDarkMode ? '#fff' : '#000'
                    }]}>{item.title}</Text>

                    <View style={styles.rightContent}>
                        {item.rightText && (
                            <Text style={[styles.rightText, {
                                color: isDarkMode ? '#aaa' : '#666'
                            }]}>
                                {item.rightText}
                            </Text>
                        )}
                        {item.rightComponent && item.rightComponent}
                        {!item.rightText && !item.rightComponent && (
                            <AntDesign
                                name="right"
                                size={20}
                                color={isDarkMode ? '#aaa' : '#000'}
                            />
                        )}
                    </View>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    rightText: {
        fontSize: 14,
    },
});

export default SettingsScreen;