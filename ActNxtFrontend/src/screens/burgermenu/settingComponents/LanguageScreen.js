import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../../Themes/ThemeContext';
import useSettingsStore from '../../../store/useSettingsStore';

/**
 * Screen component for selecting the app's language - English or Danish.
 * 
 * Uses 'useTheme' for theming and 'useSettingsStore' for managing language settings.
 * @component
 * @example
 * return (
 *   <LanguagesScreen />
 * )
 */
const LanguagesScreen = () => {
  const { theme } = useTheme();
  const { language, setLanguage } = useSettingsStore();


/**
 * Determines which text color to use based on the selected language.
 *
 * @param {string} currentLang - The language option being rendered (e.g., 'en' or 'da').
 * @returns {string} The color to apply to the option text.
 */
  const getColor = (currentLang) => {
    return language === currentLang ? theme.colors.text : theme.colors.subText;
  };

  /**
   * Renders a pressable language option.
   * 
   * @param {string} label - The display name of the language option (e.g., 'English')
   * @param {string} value - The internal value of the language (e.g., 'en' or 'da').
   * @param {Function} setLanguage - Function to update the selected language in the store.
   * @param {Object} theme - The current theme context for styling.
   * @returns {JSX.Element} - A Pressable React Native element for the language option.
   */
  const renderOption = (label, value) => (
    <Pressable onPress={() => setLanguage(value)} style={styles.option}>
      <Text style={[styles.optionText, { color: getColor(value) }]}>{label}</Text>
    </Pressable>
  );

  /**
 * LanguagesScreen component for managing language preferences in the app.
 *
 * @returns {JSX.Element} A screen allowing the user to choose between available languages.
 */
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Language Settings</Text>
      {renderOption('English', 'en')}
      {renderOption('Danish', 'da')}
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

export default LanguagesScreen;
