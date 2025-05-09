import { render, fireEvent } from "@testing-library/react-native";
import Themes from '../src/screens/burgermenu/ThemesScreen';
import { ThemeContext } from '../src/screens/burgermenu/ThemeContext';
import { StyleSheet } from 'react-native';


// MOCKS
jest.mock('../src/store/useSettingsStore', () => ({
    __esModule: true,
    default: () => ({
        theme: { mode: 'dark' },
        updateTheme: jest.fn(),
        toggleTheme: jest.fn(),
        hydrated: true,
    }),
}));

// TESTS FOR Themes
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
        jest.doMock('../src/store/useSettingsStore', () => ({
            __esModule: true,
            default: () => ({
                theme: { mode: 'light' },
                updateTheme: jest.fn(),
                hydrated: true,
            }),
        }));

        const Themes = require('../src/screens/burgermenu/ThemesScreen').default;
    });

    it('renders correct background color for dark theme', () => {
        const { getByTestId } = render(
            <ThemeContext.Provider value={{ theme: { mode: 'dark' }, updateTheme: jest.fn() }}>
                <Themes />
            </ThemeContext.Provider>
        );
        
        const container = getByTestId('themes-container');
        
        // Flatten the array of style object to the one object we need
        const flattenedStyle = StyleSheet.flatten(container.props.style);
        expect(flattenedStyle.backgroundColor).toBe('#121212');
    });
});