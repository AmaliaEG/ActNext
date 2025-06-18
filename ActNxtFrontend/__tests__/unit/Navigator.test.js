// Written by s224837

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Navigator from '../../src/navigation/Navigator';

jest.mock('@react-navigation/drawer', () => {
    const React = require('react');
    const { View, Text } = require('react-native');

    return {
        createDrawerNavigator: () => {
            const Navigator = ({ children, drawerContent }) => (
                <View>
                    {drawerContent({ navigation: { navigate: jest.fn() } })}
                    {children}
                </View>
            );
            const Screen = ({ children }) => <View>{children}</View>;

            return { Navigator, Screen };
        },
        DrawerContentScrollView: ({ children }) => <View>{children}</View>,
        DrawerItem: ({ label, onPress }) => <Text onPress={onPress}>{label}</Text>,
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


// Tests for burgermenu list
const testScreens = [
    { label: 'Insights', expectedText: 'Insights' },
    { label: 'Favorites', expectedText: 'Favorites' },
    { label: 'Archive', expectedText: 'Archive' },
];

describe('Navigator', () => {
    it('renders without crashing', () => {
        const { toJSON } = render(<Navigator />);
        expect(toJSON()).toBeTruthy();
    });
});

describe('CustomDrawerContent', () => {
    testScreens.forEach(({ label, expectedText }) => {
        it(`shows ${label} drawer item and navigates correctly`, () => {
            const { getByText } = render(<Navigator />);
            const item = getByText(label);
            expect(item).toBeTruthy();

            fireEvent.press(item);
            expect(getByText(expectedText)).toBeTruthy();
        });
    });

    it('displays the settings gear button', () => {
        const { getByTestId } = render(<Navigator />);
        expect(getByTestId('settings-button')).toBeTruthy();
    });
});