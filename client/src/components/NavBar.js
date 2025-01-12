import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
} from '@mui/material';
import { LockClock, Menu } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useValue } from '../context/ContextProvider';
// import photoURL from '../fsts.png';
import UserIcons from './user/UserIcons';
import Sidebar from './sidebar/Sidebar';
import logoUrl from "../logo2.png";
import HamburgerMenu from './sidebar/HamburgerMenu';

// const user = { name: 'user', photoURL };

const NavBar = () => {
  const {
    state: { currentUser },
    dispatch,
  } = useValue();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AppBar>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Menu Icon for Sidebar */}
            <Box sx={{ mr: 1, display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={() => setIsOpen(true)}
              >
                <Menu />
              </IconButton>
            </Box>
            <Box sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}>
              <HamburgerMenu />
            </Box>

            {/* Brand Name */}
            {/* <Typography
              variant="h6"
              component="h1"
              noWrap
              sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
            >
              AeroMAROC
            </Typography>
            <Typography
              variant="h6"
              component="h1"
              noWrap
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              AM
            </Typography> */}
            {/* Logo wrapped in Link to redirect to homepage */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <img
                  src={logoUrl}
                  alt="AeroMAROC Logo"
                  style={{ height: '40px', width: 'auto' }}
                />
              </Link>
            </Box>

            {/* Mobile version of brand logo wrapped in Link */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <img
                  src={logoUrl}
                  alt="AeroMAROC Logo"
                  style={{ height: '30px', width: 'auto' }}
                />
              </Link>
            </Box>

            {/* Desktop Navigation Links */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 2,
              }}
            >
              <Button component={Link} to="/" color="inherit">
                Home
              </Button>
              {currentUser && (
                <Button component={Link} to="/myflights" color="warning" variant='contained'>
                  My Flights
                </Button>
              )}
              <Button component={Link} to="/destinations" color="inherit">
                Destinations
              </Button>
              <Button component={Link} to="/about" color="inherit">
                About
              </Button>
              <Button component={Link} to="/contact" color="inherit">
                Contact
              </Button>
            </Box>

            {/* Space between buttons */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                marginLeft: { md: 2, xs: 1 },
              }}
            >
              {/* Login/Logout Buttons */}
              {/* <Button
                color="inherit"
                startIcon={<LockClock />}
                onClick={() => dispatch({ type: 'OPEN_LOGIN' })}
              >
                Login
              </Button> */}
              {!currentUser ? (
                // <Button
                //   color="inherit"
                //   startIcon={<Lock />}
                //   onClick={() =>
                //     dispatch({ type: 'UPDATE_USER', payload: user })
                //   }
                // >
                //   Login
                // </Button>
                <Button
                  color="inherit"
                  startIcon={<LockClock />}
                  onClick={() => dispatch({ type: 'OPEN_LOGIN' })}
                >
                  Login
                </Button>
              ) : (
                <UserIcons />
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Offset for fixed AppBar */}
      <Toolbar />
      {/* Sidebar Component */}
      <Sidebar {...{ isOpen, setIsOpen }} />
    </>
  );
};

export default NavBar;
