import React, { useState } from 'react';
import {
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { Menu, Close } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useValue } from '../../context/ContextProvider';

const HamburgerMenu = () => {
    const {
        state: { currentUser },
    } = useValue();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = (open) => () => {
        setIsOpen(open);
    };

    return (
        <>
            {/* Hamburger Icon */}
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
            >
                <Menu />
            </IconButton>

            {/* Drawer */}
            <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{
                        width: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    {/* Close Button */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            padding: 2,
                            borderBottom: '1px solid #ccc',
                        }}
                    >
                        <IconButton onClick={toggleDrawer(false)}>
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Navigation Links */}
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/" onClick={toggleDrawer(false)}>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                        {currentUser && (
                            <ListItem disablePadding>
                                <Button
                                    component={Link}
                                    to="/myflights"
                                    variant="contained"
                                    color="warning"
                                    fullWidth
                                    sx={{
                                        justifyContent: 'flex-start',
                                        margin: '8px 16px',
                                    }}
                                    onClick={toggleDrawer(false)}
                                >
                                    My Flights
                                </Button>
                            </ListItem>
                        )}
                        {/* <ListItem disablePadding>
                            <ListItemButton component={Link} to="/myflights" onClick={toggleDrawer(false)}>
                                <ListItemText primary="My Flights" />
                            </ListItemButton>
                        </ListItem> */}
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/destinations" onClick={toggleDrawer(false)}>
                                <ListItemText primary="Destinations" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/about" onClick={toggleDrawer(false)}>
                                <ListItemText primary="About" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/contact" onClick={toggleDrawer(false)}>
                                <ListItemText primary="Contact" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default HamburgerMenu;
