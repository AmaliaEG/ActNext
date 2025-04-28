import React, { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // default is light

    const toggleTheme = (selectedTheme) => {
        setTheme(selectedTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
