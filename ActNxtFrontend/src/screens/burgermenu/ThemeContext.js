import React, { createContext, useState, useContext } from 'react';
import useSettingsStore from '../../store/useSettingsStore';
import { View, Text } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { theme, toggleTheme, updateTheme, _hasHydrated: isHydrated } = useSettingsStore();

    if (!isHydrated) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
          </View>
        );
    }

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
