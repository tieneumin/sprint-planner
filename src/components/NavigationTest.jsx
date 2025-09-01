import React from "react";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavigationTest = () => {
  const navigate = useNavigate();

  return (
    <Box p={2}>
      <h2>Navigation Test</h2>
      <Button onClick={() => navigate("/")} variant="contained" sx={{ mr: 1 }}>
        Go to Dashboard
      </Button>
      <Button
        onClick={() => navigate("/daily")}
        variant="contained"
        sx={{ mr: 1 }}
      >
        Go to Daily
      </Button>
      <Button onClick={() => navigate("/history")} variant="contained">
        Go to History
      </Button>
    </Box>
  );
};

export default NavigationTest;
