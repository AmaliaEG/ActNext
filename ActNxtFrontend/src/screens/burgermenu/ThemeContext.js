import React, { createContext, useState, useContext, useCallback } from 'react';
import useSettingsStore from '../../store/useSettingsStore';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { theme, toggleTheme, updateTheme: updateThemeInStore } = useSettingsStore();

    const updateTheme = useCallback((newTheme) => {
        if (!newTheme || newTheme.mode === theme.mode) {
            return; // Skip unnecessay updates
        }
        updateThemeInStore(newTheme);
    }, [theme, updateThemeInStore]);

    const contextValue = {
        theme,
        toggleTheme,
        updateTheme
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
