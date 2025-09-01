import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Add, Delete, PlayArrow } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSprintManager } from '../hooks/useSprintManager';
import dayjs from 'dayjs';

const SprintSetup = () => {
  const navigate = useNavigate();
  const { activeSprint, createSprint } = useSprintManager();
  
  const [sprintName, setSprintName] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [duration, setDuration] = useState(7);
  const [goals, setGoals] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  
  // New goal form
  const [newGoal, setNewGoal] = useState({
    description: '',
    estimatedHours: '',
    priority: 'Medium'
  });

  const endDate = startDate.add(duration - 1, 'day');

  const handleAddGoal = () => {
    if (newGoal.description.trim() && newGoal.estimatedHours) {
      setGoals([
        ...goals,
        {
          id: Date.now().toString(),
          ...newGoal,
          estimatedHours: parseFloat(newGoal.estimatedHours),
          completed: false,
          actualHours: 0
        }
      ]);
      setNewGoal({
        description: '',
        estimatedHours: '',
        priority: 'Medium'
      });
    }
  };

  const handleRemoveGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const handleStartSprint = () => {
    if (activeSprint) {
      setShowWarning(true);
      return;
    }
    
    if (!sprintName.trim() || goals.length === 0) {
      alert('Please provide a sprint name and at least one goal.');
      return;
    }

    const newSprint = createSprint({
      name: sprintName.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      duration,
      goals
    });

    if (newSprint) {
      navigate('/');
    }
  };

  const handleForceStart = () => {
    setShowWarning(false);
    // Force create new sprint (this would replace the active one)
    const newSprint = createSprint({
      name: sprintName.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      duration,
      goals
    });

    if (newSprint) {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Sprint 🚀
        </Typography>
        
        {activeSprint && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            You already have an active sprint "{activeSprint.name}". 
            Starting a new sprint will replace the current one.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Basic Sprint Info */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Sprint Details
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Sprint Name"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              placeholder="e.g., Midterm Week, Project Sprint"
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (days)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 7)}
              inputProps={{ min: 1, max: 14 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              End Date: {endDate.format('MMMM D, YYYY')}
            </Typography>
          </Grid>

          {/* Goals Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Sprint Goals
            </Typography>
          </Grid>

          {/* Add New Goal */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Add New Goal
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Goal Description"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      placeholder="e.g., Finish Math Assignment 3"
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={2}>
                    <TextField
                      fullWidth
                      label="Hours"
                      type="number"
                      value={newGoal.estimatedHours}
                      onChange={(e) => setNewGoal({ ...newGoal, estimatedHours: e.target.value })}
                      inputProps={{ min: 0.5, step: 0.5 }}
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={newGoal.priority}
                        label="Priority"
                        onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                      >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAddGoal}
                      disabled={!newGoal.description.trim() || !newGoal.estimatedHours}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Goals List */}
          {goals.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Sprint Goals ({goals.length})
              </Typography>
              
              {goals.map((goal) => (
                <Card key={goal.id} variant="outlined" sx={{ mb: 1 }}>
                  <CardContent sx={{ py: 2 }}>
                    <Box display="flex" justifyContent="between" alignItems="center">
                      <Box flex={1}>
                        <Typography variant="body1">
                          {goal.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {goal.estimatedHours}h • {goal.priority} Priority
                        </Typography>
                      </Box>
                      
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveGoal(goal.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total estimated hours: {goals.reduce((sum, goal) => sum + goal.estimatedHours, 0)}h
              </Typography>
            </Grid>
          )}

          {/* Start Sprint Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleStartSprint}
                disabled={!sprintName.trim() || goals.length === 0}
              >
                Start Sprint
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onClose={() => setShowWarning(false)}>
        <DialogTitle>Replace Active Sprint?</DialogTitle>
        <DialogContent>
          <Typography>
            You already have an active sprint running. Starting a new sprint will replace 
            the current one and you'll lose your current progress. Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarning(false)}>Cancel</Button>
          <Button onClick={handleForceStart} variant="contained" color="warning">
            Replace Sprint
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SprintSetup;
