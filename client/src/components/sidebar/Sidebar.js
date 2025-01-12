import { Box, Drawer, IconButton, styled, Typography } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <Drawer variant="persistent" hideBackdrop={true} open={isOpen}>
      <DrawerHeader>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Welcome to Aero!
        </Typography>
        <IconButton onClick={() => setIsOpen(false)}>
          <ChevronLeft fontSize="large" />
        </IconButton>
      </DrawerHeader>
      <Box sx={{ width: 240, p: 3, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Experience seamless travel planning with Aero.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Explore flights, manage reservations, and enjoy your journey.
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
