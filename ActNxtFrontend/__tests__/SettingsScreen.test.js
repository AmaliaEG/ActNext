import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import SettingsScreen from '../src/screens/burgermenu/SettingsScreen';

const mockNavigate = jest.fn();
const mockToggleNotifications = jest.fn();

jest.mock('../src/store/useSettingsStore', () => {
    return {
        __esModule: true,
        default: () => ({
            theme: { mode: 'light' },
            toggleTheme: jest.fn(),
            updateTheme: jest.fn(),
            language: 'en',
            setLanguage: jest.fn(),
            notificationsEnabled: true,
            toggleNotifications: mockToggleNotifications,
            hydrated: true
        }),
    };
});

jest.mock('@expo/vector-icons', () => ({
    AntDesign: () => null,
}));

describe('SettingsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders titles correctly', () => {
        const { getByText } = render(<SettingsScreen navigation={{ navigate: mockNavigate }} />);

        [
            'Profile',
            'Themes',
            'Language',
            'Notifications',
            'About ACTNXT App',
        ].forEach(title => expect(getByText(title)).toBeTruthy());
    });

    it('navigates to screen when title is pressed', () => {
        const { getByText } = render(<SettingsScreen navigation={{ navigate: mockNavigate }} />);
        fireEvent.press(getByText('Themes'));
        expect(mockNavigate).toHaveBeenCalledWith('Themes');
    });

    it('toggles notifications when pressed', () => {
        const { getByRole } = render(<SettingsScreen navigation={{ navigate: mockNavigate }} />);
        fireEvent(getByRole('switch'), 'valueChange', false);
        expect(mockToggleNotifications).toHaveBeenCalled();
    });
});