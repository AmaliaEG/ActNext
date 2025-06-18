// Written by s235224

import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import SettingsScreen from '../../src/screens/burgermenu/SettingsScreen';

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    AntDesign: () => <Text>Mock Icon</Text>,
  };
});


const mockToggleNotifications = jest.fn();
const mockSetLanguage = jest.fn();

jest.mock('../../src/store/useSettingsStore', () => ({
  __esModule: true,
  default: () => ({
    language: 'en',
    setLanguage: mockSetLanguage,
    notificationsEnabled: true,
    toggleNotifications: mockToggleNotifications,
    hydrated: true,
  }),
}));

jest.mock('../../src/Themes/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        text: '#000000',
        border: '#CCCCCC',
        background: '#E9E9E9',
        inputText: '#000000',
        primary: '#007AFF',
      },
      mode: 'light',
    }
  }),
}));

// Mock sub screens
jest.mock('../../src/screens/burgermenu/settingComponents/ProfileDetailsScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Mock ProfileDetailsScreen</Text>;
});

jest.mock('../../src/screens/burgermenu/settingComponents/ThemesScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Mock ThemesScreen</Text>;
});

jest.mock('../../src/screens/burgermenu/settingComponents/AboutACTNXTAppScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Mock AboutACTNXTAppScreen</Text>;
});

jest.mock('../../src/screens/burgermenu/settingComponents/LanguageScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>Mock LanguagesScreen</Text>;
});

describe('SettingsScreen', () => {
  it('renders titles correctly', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
    expect(getByText('Themes')).toBeTruthy();
    expect(getByText('Language')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('About ActNxt App')).toBeTruthy();
  });

  it('renders ThemesScreen when "Themes" is pressed', () => {
    const { getByText, queryByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('Themes'));
    expect(queryByText('Mock ThemesScreen')).toBeTruthy();
  });

  it('renders LanguagesScreen when "Language" is pressed', () => {
    const { getByText, queryByText } = render(<SettingsScreen />);
    fireEvent.press(getByText('Language'));
    expect(queryByText('Mock LanguagesScreen')).toBeTruthy();
  });

  it('toggles notifications when Switch is pressed', () => {
    const { getByRole } = render(<SettingsScreen />);
    const switchToggle = getByRole('switch');
    fireEvent(switchToggle, 'valueChange', false);
    expect(mockToggleNotifications).toHaveBeenCalled();
  });
});
