'use client';
// components/Layout.jsx
import './main.css';
import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '@mui/material/styles';
import { usePathname} from 'next/navigation';


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
  height: 100% !important;

  flex: 1;
//   padding: 2rem 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
 
  height: 100%;
  &.fullscreen {
    // height: 100vh;
    overflow: hidden;
  }

`;

const Layout = ({ children }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const fullScreen = 
  pathname === '/map' || pathname === '/map/'
  ||pathname === '/'
  ||pathname === '/map2' || pathname === '/map2/'
  || pathname?.startsWith('/community')
  return (
    <ThemeProvider theme={theme}>
      <Wrapper className={fullScreen ? 'fullscreen' : ''}>
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
        <div style = {{
          overflow: fullScreen ? 'hidden' : 'auto',
          height: '100%',

        }}>
        <Container 
        //make fullscreen 
        sx={{ 
          // height: '100%',
          ...fullScreen ? { height: '100%' } : { },
          maxWidth: fullScreen ? '100%!important' : 'lg' , 
        }}
        maxWidth="md" 
        disableGutters={fullScreen}>
          <Main >{children}
          </Main>
        </Container>
        {(!fullScreen) && <Footer />}
        </div>
      </Wrapper>
    </ThemeProvider>
  );
};

export default Layout;