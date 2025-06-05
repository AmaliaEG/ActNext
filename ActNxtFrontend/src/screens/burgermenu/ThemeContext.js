import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import useSettingsStore from '../../store/useSettingsStore';
import { Appearance } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

// Allows any component to access the current theme
export const ThemeContext = createContext();

// The wrapper component that provides the current theme and update logic to all child components
export const ThemeProvider = ({ children }) => {
    const { theme, updateTheme: updateThemeInStore } = useSettingsStore();

    // Get current system preference (light/dark)
    const systemTheme = Appearance.getColorScheme();

    // Given the mode of the theme being 'system', decide whether to use light or dark
    const resolvedTheme = theme.mode === 'system' ? systemTheme : theme.mode;

    useEffect(() => {
        const listener = Appearance.addChangeListener(({ colorScheme }) => {
            if (theme.mode === 'system') {
                updateThemeInStore({ mode: 'system' });
            }
        });

        return () => listener.remove(); // Cleanup listener
    }, [theme.mode, updateThemeInStore]);

    const updateTheme = useCallback((newTheme) => {
        if (!newTheme || newTheme.mode === theme.mode) {
            return; // Skip unnecessay updates
        }
        updateThemeInStore(newTheme);
    }, [theme.mode, updateThemeInStore]);

    const contextValue = {
        theme,
        resolvedTheme,
        updateTheme
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
