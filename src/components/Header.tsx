
// components/Header.jsx
'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Box ,useMediaQuery,useTheme,} from '@mui/material';
import styled from 'styled-components';
import Nav from './Nav';
import { usePathname, useRouter } from 'next/navigation';
import {settings as allSettings} from '@/data/builtIn'
const settings=allSettings

const Logo = styled(Typography)`
  font-weight: 100;
  letter-spacing: 1px;
  // flex-grow: 1;
`;

const Header = () => {
    const theme = useTheme();
  
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  //router
  const router = useRouter();
  return(<AppBar 
    id="primary-header"
    position= "sticky" // make it sticky
    // make it sticky


    sx={{ 
      // display: 'none !important',
    top: 0,
    backgroundColor: 'background.paper', 
    color: 'text.primary', 
    // boxShadow:1, 
    // borderBottom: 1,
    zIndex: settings.zIndex.header,
    
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
            px: { xs: 1, sm: 1 },
        }}
        
    >
      <Box 
      onClick={() => router.push('/', undefined, { shallow: true })}
      
      sx={{ 
        flexGrow: 1,
        display: 'flex', 
        alignItems: 'center' 
        }}>
          <img 
          // src="https://cdn-icons-png.flaticon.com/512/9356/9356230.png"
          src="/pin2.png"
          // src="/logo.png"
          alt="logo"
          style={{
          width: 29,
          height: 38, 
          filter: 'grayscale(.4)',
          // marginLeft: -8,
          // scale: 1.1,
          marginRight: 4,
          }}
          />
          
      <Logo 
      //make clickable
      onClick={() => router.push('/', undefined, { shallow: true })}

      variant="h6" 
      fontWeight="100"
      sx={{ 

    //         align-self: flex-end;
    // margin-bottom: 2px;
    alignSelf: 'flex-end',

        fontWeight: 'normal',
        display: { xs: 'none', sm: 'block' },
        flexGrow: 0,
cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  }

      }}
       color="primary">
        PaliMap
       </Logo>
       {/* <Typography variant="subtitle" color="text.secondary" 
       sx={{
         ml: 2,
         display: { sm: 'none', md: 'block',xs: 'none' },
         }}>
       Rebuilding Together
      </Typography> */}
      </Box>
      <Nav />
    </Toolbar>
  </AppBar>
);
}

export default Header;