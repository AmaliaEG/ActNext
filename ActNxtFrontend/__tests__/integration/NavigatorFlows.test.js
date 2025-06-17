import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Navigator from "../../src/navigation/Navigator";

jest.mock('../../src/screens/Pages/LoginPage.js', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>LoginPage</Text>;
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

jest.mock('react-native-auth0', () => ({
    useAuth0: () => ({ user: null }),
    Auth0Provider: ({ children }) => children,
}));

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

jest.mock('react-native-gesture-handler', () => {
    const { View } = require('react-native');
    return {
        GestureHandlerRootView: View,
        PanGestureHandler: View,
        TapGestureHandler: View,
        State: {},
        Directions: {},
    };
});

// Mock for settings screens
jest.mock('../../src/screens/Pages/Feed.js', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Insights</Text>;
});

jest.mock('../../src/screens/Pages/StarredTasks.js', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Favorites</Text>;
});

jest.mock('../../src/screens/Pages/ArchivedTasks.js', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Archive</Text>;
});

jest.mock('../../src/screens/Pages/TaskExpansion.js', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>TaskExpansion</Text>;
});

jest.mock('../../src/screens/burgermenu/SettingsScreen.js', () => {
    const React = require('react');
    const { useState } = require('react');
    const { Text, View, TouchableOpacity } = require('react-native');
    return ({ closeModal }) => {
        const [activeScreen, setActiveScreen] = useState(null);
        
        if (activeScreen) {
            return (
                <View>
                    <Text>{activeScreen}</Text>
                    <Text onPress={() => setActiveScreen(null)}>Back</Text>
                </View>
            );
        }

        return (
            <View>
                <Text>Settings</Text>
                <TouchableOpacity onPress={() => setActiveScreen('Profile')}>
                    <Text>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveScreen('Themes')}>
                    <Text>Themes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveScreen('Language')}>
                    <Text>Language</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveScreen('About')}>
                    <Text>About</Text>
                </TouchableOpacity>
            </View>
        );
    };
});

jest.mock('../../src/screens/burgermenu/settingComponents/ProfileDetailsScreen.js', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Profile</Text>;
});

jest.mock('../../src/screens/burgermenu/settingComponents/ThemesScreen.js', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Theme</Text>;
});

jest.mock('../../src/screens/burgermenu/settingComponents/LanguageScreen.js', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Language</Text>;
});

jest.mock('../../src/screens/burgermenu/settingComponents/AboutACTNXTAppScreen.js', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>About</Text>;
});

describe('Navigator Integration Flow', () => {
    it('navigates to Favorites via drawer', () => {
        const { getByText } = render(<Navigator />);
        fireEvent.press(getByText('Favorites'));
        expect(getByText('Favorites')).toBeTruthy();
    });

    it('navigates to Archive via drawer', () => {
        const { getByText } = render(<Navigator />);
        fireEvent.press(getByText('Archive'));
        expect(getByText('Archive')).toBeTruthy();
    });

    it('opens settings modal and views Profile option', async () => {
        const { getByText, getByTestId } = render(<Navigator />);
        fireEvent.press(getByTestId('icon-settings'));
        await waitFor(() => {
            expect(getByText('Settings')).toBeTruthy();
            expect(getByText('Profile')).toBeTruthy();
        });
    });

    it('closes modal when back is pressed', () => {
        const { getByTestId, getByText, queryByText } = render(<Navigator />);
        fireEvent.press(getByTestId('icon-settings'));
        expect(getByText('Settings')).toBeTruthy();
        fireEvent.press(getByTestId('backdrop'));
        expect(queryByText('Settings')).toBeNull();
    });

    it('returns to settings list when back is pressed from an option', async () => {
        const { getByTestId, getByText } = render(<Navigator />);
        fireEvent.press(getByTestId('icon-settings'));
        fireEvent.press(getByText('Themes'));
        fireEvent.press(getByText('Back'));
        await waitFor(() => {
            expect(getByText('Settings')).toBeTruthy();
        });
    });
});

