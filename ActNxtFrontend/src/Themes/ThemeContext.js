// ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import themes from './theme';

/**
 * Theme context mangages the application's theme settings: light, dark, or system.
 * 
 * This context provides the current theme, the resolved mode based on system settings,
 * and a function to update the theme mode. It listens for system theme changes and updates
 * the theme accordingly when the mode is set to 'system'.
 * @module ThemeContext

 * );
 */

const ThemeContext = createContext();

/**
 * ThemeProvider component wraps the application to provide theme context.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components that will have access to the theme context. 
 * @returns {JSX.Element} - The ThemeContext provider wrapping the children components.
 */
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('system'); // light | dark | system
  const systemScheme = Appearance.getColorScheme();
  const resolvedMode = mode === 'system' ? systemScheme : mode;
  const theme = themes[resolvedMode] || themes.light;

/**
 * Only change theme if newMode is different
 * 
 * @param {string} newMode - The new theme mode to set ('light', 'dark', or 'system').
 * @returns {void}
 */
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
