import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import { ExpandMore, CheckCircle, Warning, Cancel, Star } from '@mui/icons-material';
import { useSprintManager } from '../hooks/useSprintManager';
import dayjs from 'dayjs';

const History = () => {
  const { completedSprints, loading } = useSprintManager();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (completedSprints.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Sprint History 📚
          </Typography>
          <Alert severity="info">
            No completed sprints yet. Complete your first sprint to see it here!
          </Alert>
        </Paper>
      </Container>
    );
  }

  const getOverallStats = () => {
    const totalSprints = completedSprints.length;
    const totalGoals = completedSprints.reduce((sum, sprint) => sum + sprint.goals.length, 0);
    const completedGoals = completedSprints.reduce((sum, sprint) => {
      return sum + sprint.goals.filter(goal => 
        goal.finalStatus === 'completed' || goal.completed
      ).length;
    }, 0);
    
    const totalEstimatedHours = completedSprints.reduce((sum, sprint) => {
      return sum + sprint.goals.reduce((goalSum, goal) => goalSum + goal.estimatedHours, 0);
    }, 0);
    
    const totalActualHours = completedSprints.reduce((sum, sprint) => {
      return sum + sprint.goals.reduce((goalSum, goal) => goalSum + (goal.actualHours || 0), 0);
    }, 0);

    const averageRating = completedSprints.reduce((sum, sprint) => sum + (sprint.rating || 0), 0) / totalSprints;

    return {
      totalSprints,
      totalGoals,
      completedGoals,
      completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
      totalEstimatedHours,
      totalActualHours,
      averageRating
    };
  };

  const getStatusIcon = (status, completed) => {
    // Handle both new finalStatus and legacy completed fields
    const finalStatus = status || (completed ? 'completed' : 'not-done');
    
    switch (finalStatus) {
      case 'completed':
        return <CheckCircle color="success" fontSize="small" />;
      case 'partial':
        return <Warning color="warning" fontSize="small" />;
      case 'not-done':
        return <Cancel color="error" fontSize="small" />;
      default:
        return <Cancel color="disabled" fontSize="small" />;
    }
  };

  const stats = getOverallStats();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sprint History 📚
      </Typography>

      {/* Overall Statistics */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 Overall Statistics
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6} sm={2}>
            <Typography variant="body2" color="text.secondary">
              Total Sprints
            </Typography>
            <Typography variant="h6">
              {stats.totalSprints}
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={2}>
            <Typography variant="body2" color="text.secondary">
              Goals Completed
            </Typography>
            <Typography variant="h6">
              {stats.completedGoals}/{stats.totalGoals}
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={2}>
            <Typography variant="body2" color="text.secondary">
              Completion Rate
            </Typography>
            <Typography variant="h6">
              {stats.completionRate.toFixed(0)}%
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={2}>
            <Typography variant="body2" color="text.secondary">
              Hours Estimated
            </Typography>
            <Typography variant="h6">
              {stats.totalEstimatedHours}h
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={2}>
            <Typography variant="body2" color="text.secondary">
              Hours Actual
            </Typography>
            <Typography variant="h6">
              {stats.totalActualHours.toFixed(1)}h
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={2}>
            <Typography variant="body2" color="text.secondary">
              Avg Rating
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="h6">
                {stats.averageRating.toFixed(1)}
              </Typography>
              <Star color="warning" fontSize="small" />
            </Box>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Typography variant="body2" gutterBottom>
            Overall Completion Rate
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={stats.completionRate} 
            color="success"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Paper>

      {/* Sprint History */}
      <Typography variant="h6" gutterBottom>
        📋 Sprint History ({completedSprints.length})
      </Typography>

      {completedSprints
        .sort((a, b) => dayjs(b.completedAt).diff(dayjs(a.completedAt)))
        .map((sprint, index) => {
          const completedGoals = sprint.goals.filter(goal => 
            goal.finalStatus === 'completed' || goal.completed
          ).length;
          const completionRate = sprint.goals.length > 0 ? 
            (completedGoals / sprint.goals.length) * 100 : 0;

          return (
            <Accordion key={sprint.id || index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                  <Box>
                    <Typography variant="h6">
                      {sprint.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(sprint.startDate).format('MMM D')} - {dayjs(sprint.endDate).format('MMM D, YYYY')}
                      {' • '}
                      Completed {dayjs(sprint.completedAt).format('MMM D, YYYY')}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={2} mr={2}>
                    <Chip 
                      label={`${completedGoals}/${sprint.goals.length} goals`}
                      color={completionRate >= 80 ? 'success' : completionRate >= 50 ? 'warning' : 'error'}
                      variant="outlined"
                      size="small"
                    />
                    
                    {sprint.rating && (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Star color="warning" fontSize="small" />
                        <Typography variant="body2">
                          {sprint.rating}/5
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* Goals */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Goals ({sprint.goals.length})
                    </Typography>
                    
                    {sprint.goals.map((goal, goalIndex) => (
                      <Box key={goalIndex} display="flex" alignItems="center" gap={1} mb={1}>
                        {getStatusIcon(goal.finalStatus, goal.completed)}
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {goal.description}
                        </Typography>
                        <Chip 
                          label={goal.priority} 
                          size="small" 
                          variant="outlined"
                          color={
                            goal.priority === 'High' ? 'error' : 
                            goal.priority === 'Medium' ? 'warning' : 
                            'default'
                          }
                        />
                      </Box>
                    ))}

                    <Box mt={2}>
                      <Typography variant="body2" gutterBottom>
                        Goal Completion Rate
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={completionRate} 
                        color="success"
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {completionRate.toFixed(0)}% completed
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Reflections */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Sprint Reflection
                    </Typography>
                    
                    {sprint.reflections?.wentWell && (
                      <Box mb={2}>
                        <Typography variant="body2" color="success.main" gutterBottom>
                          ✅ What went well:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {sprint.reflections.wentWell}
                        </Typography>
                      </Box>
                    )}
                    
                    {sprint.reflections?.challenges && (
                      <Box mb={2}>
                        <Typography variant="body2" color="warning.main" gutterBottom>
                          ⚠️ Challenges:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {sprint.reflections.challenges}
                        </Typography>
                      </Box>
                    )}
                    
                    {sprint.reflections?.improvements && (
                      <Box mb={2}>
                        <Typography variant="body2" color="info.main" gutterBottom>
                          💡 Improvements:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {sprint.reflections.improvements}
                        </Typography>
                      </Box>
                    )}

                    {/* Stats */}
                    <Box mt={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Sprint Stats
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Estimated Hours
                          </Typography>
                          <Typography variant="body2">
                            {sprint.goals.reduce((sum, goal) => sum + goal.estimatedHours, 0)}h
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Actual Hours
                          </Typography>
                          <Typography variant="body2">
                            {sprint.goals.reduce((sum, goal) => sum + (goal.actualHours || 0), 0).toFixed(1)}h
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </Container>
  );
};

export default History;
