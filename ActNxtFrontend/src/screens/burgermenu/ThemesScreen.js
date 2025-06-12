import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../Themes/ThemeContext'


const ThemesScreen = () => {
  const { mode, updateTheme, theme } = useTheme();

  const getColor = (currentMode) => {
    return mode === currentMode ? theme.colors.text : theme.colors.subText;
  };

  const renderOption = (label, value) => (
    <Pressable onPress={() => updateTheme(value)} style={styles.option}>
      <Text style={[styles.optionText, { color: getColor(value) }]}>{label}</Text>
    </Pressable>
  );

  return (
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
