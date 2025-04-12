
// components/Header.jsx
'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import styled from 'styled-components';
import Nav from './Nav';
import { usePathname, useRouter } from 'next/navigation';


const Logo = styled(Typography)`
  font-weight: bold;
  letter-spacing: 1px;
  // flex-grow: 1;
`;

const Header = () => {
  //router
  const router = useRouter();
  return(<AppBar 
    position= "sticky" // make it sticky
    // make it sticky


    sx={{ 
    top: 0,
    backgroundColor: 'background.paper', 
    color: 'text.primary', 
    // boxShadow:1, 
    // borderBottom: 1,
    zIndex: window.settings.zIndex.header,
    
    }}>
    <Toolbar
    //make the be set to size of inner content, no min height
    // size="small"
    variant="dense"
    // wrapperProps={{
    //     sx: {
    //         minHeight: '0px',
    //     },
    // }}
    // bgcolor="background.paper"
    
    // component={Box}
    // borderBottom={1}
        sx={{
            minHeight: '0px',

            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 2rem',
        }}
        
    >
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex', 
        alignItems: 'center' 
        }}>
      <Logo 
      //make clickable
      onClick={() => router.push('/')}

      variant="h6" 
      sx={{ 
        flexGrow: 0,
cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  }

      }}
       color="primary">PaliMap
       </Logo>
       <Typography variant="subtitle" color="text.secondary" sx={{ ml: 2 }}>
       Rebuilding Together
      </Typography>
      </Box>
      <Nav />
    </Toolbar>
  </AppBar>
);
}

export default Header;