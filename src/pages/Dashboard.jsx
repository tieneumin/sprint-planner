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
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Add,
  CheckCircle,
  Assignment,
  TrendingUp,
  Timer,
  Flag,
  CalendarToday,
  PlayCircleFilled,
} from "@mui/icons-material";
import { useSprintManager } from "../hooks/useSprintManager";
import dayjs from "dayjs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { activeSprint, loading, getSprintProgress, getTodayCheckin } =
    useSprintManager();

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  if (!activeSprint) {
    return (
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box textAlign="center" py={8}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 4,
              bgcolor: "primary.main",
              fontSize: "3rem",
            }}
          >
            🚀
          </Avatar>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Welcome to Sprint Planner
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, color: "text.secondary", maxWidth: 600, mx: "auto" }}
          >
            Transform your academic productivity with weekly sprints. Set clear
            goals, track daily progress, and build better study habits.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => navigate("/sprint/new")}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: "1.1rem",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            Create Your First Sprint
          </Button>
        </Box>
      </Container>
    );
  }

  const progress = getSprintProgress();
  const todayCheckin = getTodayCheckin();
  const hasCheckedInToday = !!todayCheckin;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Good{" "}
          {dayjs().hour() < 12
            ? "morning"
            : dayjs().hour() < 17
            ? "afternoon"
            : "evening"}
          ! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Let's make progress on your goals today
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Sprint Overview Card */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                display="flex"
                justifyContent="between"
                alignItems="flex-start"
                mb={3}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {activeSprint.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <CalendarToday fontSize="small" />
                      <Typography variant="body1">
                        {dayjs(activeSprint.startDate).format("MMM D")} -{" "}
                        {dayjs(activeSprint.endDate).format("MMM D, YYYY")}
                      </Typography>
                    </Box>
                    <Chip
                      label={`Day ${progress.daysPassed} of ${progress.totalDays}`}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="between" mb={1}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Sprint Progress
                      </Typography>
                      <Typography variant="body2">
                        {(
                          (progress.daysPassed / progress.totalDays) *
                          100
                        ).toFixed(0)}
                        %
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(progress.daysPassed / progress.totalDays) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(255,255,255,0.2)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "white",
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Box display="flex" justifyContent="between" mb={1}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Goal Completion
                      </Typography>
                      <Typography variant="body2">
                        {progress.completedGoals}/{progress.totalGoals}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress.goalCompletionRate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(255,255,255,0.2)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "#10b981",
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "success.main",
                  mx: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <CheckCircle sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {progress.completedGoals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Goals Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "warning.main",
                  mx: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <Timer sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {progress.daysRemaining}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days Remaining
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "info.main",
                  mx: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <Flag sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {progress.totalGoals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Goals
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "secondary.main",
                  mx: "auto",
                  mb: 2,
                  width: 56,
                  height: 56,
                }}
              >
                <TrendingUp sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {progress.goalCompletionRate.toFixed(0)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completion Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3 }}
              >
                Quick Actions
              </Typography>

              <Stack spacing={2}>
                <Button
                  variant={hasCheckedInToday ? "outlined" : "contained"}
                  startIcon={<CheckCircle />}
                  onClick={() => navigate("/daily")}
                  fullWidth
                  size="large"
                  color={hasCheckedInToday ? "success" : "primary"}
                  sx={{
                    py: 1.5,
                    justifyContent: "flex-start",
                    borderRadius: 2,
                  }}
                >
                  {hasCheckedInToday
                    ? "✅ Update Daily Check-in"
                    : "📝 Daily Check-in"}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  onClick={() => navigate("/sprint/review")}
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    justifyContent: "flex-start",
                    borderRadius: 2,
                  }}
                >
                  🏁 Sprint Review
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<PlayCircleFilled />}
                  onClick={() => navigate("/sprint/new")}
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    justifyContent: "flex-start",
                    borderRadius: 2,
                  }}
                >
                  🚀 New Sprint
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Goals Overview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3 }}
              >
                Sprint Goals
              </Typography>

              <Stack spacing={2}>
                {activeSprint.goals.slice(0, 5).map((goal, index) => (
                  <Box key={index}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <CheckCircle
                        color={goal.completed ? "success" : "disabled"}
                        fontSize="small"
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          textDecoration: goal.completed
                            ? "line-through"
                            : "none",
                          opacity: goal.completed ? 0.7 : 1,
                          fontWeight: 500,
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
                    {index < Math.min(activeSprint.goals.length, 5) - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}

                {activeSprint.goals.length > 5 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", pt: 1 }}
                  >
                    +{activeSprint.goals.length - 5} more goals
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Status */}
        <Grid item xs={12}>
          {hasCheckedInToday ? (
            <Alert
              severity="success"
              sx={{
                borderRadius: 2,
                "& .MuiAlert-message": {
                  fontSize: "1rem",
                  fontWeight: 500,
                },
              }}
            >
              🎉 Excellent! You've checked in today. Keep up the momentum!
            </Alert>
          ) : (
            <Alert
              severity="info"
              sx={{
                borderRadius: 2,
                "& .MuiAlert-message": {
                  fontSize: "1rem",
                  fontWeight: 500,
                },
              }}
            >
              ⏰ Don't forget your daily check-in to track your progress and
              stay on target
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
