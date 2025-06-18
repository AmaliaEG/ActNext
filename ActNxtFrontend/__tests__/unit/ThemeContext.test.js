// Written by s235224

import React from 'react';
import { render, fireEvent } from "@testing-library/react-native";
import { ThemeProvider, useTheme } from '../../src/Themes/ThemeContext';
import { Button, Text, View } from 'react-native';

const TestComponent = () => {
  const { theme, updateTheme, mode } = useTheme();

  const toggleTheme = (newMode) => {
    updateTheme(newMode ?? (mode === 'light' ? 'dark' : 'light'));
  };

  return (
    <View>
      <Text testID="theme-text">{mode}</Text>
      <Button title="Switch to Dark" onPress={() => toggleTheme('dark')} />
      <Button title="Switch to Light" onPress={() => toggleTheme('light')} />
      <Button title="Switch to System" onPress={() => toggleTheme('system')} />
      <Button title="Toggle Theme" onPress={() => toggleTheme()} />
    </View>
  );
};

describe('ThemeContext', () => {
  it('initially uses system theme and updates on toggle', () => {
    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const before = getByTestId('theme-text').props.children;
    fireEvent.press(getByText('Toggle Theme'));
    const after = getByTestId('theme-text').props.children;

    expect(after).not.toBe(before);
  });

  it('switches to dark mode when "Switch to Dark" is pressed', () => {
    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.press(getByText('Switch to Dark'));
    expect(getByTestId('theme-text').props.children).toBe('dark');
  });

  it('does not change mode if already in desired mode', () => {
    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const current = getByTestId('theme-text').props.children;

    // Attempt to set same mode
    fireEvent.press(getByText(`Switch to ${capitalize(current)}`));

    // Should stay the same
    const after = getByTestId('theme-text').props.children;
    expect(after).toBe(current);
  });
});

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
