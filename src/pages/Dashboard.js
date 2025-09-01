import React from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add, PlayArrow, CheckCircle, Assignment } from "@mui/icons-material";
import { useSprintManager } from "../hooks/useSprintManager";
import dayjs from "dayjs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { activeSprint, loading, getSprintProgress, getTodayCheckin } =
    useSprintManager();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (!activeSprint) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Sprint Planner! 🚀
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
            Start your weekly productivity sprint by setting clear goals and
            tracking daily progress.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => navigate("/sprint/new")}
          >
            Create New Sprint
          </Button>
        </Paper>
      </Container>
    );
  }

  const progress = getSprintProgress();
  const todayCheckin = getTodayCheckin();
  const hasCheckedInToday = !!todayCheckin;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Sprint Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h4">{activeSprint.name}</Typography>
              <Chip
                label={`Day ${progress.daysPassed} of ${progress.totalDays}`}
                color="primary"
                variant="outlined"
              />
            </Box>

            <Typography variant="body1" color="text.secondary" gutterBottom>
              {dayjs(activeSprint.startDate).format("MMM D")} -{" "}
              {dayjs(activeSprint.endDate).format("MMM D, YYYY")}
            </Typography>

            <Box mt={2} mb={2}>
              <Typography variant="body2" gutterBottom>
                Sprint Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(progress.daysPassed / progress.totalDays) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Box mt={2} mb={2}>
              <Typography variant="body2" gutterBottom>
                Goal Completion ({progress.completedGoals}/{progress.totalGoals}
                )
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress.goalCompletionRate}
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant={hasCheckedInToday ? "outlined" : "contained"}
                  startIcon={<CheckCircle />}
                  onClick={() => navigate("/daily")}
                  fullWidth
                  color={hasCheckedInToday ? "success" : "primary"}
                >
                  {hasCheckedInToday
                    ? "Update Daily Check-in"
                    : "Daily Check-in"}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  onClick={() => navigate("/sprint/review")}
                  fullWidth
                >
                  Sprint Review
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Goals Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sprint Goals
              </Typography>

              <Box display="flex" flexDirection="column" gap={1}>
                {activeSprint.goals.slice(0, 4).map((goal, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1}>
                    <CheckCircle
                      color={goal.completed ? "success" : "disabled"}
                      fontSize="small"
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: goal.completed
                          ? "line-through"
                          : "none",
                        opacity: goal.completed ? 0.7 : 1,
                      }}
                    >
                      {goal.description}
                    </Typography>
                    <Chip
                      label={goal.priority}
                      size="small"
                      color={
                        goal.priority === "High"
                          ? "error"
                          : goal.priority === "Medium"
                          ? "warning"
                          : "default"
                      }
                      variant="outlined"
                    />
                  </Box>
                ))}

                {activeSprint.goals.length > 4 && (
                  <Typography variant="body2" color="text.secondary">
                    +{activeSprint.goals.length - 4} more goals
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Status */}
        <Grid item xs={12}>
          {hasCheckedInToday ? (
            <Alert
              severity="success"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography>
                ✅ You've checked in today! Keep up the great work!
              </Typography>
            </Alert>
          ) : (
            <Alert
              severity="info"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography>
                📝 Don't forget to do your daily check-in to track progress
              </Typography>
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
