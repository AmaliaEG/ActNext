// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import themes from './theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('system'); // light | dark | system
  const systemScheme = Appearance.getColorScheme();
  const resolvedMode = mode === 'system' ? systemScheme : mode;
  const theme = themes[resolvedMode] || themes.light;

  // Only change theme if newMode is different
const updateTheme = (newMode) => {
  setMode((prevMode) => {
    if (prevMode === newMode) return prevMode;
    return newMode;
  });
};


  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (mode === 'system') {
        setMode('system');
      }
    });
    return () => listener.remove();
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, resolvedMode, theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
