'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  Fade,
  Tooltip,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../context/ThemeContext';
import LanguageIcon from '@mui/icons-material/Language';

const StyledTabs = muiStyled(Tabs)(({ theme }) => ({
  minHeight: 48,
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.palette.primary.main,
    transition: 'all 0.3s ease',
  },
}));

const StyledTab = muiStyled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minHeight: 48,
  fontWeight: 500,
  borderRadius: 4,
  padding: '0px 16px',
  marginRight: '2px',
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.light,
    backgroundColor: '#ffffff08',
    // backgroundColor: theme.palette.action.selected,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Nav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { toggleTheme, mode } = useThemeContext();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoggedIn = false; // Replace later with real auth logic

  const navLinks = [
    // { label: 'Interactive Map', href: '/map',shortLabel: 'Map' },
    // { label: 'Community', href: '/community' },
    // { label: 'Resources', href: '/resources' },
    { label: 'Foundation', href: '/foundation' },
    { label: 'Artist', href: '/artist' },
    { label: 'Artwork', href: '/artwork' },
    { label: 'Exhibitions', href: '/exhibitions' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleTabChange = (e, newValue) => {
    if (newValue !== pathname) router.push(newValue);
  };

  const handleLoginSubmit = () => {
    alert(`Pretending to login as ${email}`);
    setLoginOpen(false);
    setEmail('');
    setPassword('');
  };

  return (
    <>
      {(isMobile) ? (
        <>
                  <StyledTabs value={
              pathname.startsWith('/community') ? '/community' :
              pathname
              } 
          onChange={handleTabChange}>
            {navLinks.slice(0, 2)
            .map(({ label, href,shortLabel }) => (
              <StyledTab key={href} value={href} 
              label={shortLabel || label}
              />
            ))}
          </StyledTabs>

          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} color="inherit">
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            TransitionComponent={Fade}
          >
            {navLinks.slice(2)
            .map(({ label, href }) => (
              <MenuItem
                key={href}
                color="inherit"
                selected={pathname === href}
                onClick={() => {
                  setMenuAnchor(null);
                  // router.push(href); //this causes a full page reload, use router.push with shallow: true to prevent it
                  router.push(href, undefined, { shallow: true });
                }}
              >
                {label}
              </MenuItem>
            ))}
            {isLoggedIn ? (
              <MenuItem onClick={(e) => setProfileAnchor(e.currentTarget)}>Profile</MenuItem>
            ) : (
              // <MenuItem onClick={() => setLoginOpen(true)}>
              < LanguageIcon sx={{  }} />
                
              // {/* </MenuItem> */}
            )}
            {/* <MenuItem onClick={toggleTheme}>
              <IconButton color="inherit">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </MenuItem> */}
          </Menu>
        </>
      ) : (
        <>
          <StyledTabs value={
              pathname.startsWith('/community') ? '/community' :
              pathname
              } 
          onChange={handleTabChange}>
            {navLinks.map(({ label, href }) => (
              <StyledTab key={href} value={href} label={label} />
            ))}
          </StyledTabs>
{/* 
          <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 2 }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip> */}

          {isLoggedIn ? (
            <>
              <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ ml: 1 }}>
                <Avatar alt="User" src="/static/images/avatar/1.jpg" />
              </IconButton>
              <Menu
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={() => setProfileAnchor(null)}
              >
                <MenuItem onClick={() => setProfileAnchor(null)}>Profile</MenuItem>
                <MenuItem onClick={() => setProfileAnchor(null)}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant=""
              color="inherit"
              onClick={() => setLoginOpen(true)}
              sx={{
                borderRadius: '999px',
                // ml: 2,
                p:0,
                minWidth: 0,
                width: 40,
                // mr: 1,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              < LanguageIcon sx={{  }} />
            </Button>
          )}
        </>
      )}

      {/* Login Modal */}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleLoginSubmit}>
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Nav;
