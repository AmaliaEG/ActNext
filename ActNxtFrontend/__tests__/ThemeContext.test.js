import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import { ThemeProvider, useTheme } from '../src/screens/burgermenu/ThemeContext';
import { Button, Text, View } from 'react-native';


// MOCKS
const mockUpdateTheme = jest.fn()

jest.mock('../src/store/useSettingsStore', () => {
    const React = require('react');
    return {
        __esModule: true,
        default: () => {
            const [theme, setTheme] = React.useState({ mode: 'light' });
            return {
                theme,
                toggleTheme: () => setTheme({ mode: theme.mode === 'light' ? 'dark' : 'light' }),
                updateTheme: mockUpdateTheme,
                language: 'en',
                setLanguage: jest.fn(),
                notificationsEnabled: true,
                toggleNotifications: jest.fn(),
                hydrated: true
            };
        }
    };
});

// The helper component allows us to trigger a theme change
const TestComponent = () => {
    const { theme, toggleTheme, updateTheme } = useTheme();

    return (
        <View>
            <Text testID='theme-text'>{theme.mode}</Text>
            <Button title='Switch to Dark' onPress={() => toggleTheme('dark')} />
            <Button title='Switch to Light' onPress={() => toggleTheme('light')} />
            <Button title='Toggle Theme' onPress={() => toggleTheme()} />
        </View>
    );
};


// TESTS FOR ThemeContext
describe('ThemeContext', () => {
    beforeEach(() => {
        mockUpdateTheme.mockClear();
    });

    it('toggles theme correctly', () => {
        const { getByText, getByTestId } = render(
            // TestComponent wrapped in ThemeProvider is needed for the component
            // to have access to the context.
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        // Initial value should be 'light'
        expect(getByTestId('theme-text').props.children).toBe('light');
        fireEvent.press(getByText('Switch to Dark'));

        // Expect value to be dark
        expect(getByTestId('theme-text').props.children).toBe('dark');
    });

    it('calls updateTheme() from store when theme is different', () => {
        const { getByText } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        fireEvent.press(getByText('Switch to Dark'));
        expect(mockUpdateTheme).toHaveBeenCalledWith({ mode: 'dark' });
    });

    it('does not call updateTheme() from store if theme is the same', () => {
        const { getByText } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        fireEvent.press(getByText('Switch to Light'));
        expect(mockUpdateTheme).not.toHaveBeenCalled();
    });
});