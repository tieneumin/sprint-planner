import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dashboard,
  Assignment,
  CheckCircle,
  History,
  Add,
} from "@mui/icons-material";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/", icon: <Dashboard /> },
    { label: "New Sprint", path: "/sprint/new", icon: <Add /> },
    { label: "Daily Update", path: "/daily", icon: <CheckCircle /> },
    { label: "Review", path: "/sprint/review", icon: <Assignment /> },
    { label: "History", path: "/history", icon: <History /> },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          📋 Sprint Planner
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              variant={location.pathname === item.path ? "outlined" : "text"}
              sx={{
                color: "white",
                borderColor:
                  location.pathname === item.path ? "white" : "transparent",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
