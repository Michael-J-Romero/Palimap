// /theme/getTheme.js
import { createTheme } from '@mui/material/styles';
const getTheme = (mode = 'light') => 
  createTheme({
  
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light theme colors
            primary: {
              main: '#1976d2',
            },
            secondary: {
              main: '#9c27b0',
            },
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
              subtle: 'yellow',
              subtle: '#f0f0f0',
            },
            text: {
              primary: '#000000',
              secondary: '#333333',
            },
          }
        : {
            // Dark theme colors
            primary: {
              main: '#90caf9',
            },
            secondary: {
              main: '#ce93d8',
            },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
              subtle: 'yellow',
              // subtle: '#1a1a1a',
            },
            text: {
              primary: '#ffffff',
              secondary: '#cccccc',
            },
          }),
    },

    typography: {
      fontFamily: ['"Inter"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
      fontSize: 14,
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            elevation: 3,
          },
        },
      },
      // Add other component overrides here
    },
  });
  
  export default getTheme;
  