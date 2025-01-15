import {
  Category,
  ChevronLeft,
  ConnectingAirports,
  Dashboard,
  EventSeat,
  Flight,
  FlightClass,
  FlightTakeoff,
  Logout,
  PeopleAlt,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useValue } from '../../context/ContextProvider';
import Main from './main/Main';
import Users from './users/Users';
import Reservation from './reservations/Reservation';
import Classe from './classes/Classe';
import Categories from './categories/Categories';
import Airplane from './avions/Airplane';
import Vol from './vols/Vol';
import Trajet from './trajet/Trajet';
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const SideList = ({ open, setOpen }) => {
  const {
    state: { currentUser },
    dispatch,
  } = useValue();

  const [selectedLink, setSelectedLink] = useState('/dashboard/');

  const list = useMemo(
    () => [
      {
        title: 'Main',
        icon: <Dashboard />,
        link: '/dashboard/',
        component: <Main {...{ setSelectedLink, link: '/dashboard/' }} />,
      },
      {
        title: 'Trajets',
        icon: <ConnectingAirports />,
        link: '/dashboard/trajets',
        component: <Trajet {...{ setSelectedLink, link: '/dashboard/trajets' }} />,
      },
      {
        title: 'Users',
        icon: <PeopleAlt />,
        link: '/dashboard/users',
        component: <Users {...{ setSelectedLink, link: '/dashboard/users' }} />,
      },
      {
        title: 'Airplanes',
        icon: <Flight />,
        link: '/dashboard/airplanes',
        component: <Airplane {...{ setSelectedLink, link: '/dashboard/airplanes' }} />,
      },
      {
        title: 'Reservations',
        icon: <EventSeat />,
        link: '/dashboard/reservations',
        component: <Reservation {...{ setSelectedLink, link: '/dashboard/reservations' }} />,
      },
      {
        title: 'Categories',
        icon: <Category />,
        link: '/dashboard/categories',
        component: <Categories  {...{ setSelectedLink, link: '/dashboard/categories' }} />,
      },
      {
        title: 'Classes',
        icon: <FlightClass />,
        link: '/dashboard/classes',
        component: <Classe {...{ setSelectedLink, link: '/dashboard/classes' }} />,
      },
      {
        title: 'Vol',
        icon: <FlightTakeoff />,
        link: '/dashboard/vols',
        component: <Vol {...{ setSelectedLink, link: '/dashboard/vols' }} />,
      },
    ],
    []
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'UPDATE_USER', payload: null });
    navigate('/');
  };
  return (
    <>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {list.map((item) => (
            <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={() => navigate(item.link)}
                selected={selectedLink === item.link}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ mx: 'auto', mt: 3, mb: 1 }}>
          <Tooltip title={currentUser?.name || ''}>
            <Avatar
              src={currentUser?.photoURL}
              {...(open && { sx: { width: 100, height: 100 } })}
            />
          </Tooltip>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          {open && <Typography>{currentUser?.name}</Typography>}
          <Typography variant="body2">{currentUser?.role || 'role'}</Typography>
          {open && (
            <Typography variant="body2">{currentUser?.email}</Typography>
          )}
          <Tooltip title="Logout" sx={{ mt: 1 }}>
            <IconButton onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          {list.map((item) => (
            <Route key={item.title} path={item.link.replace('/dashboard', '')} element={item.component} />
          ))}
        </Routes>
      </Box>
    </>
  );
};

export default SideList;
