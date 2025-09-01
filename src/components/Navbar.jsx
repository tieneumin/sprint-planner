import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useTheme,
  alpha 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dashboard, 
  Assignment, 
  CheckCircle, 
  History, 
  Add,
  SportsScore 
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: <Dashboard /> },
    { label: 'New Sprint', path: '/sprint/new', icon: <Add /> },
    { label: 'Daily Update', path: '/daily', icon: <CheckCircle /> },
    { label: 'Review', path: '/sprint/review', icon: <Assignment /> },
    { label: 'History', path: '/history', icon: <History /> }
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'white',
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: 0 }}>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <SportsScore 
              sx={{ 
                fontSize: 32, 
                color: 'primary.main', 
                mr: 1.5 
              }} 
            />
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
              Sprint Planner
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      color: 'primary.main',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
