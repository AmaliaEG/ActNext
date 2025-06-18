/**
 * @description
 * A screen component for selecting the app's theme (light, dark, or system).
 * Uses the current theme context to update and reflect theme changes.
 *
 * @component
 * @author s235224
 * @since 2025-06-06
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../../Themes/ThemeContext'


const ThemesScreen = () => {
  const { mode, updateTheme, theme } = useTheme();

  /**
   * Gets the appropriate text color based on the selected theme mode.
   *
   * @param {string} currentMode - The theme mode being rendered (e.g., 'light', 'dark', 'system').
   * @returns {string} - The color value to apply to the option text.
   */
  const getColor = (currentMode) => {
    return mode === currentMode ? theme.colors.text : theme.colors.subText;
  };

  /**
   * Renders a pressable theme option.
   *
   * @param {string} label - Display name of the theme option.
   * @param {string} value - Internal value of the theme mode.
   * @returns {JSX.Element} - A Pressable React Native element for the theme option.
   */
  const renderOption = (label, value) => (
    <Pressable onPress={() => updateTheme(value)} style={styles.option}>
      <Text style={[styles.optionText, { color: getColor(value) }]}>{label}</Text>
    </Pressable>
  );

  /**
 * A screen that allows the user to select a theme.
 * @returns {JSX.Element} A view with theme options.
 */
  return (
    // Define the main container with background options from the theme
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Theme Settings</Text>
      {renderOption('Light', 'light')}
      {renderOption('Dark', 'dark')}
      {renderOption('System', 'system')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
  },
  option: {
    marginVertical: 12,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default ThemesScreen;
