import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import Navigator from '../src/navigation/Navigator';
import {  GestureHandlerRootView } from 'react-native-gesture-handler';

jest.mock('react-native-modal', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return ({ children, isVisible, onBackdropPress }) => {
        return isVisible ? (
            <>
                {children}
                <Text testID="backdrop" onPress={onBackdropPress}>Backdrop</Text>
            </> 
        ) : null;
    };
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
    const View = require('react-native/Libraries/Components/View/View');
    return {
        ...jest.requireActual('react-native-gesture-handler'),
        GestureHandlerRootView: View,
        PanGestureHandler: View,
        TapGestureHandler: View,
        State: {},
        Directions: {},
        default: {
            ...jest.requireActual('react-native-gesture-handler'),
            install: () => {},
        },
    };
});

// Mock for settings screens
jest.mock('../src/screens/burgermenu/ProfileDetailsScreen', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Name</Text>;
});

jest.mock('../src/screens/burgermenu/ThemesScreen', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Themes</Text>;
});

jest.mock('../src/screens/burgermenu/LanguageScreen', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Language</Text>;
});

jest.mock('../src/screens/burgermenu/NotificationsScreen', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Notifications</Text>;
});

jest.mock('../src/screens/burgermenu/StorageAndDataScreen', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>Storage & Data</Text>;
});

jest.mock('../src/screens/burgermenu/AboutACTNXTAppScreen', () => {
    const React = require('react');
    const { Text } = require('react-native');
    return () => <Text>About ACTNXT App</Text>;
});

// Test Data
const testScreens = [
    { label: 'Profile', expectedText: 'Name' },
    { label: 'Themes', expectedText: 'Themes' },
    { label: 'Language', expectedText: 'Language' },
    { label: 'Notifications', expectedText: 'Notifications' },
    { label: 'Storage & Data', expectedText: 'Storage & Data' },
    { label: 'About', expectedText: 'About ACTNXT App' },
];

describe('Navigator', () => {
    it('renders without crashing', () => {
        const tree = render(
            <GestureHandlerRootView>
                <Navigator />
            </GestureHandlerRootView>
        );
        expect(tree).toBeTruthy();
    });
});

describe('CustomDrawerContent', () => {
    it('opens modal when gear icon is pressed', () => {
        const { getByTestId, queryByText, getByText } = render(
            <GestureHandlerRootView>
                <Navigator />
            </GestureHandlerRootView>
        );

        // Before presseing: Modal content shouldn't be visible
        expect(queryByText('Settings')).toBeNull();
        fireEvent.press(getByTestId('settings-button'));

        // After pressing
        expect(getByText('Settings')).toBeTruthy();

        // Check all setting options appear
        testScreens.forEach(({ label }) => {
            expect(getByText(label)).toBeTruthy();
        });
    });

    testScreens.forEach(({ label, expectedText }) => {
        it(`opens ${label} screen and shows expected content`, () => {
            const { getByTestId, getByText } = render(
                <GestureHandlerRootView>
                    <Navigator />
                </GestureHandlerRootView>
            );
            
            fireEvent.press(getByTestId('settings-button'));
            fireEvent.press(getByText(label));
            expect(getByText(expectedText)).toBeTruthy();
        });
    });

    it('closes modal when back button is pressed', () => {
        const { getByTestId, queryByText } = render(
            <GestureHandlerRootView>
                <Navigator />
            </GestureHandlerRootView>
        );

        fireEvent.press(getByTestId('settings-button'));
        expect(queryByText('Settings')).toBeTruthy();

        fireEvent.press(getByTestId('backdrop'));

        expect(queryByText('Settings')).toBeNull();
    });

    it('returns to settings list when back button is pressed in modal', () => {
        const { getByTestId, getByText } = render(
            <GestureHandlerRootView>
                <Navigator />
            </GestureHandlerRootView>
        );

        fireEvent.press(getByTestId('settings-button'));

        fireEvent.press(getByText('Themes'));
        expect(getByText('Themes')).toBeTruthy();

        fireEvent.press(getByText('Back'));

        testScreens.forEach(({ label }) => {
            expect(getByText(label)).toBeTruthy();
        });
    });
});