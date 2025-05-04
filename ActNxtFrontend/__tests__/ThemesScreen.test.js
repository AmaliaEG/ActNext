import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import Themes from '../src/screens/burgermenu/ThemesScreen';
import { ThemeContext } from '../src/screens/burgermenu/ThemeContext';
import { StyleSheet } from 'react-native';


describe('Themes', () => {
    it('calls updateTheme correctly when buttons are pressed', () => {
        const mockUpdateTheme = jest.fn();

        const { getByText } = render(
            <ThemeContext.Provider value={{ theme: { mode: 'light' }, updateTheme: mockUpdateTheme }}>
                <Themes />
            </ThemeContext.Provider>
        );
        
        fireEvent.press(getByText('Dark'));
        expect(mockUpdateTheme).toHaveBeenCalledWith({ mode: 'dark' });
    
        fireEvent.press(getByText('Light'));
        expect(mockUpdateTheme).toHaveBeenCalledWith({ mode: 'light' });
    
        fireEvent.press(getByText('System'));
        expect(mockUpdateTheme).toHaveBeenCalledWith({ mode: 'system' });
    });

    it('renders correct background color for light theme', () => {
        const { getByTestId } = render(
            <ThemeContext.Provider value={{ theme: { mode: 'light' }, updateTheme: jest.fn() }}>
                <Themes />
            </ThemeContext.Provider>
        );
        
        const container = getByTestId('themes-container');
        
        // Flatten the array of style object to the one object we need
        const flattenedStyle = StyleSheet.flatten(container.props.style);
        expect(flattenedStyle.backgroundColor).toBe('#FFFFFF');
    });
});