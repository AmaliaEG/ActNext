// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import themes from './theme';

const ThemeContext = createContext();

// ThemeProvider component to provide theme context to the app
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('system'); // Default to system mode
  const systemScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const resolvedMode = mode === 'system' ? systemScheme : mode; // Use system scheme if mode is 'system'
  const theme = themes[resolvedMode] || themes.light; // Fallback to light

  // Effect to update the theme when the system color scheme changes
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (mode === 'system') setMode('system');
    });
    return () => listener.remove();
  }, [mode]);

  const updateTheme = (newMode) => {
    if (newMode !== mode) setMode(newMode);
  };

  // Provide the theme context to children components
  // This includes the current mode, resolved mode, theme object, and a function to update the theme
  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
