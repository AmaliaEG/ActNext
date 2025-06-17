import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LanguagesScreen from '../src/screens/burgermenu/settingComponents/LanguageScreen';

// Mock zustand store
const mockSetLanguage = jest.fn();

jest.mock('../src/store/useSettingsStore.js', () => {
  return {
    __esModule: true,
    default: () => ({
      language: 'en',
      setLanguage: mockSetLanguage,
      hydrated: true,
    }),
  };
});

// for the theme context
jest.mock('../src/Themes/ThemeContext', () => ({
  __esModule: true,
  useTheme: () => ({
    theme: {
      colors: {
        background: '#E9E9E9',
        text: '#000000',
        subText: '#666666',
      },
    },
  }),
}));

describe('LanguagesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and language options', () => {
    const { getByText } = render(<LanguagesScreen />);
    expect(getByText('Language Settings')).toBeTruthy();
    expect(getByText('English')).toBeTruthy();
    expect(getByText('Danish')).toBeTruthy();
  });

  it('calls setLanguage with "en" when English is pressed', () => {
    const { getByText } = render(<LanguagesScreen />);
    fireEvent.press(getByText('English'));
    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });

  it('calls setLanguage with "da" when Danish is pressed', () => {
    const { getByText } = render(<LanguagesScreen />);
    fireEvent.press(getByText('Danish'));
    expect(mockSetLanguage).toHaveBeenCalledWith('da');
  });
});