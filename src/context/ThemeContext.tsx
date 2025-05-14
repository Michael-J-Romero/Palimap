// /context/ThemeContext.jsx

'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from '@/theme/getTheme'; // dynamic MUI theme generator

const ThemeContext = createContext();

export const ThemeContextProvider = ({ themeFromCookie,children }) => {
  const [mode, setMode] = useState(themeFromCookie||'dark'); // 'light' | 'dark'

  useEffect(() => {
    // const storedMode = localStorage.getItem('themeMode_1');
    // if (storedMode) setMode(storedMode);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      // localStorage.setItem('themeMode_1', next);
      // document.cookie = `theme=dark; path=/; max-age=31536000`;
      document.cookie = `theme=${next}; path=/; max-age=31536000`;
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
