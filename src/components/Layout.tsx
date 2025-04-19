// components/Layout.jsx
'use client';

import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '@mui/material/styles';
import { usePathname } from 'next/navigation';


import { useAuth } from '@/context/AuthContext';
import { Button } from '@mui/material';

const AdminToggle = () => {
  const { toggleAdminMode, isAdminDevMode } = useAuth();

  return (
    <Button 
      variant="outlined" 
      size="small" 
      onClick={toggleAdminMode}
      sx={{ ml: 2 }}
    >
      {isAdminDevMode ? 'Disable Admin Mode' : 'Enable Admin Mode'}
    </Button>
  );
};

 

const Main = styled.main`
  height: 100%;

  flex: 1;
//   padding: 2rem 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  //full screen if fullScreen is true
  min-height: 100vh;
  height: ${(props) => (props.fullScreen ? '100vh' : '100%')};
  
  background-color: ${(props) => props.theme.palette.background.default};
  color: ${(props) => props.theme.palette.text.primary};
`;

const Layout = ({ children }) => {
  const theme = useTheme();
  const fullScreen = usePathname() === '/map' || usePathname() === '/map/';
  return (
    <ThemeProvider theme={theme}>
      <Wrapper fullScreen={fullScreen}>
        {/* <CssBaseline /> */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
zIndex: 99999999,
        }}>
{/* <AdminToggle/> */}
        </div>
        <Header />
        <Container 
        //make fullscreen 
        sx={{ 
          maxWidth: fullScreen ? '100%!important' : 'lg' , 
          height: '100%',
          overflow: fullScreen ? 'hidden' : 'auto',
        }}
        maxWidth="lg" 
        disableGutters={fullScreen}>
          <Main >{children}</Main>
        </Container>
        {(!fullScreen) && <Footer />}
      </Wrapper>
    </ThemeProvider>
  );
};

export default Layout;