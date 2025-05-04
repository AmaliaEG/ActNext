import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import SettingsScreen from '../src/screens/burgermenu/SettingsScreen';

const mockNavigate = jest.fn();

const mockNavigation = {
    navigate: mockNavigate,
};

const menuItems = [
    { title: 'Profile', screen: 'ProfileDetails' },
    { title: 'Themes', screen: 'Themes' },
    { title: 'Language', screen: 'Language' },
    { title: 'Notifications', screen: 'Notifications' },
    { title: 'Storage and Data', screen: 'StorageAndData' },
    { title: 'About ACTNXT App', screen: 'AboutACTNXTApp' },
];

jest.mock('@expo/vector-icons', () => ({
    AntDesign: () => null,
}));

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
});