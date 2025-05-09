import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import SettingsScreen from '../src/screens/burgermenu/SettingsScreen';

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

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
            toggleNotifications: jest.fn(),
            hydrated: true
        })
    }
})

jest.mock('@expo/vector-icons', () => ({
    AntDesign: () => null,
}));

const menuItems = [
    { title: 'Profile', screen: 'ProfileDetails' },
    { title: 'Themes', screen: 'Themes' },
    { title: 'Language', screen: 'Language' },
    { title: 'Notifications', screen: 'Notifications' },
    { title: 'About ACTNXT App', screen: 'AboutACTNXTApp' },
];

describe('SettingsScreen', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('renders titles correctly', () => {
        const { getByText } = render(<SettingsScreen navigation={mockNavigation}/>);

        menuItems.forEach((item) => {
            expect(getByText(item.title)).toBeTruthy();
        });
    });

    it('navigates to screen when title is pressed', () => {
        const { getByText } = render(<SettingsScreen navigation={mockNavigation}/>);

        menuItems.forEach((item) => {
            mockNavigate.mockClear();
            fireEvent.press(getByText(item.title));
            expect(mockNavigate).toHaveBeenCalledWith(item.screen);
        });
    });

    it('toggles notifications when pressed', () => {
        const { getByRole } = render(<SettingsScreen navigation={mockNavigation}/>);
        const toggleInput = getByRole('switch');

        fireEvent(toggleInput, 'valueChange', false);

        const store = require('../src/store/useSettingsStore').default();
        expect(store.toggleNotifications).toHaveBeenCalled();
    });
});