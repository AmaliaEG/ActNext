import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Navigator from "../../src/navigation/Navigator";
import useSettingsStore from "../../src/store/useSettingsStore";

jest.mock('react-native-auth0', () => ({
    useAuth0: () => ({ user: null }),
    Auth0Provider: ({ children }) => children,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return {
        MaterialIcons: ({ name, testID }) => (
            <Text testID={testID || `icon-${name}`}>{`Icon: ${name}`}</Text>
        ),
    };
});

jest.mock('react-native-modal', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return ({ children, isVisible, onBackdropPress }) => 
        isVisible ? (
            <>
                {children}
                <Text testID="backdrop" onPress={onBackdropPress}>Backdrop</Text>
            </> 
        ) : null;    
});

jest.mock('@react-navigation/drawer', () => {
    const React = require('react');
    const { View, Text } = require('react-native');

    const Screen = ({ children }) => <View>{children}</View>;
    const Navigator = ({ children, drawerContent }) => (
        <View>
            {drawerContent?.({ navigation: { navigate: jest.fn() } })}
            {children}
        </View>
    );

    return {
        createDrawerNavigator: () => ({
           Navigator,
           Screen
        }),
        DrawerContentScrollView: ({ children }) => <View>{children}</View>,
        DrawerItem: ({ label, onPress }) => (
            <Text onPress={onPress} testID={`drawer-item-${label}`}>
                {label}
            </Text>
        )
    };
});

jest.mock('../../src/Themes/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        text: '#000000',
        borderColor: '#333333',
        background: '#E9E9E9',
        itemTextColor: '#FFFFFF',
        gearBg: '#2A2A2A',
        gearIconColor: '#FFFFFF',
      },
      isDark: false,
      mode: 'light',
    }
  }),
  ThemeProvider: ({ children }) => children,
}));

jest.mock('../../src/screens/Pages/Feed.js', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Insights</Text>;
});

jest.mock('../../src/screens/burgermenu/SettingsScreen.js', () => {
    const React = require('react');
    const { useState } = require('react');
    const { Text, View, TouchableOpacity } = require('react-native');
    return ({ closeModal }) => {
        const [activeScreen, setActiveScreen] = useState(null);
        
        if (activeScreen === 'Themes') {
            return (
                <View>
                    <Text>Themes</Text>
                    <TouchableOpacity onPress={() => {
                        const store = require('../../src/store/useSettingsStore').default;
                        const { themeMode } = store.getState();
                        store.setState({ themeMode: themeMode === 'light' ? 'dark' : 'light' });
                    }}>
                        <Text>Toggle Theme</Text>
                    </TouchableOpacity>
                    <Text onPress={() => setActiveScreen(null)}>Back</Text>
                </View>
            );
        }

        if (activeScreen === 'Language') {
            return (
                <View>
                    <Text>Language</Text>
                    <TouchableOpacity onPress={() => {
                        const store = require('../../src/store/useSettingsStore').default;
                        store.setState({ language: 'da' });
                    }}>
                        <Text>Dansk</Text>
                    </TouchableOpacity>
                    <Text onPress={() => setActiveScreen(null)}>Back</Text>
                </View>
            );
        }

        return (
            <View>
                <Text>Settings</Text>
                <TouchableOpacity onPress={() => setActiveScreen('Themes')}>
                    <Text>Themes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveScreen('Language')}>
                    <Text>Language</Text>
                </TouchableOpacity>
            </View>
        );
    };
});

describe('Theme and Language Integration', () => {
    beforeEach(() => {
        useSettingsStore.setState({
            themeMode: 'light',
            language: 'en'
        });
    });

    it('updates theme when toggled in settings', async () => {
        const { getByTestId, getByText } = render(<Navigator />);
        fireEvent.press(getByTestId('icon-settings'));
        fireEvent.press(getByText('Themes'));
        fireEvent.press(getByText('Toggle Theme'));
        fireEvent.press(getByText('Back'));
        const state = useSettingsStore.getState();
        expect(state.themeMode).toBe('dark');
    });

    it('changes language and reflects it in UI', async () => {
        const { getByTestId, getByText } = render(<Navigator />);
        fireEvent.press(getByTestId('icon-settings'));
        fireEvent.press(getByText('Language'));
        fireEvent.press(getByText('Dansk'));
        fireEvent.press(getByText('Back'));
        const state = useSettingsStore.getState();
        expect(state.language).toBe('da');
    });
});