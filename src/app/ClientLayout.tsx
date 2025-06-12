'use client';
 import "simplebar-react/dist/simplebar.min.css"; 

import { AWSProvider } from '@/context/AWSContext';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import Layout from '@/components/Layout.tsx';
import { ThemeContextProvider, useThemeContext } from '@/context/ThemeContext';
import {settings as allSettings} from '@/data/builtIn'
import { APIProvider, Map,useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
// import './style.css';

const settings=allSettings
function InnerLayout({ children,themeFromCookie }) {
  const { theme } = useThemeContext(themeFromCookie);
  console.log(themeFromCookie,"themeFromCookie",theme)
  useEffect(() => {
    const isDarkMode = theme.palette.mode === "dark";
    if(isDarkMode) {
      document.body.classList.add("dark"); // or "light"
      document.body.classList.remove("light");
      return () => document.body.classList.remove("dark");

    }
   else{ 
    document.body.classList.remove("dark"); // or "light"
    document.body.classList.add("light");
    return () => document.body.classList.remove("light");

  }
  }, [theme]);
  return (
    <MuiThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <APIProvider 
      libraries={["places"]}
      apiKey="AIzaSyB1GMYLuVbGQw-hz_lMfZfEUUXh3aEFOek">

        <Layout>
          {children}
          </Layout>
      </APIProvider>
    </MuiThemeProvider>
  );
}

export default function RootLayout({themeFromCookie, children }) {
  return (
    <html lang="en">
      <body>
        {/* <AWSProvider>*/}
        <AuthProvider> 
            <AppProvider>
            <ThemeContextProvider themeFromCookie={themeFromCookie}>
              <InnerLayout>{children}</InnerLayout>
            </ThemeContextProvider>
            </AppProvider>
          </AuthProvider>
       {/*  </AWSProvider> */}
      </body>
    </html>
  );
}
