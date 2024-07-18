'use client'
import React, { useState, createContext, ReactNode } from 'react';
import Header from '../components/header';

interface ThemeProviderProps {
    children: ReactNode;
}

interface ThemeContextProps {
    theme: string;
    setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
    theme: 'light',
    setTheme: () => {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState('light');

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
