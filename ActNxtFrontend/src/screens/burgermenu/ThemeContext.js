import React, { createContext, useState, useContext } from 'react';
import useSettingsStore from '../../store/useSettingsStore';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { theme, toggleTheme, updateTheme } = useSettingsStore();

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
