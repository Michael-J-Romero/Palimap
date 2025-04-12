// /context/ThemeContext.jsx

'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from '@/theme/getTheme'; // dynamic MUI theme generator

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState('light'); // 'light' | 'dark'

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode');
    if (storedMode) setMode(storedMode);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const theme = useMemo(() => {
    let t=getTheme(mode)
    console.log('Theme4:', t)
    return createTheme(t)
  }, [mode]);
  console.log('Theme:', theme
  )
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
