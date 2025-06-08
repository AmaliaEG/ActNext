// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import themes from './theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('system');
  const systemScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const resolvedMode = mode === 'system' ? systemScheme : mode;
  const theme = themes[resolvedMode] || themes.light; // Fallback to light

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (mode === 'system') setMode('system');
    });
    return () => listener.remove();
  }, [mode]);

  const updateTheme = (newMode) => {
    if (newMode !== mode) setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
