// Written by s235224

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ThemesScreen from '../../src/screens/burgermenu/settingComponents/ThemesScreen';

// Mock updateTheme
const mockUpdateTheme = jest.fn();

//  Mock theme context
jest.mock('../../src/Themes/ThemeContext', () => ({
  __esModule: true,
  useTheme: () => ({
    mode: 'light',
    updateTheme: mockUpdateTheme,
    theme: {
      colors: {
        background: '#E9E9E9',
        text: '#000000',
        subText: '#666666',
      },
    },
  }),
}));

describe('ThemesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders theme settings title and all options', () => {
    const { getByText } = render(<ThemesScreen />);
    expect(getByText('Theme Settings')).toBeTruthy();
    expect(getByText('Light')).toBeTruthy();
    expect(getByText('Dark')).toBeTruthy();
    expect(getByText('System')).toBeTruthy();
  });

  it('calls updateTheme with "light" when Light is pressed', () => {
    const { getByText } = render(<ThemesScreen />);
    fireEvent.press(getByText('Light'));
    expect(mockUpdateTheme).toHaveBeenCalledWith('light');
  });

  it('calls updateTheme with "dark" when Dark is pressed', () => {
    const { getByText } = render(<ThemesScreen />);
    fireEvent.press(getByText('Dark'));
    expect(mockUpdateTheme).toHaveBeenCalledWith('dark');
  });

  it('calls updateTheme with "system" when System is pressed', () => {
    const { getByText } = render(<ThemesScreen />);
    fireEvent.press(getByText('System'));
    expect(mockUpdateTheme).toHaveBeenCalledWith('system');
  });
});
