'use client';
 import "simplebar-react/dist/simplebar.min.css"; 

import { AWSProvider } from '@/context/AWSContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import Layout from '@/components/Layout.tsx';
import { ThemeContextProvider, useThemeContext } from '@/context/ThemeContext';
import {settings as allSettings} from '@/data/builtIn'
const settings=allSettings
function InnerLayout({ children }) {
  const { theme } = useThemeContext();
  return (
    <MuiThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <Layout>
        {children}
        </Layout>
    </MuiThemeProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <AWSProvider>*/}
        <AuthProvider> 
            <ThemeContextProvider>
              <InnerLayout>{children}</InnerLayout>
            </ThemeContextProvider>
          </AuthProvider>
       {/*  </AWSProvider> */}
      </body>
    </html>
  );
}
