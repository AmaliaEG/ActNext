import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import { ThemeProvider, useTheme } from '../src/screens/burgermenu/ThemeContext';
import { Button, Text, View } from 'react-native';

// The test component allows us to trigger a theme change
const TestComponent = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <View>
            <Text testID='theme-text'>{theme}</Text>
            <Button title='Switch to Dark' onPress={() => toggleTheme('dark')} />
        </View>
    );
};

describe('ThemeContext', () => {
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
});