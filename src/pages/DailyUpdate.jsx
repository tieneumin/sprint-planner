import React, { useState, useEffect } from 'react';
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
  Checkbox,
  FormControlLabel,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import { CheckCircle, Save, Today } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSprintManager } from '../hooks/useSprintManager';
import dayjs from 'dayjs';

const DailyUpdate = () => {
  const navigate = useNavigate();
  const { activeSprint, getSprintProgress, getTodayCheckin, saveDailyUpdate } = useSprintManager();
  
  const [goalUpdates, setGoalUpdates] = useState([]);
  const [focusGoals, setFocusGoals] = useState([]);
  const [dailyPlan, setDailyPlan] = useState('');
  const [hasExistingCheckin, setHasExistingCheckin] = useState(false);

  const today = dayjs().format('YYYY-MM-DD');
  const todayFormatted = dayjs().format('MMMM D, YYYY');

  useEffect(() => {
    if (!activeSprint) return;

    // Initialize goal updates
    const initialUpdates = activeSprint.goals.map(goal => ({
      goalId: goal.id,
      completed: goal.completed || false,
      hoursWorked: 0,
      notes: ''
    }));
    setGoalUpdates(initialUpdates);

    // Check for existing checkin
    const existingCheckin = getTodayCheckin();
    if (existingCheckin) {
      setHasExistingCheckin(true);
      // Load existing data
      if (existingCheckin.goalUpdates) {
        setGoalUpdates(existingCheckin.goalUpdates);
      }
      if (existingCheckin.focusGoals) {
        setFocusGoals(existingCheckin.focusGoals);
      }
      if (existingCheckin.dailyPlan) {
        setDailyPlan(existingCheckin.dailyPlan);
      }
    }
  }, [activeSprint, getTodayCheckin]);

  if (!activeSprint) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          No active sprint found. Please create a sprint first.
          <Button onClick={() => navigate('/sprint/new')} sx={{ ml: 2 }}>
            Create Sprint
          </Button>
        </Alert>
      </Container>
    );
  }

  const progress = getSprintProgress();

  const handleGoalUpdate = (goalId, field, value) => {
    setGoalUpdates(prev => 
      prev.map(update => 
        update.goalId === goalId 
          ? { ...update, [field]: value }
          : update
      )
    );
  };

  const handleFocusGoalToggle = (goalId) => {
    setFocusGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : prev.length < 3 
          ? [...prev, goalId]
          : prev
    );
  };

  const handleSaveCheckin = () => {
    const checkin = {
      date: today,
      goalUpdates,
      focusGoals,
      dailyPlan,
      timestamp: dayjs().toISOString()
    };

    saveDailyUpdate(today, checkin);
    
    alert('Daily check-in saved successfully!');
    navigate('/');
  };

  const getTotalHoursToday = () => {
    return goalUpdates.reduce((sum, update) => sum + (parseFloat(update.hoursWorked) || 0), 0);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Today color="primary" />
          <Typography variant="h4">
            Daily Check-in
          </Typography>
          <Chip 
            label={`Day ${progress.daysPassed} of ${progress.totalDays}`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          {todayFormatted}
        </Typography>

        {hasExistingCheckin && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You've already checked in today. You can update your progress below.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Goals Progress */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              📋 Update Goals Progress
            </Typography>
            
            {activeSprint.goals.map((goal) => {
              const update = goalUpdates.find(u => u.goalId === goal.id);
              if (!update) return null;

              return (
                <Card key={goal.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={update.completed}
                            onChange={(e) => handleGoalUpdate(goal.id, 'completed', e.target.checked)}
                            icon={<CheckCircle />}
                            checkedIcon={<CheckCircle />}
                          />
                        }
                        label=""
                        sx={{ mt: 0 }}
                      />
                      
                      <Box flex={1}>
                        <Typography variant="body1" gutterBottom>
                          {goal.description}
                        </Typography>
                        
                        <Box display="flex" gap={1} mb={2}>
                          <Chip 
                            label={goal.priority} 
                            size="small" 
                            color={
                              goal.priority === 'High' ? 'error' : 
                              goal.priority === 'Medium' ? 'warning' : 
                              'default'
                            }
                            variant="outlined"
                          />
                          <Chip 
                            label={`${goal.estimatedHours}h estimated`} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={4}>
                            <TextField
                              fullWidth
                              label="Hours worked today"
                              type="number"
                              size="small"
                              value={update.hoursWorked}
                              onChange={(e) => handleGoalUpdate(goal.id, 'hoursWorked', e.target.value)}
                              inputProps={{ min: 0, step: 0.25 }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={8}>
                            <TextField
                              fullWidth
                              label="Quick notes (optional)"
                              size="small"
                              value={update.notes}
                              onChange={(e) => handleGoalUpdate(goal.id, 'notes', e.target.value)}
                              placeholder="What did you accomplish?"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

          {/* Today's Focus */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              🎯 Today's Focus (Select 1-3 goals)
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Choose the goals you want to prioritize today
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {activeSprint.goals.map((goal) => (
                <Chip
                  key={goal.id}
                  label={goal.description}
                  clickable
                  color={focusGoals.includes(goal.id) ? "primary" : "default"}
                  variant={focusGoals.includes(goal.id) ? "filled" : "outlined"}
                  onClick={() => handleFocusGoalToggle(goal.id)}
                  disabled={!focusGoals.includes(goal.id) && focusGoals.length >= 3}
                />
              ))}
            </Box>

            <Typography variant="caption" color="text.secondary">
              Selected: {focusGoals.length}/3 goals
            </Typography>
          </Grid>

          {/* Daily Plan */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              📝 Today's Plan
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="What's your plan for today?"
              value={dailyPlan}
              onChange={(e) => setDailyPlan(e.target.value)}
              placeholder="Briefly describe what you want to accomplish today..."
            />
          </Grid>

          {/* Summary */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Today's Summary
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Hours Today
                    </Typography>
                    <Typography variant="h6">
                      {getTotalHoursToday().toFixed(1)}h
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Completed Goals
                    </Typography>
                    <Typography variant="h6">
                      {goalUpdates.filter(u => u.completed).length}/{goalUpdates.length}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Focus Goals
                    </Typography>
                    <Typography variant="h6">
                      {focusGoals.length}/3
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Sprint Progress
                    </Typography>
                    <Typography variant="h6">
                      {progress.goalCompletionRate.toFixed(0)}%
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={handleSaveCheckin}
              >
                Save Daily Update
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DailyUpdate;
