import React, { useState } from "react";
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
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Alert,
  LinearProgress,
} from "@mui/material";
import { CheckCircle, Cancel, Warning, Star, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSprintManager } from "../hooks/useSprintManager";
import dayjs from "dayjs";

const SprintReview = () => {
  const navigate = useNavigate();
  const { activeSprint, completeSprint, getSprintProgress } =
    useSprintManager();

  const [goalStatuses, setGoalStatuses] = useState({});
  const [reflections, setReflections] = useState({
    wentWell: "",
    challenges: "",
    improvements: "",
  });
  const [sprintRating, setSprintRating] = useState(0);

  if (!activeSprint) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          No active sprint found. Please create a sprint first.
          <Button onClick={() => navigate("/sprint/new")} sx={{ ml: 2 }}>
            Create Sprint
          </Button>
        </Alert>
      </Container>
    );
  }

  const progress = getSprintProgress();
  const endDate = dayjs(activeSprint.endDate);
  const today = dayjs();
  const isSprintCompleted =
    today.isAfter(endDate) || today.isSame(endDate, "day");

  const handleGoalStatusChange = (goalId, status) => {
    setGoalStatuses((prev) => ({
      ...prev,
      [goalId]: status,
    }));
  };

  const handleReflectionChange = (field, value) => {
    setReflections((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompleteSprint = () => {
    // Update goals with final status
    const updatedGoals = activeSprint.goals.map((goal) => ({
      ...goal,
      finalStatus: goalStatuses[goal.id] || "not-done",
    }));

    const completedData = {
      goals: updatedGoals,
      reflections,
      rating: sprintRating,
      finalCompletionRate:
        (Object.values(goalStatuses).filter((s) => s === "completed").length /
          activeSprint.goals.length) *
        100,
    };

    completeSprint(completedData);
    navigate("/history");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle color="success" />;
      case "partial":
        return <Warning color="warning" />;
      case "not-done":
        return <Cancel color="error" />;
      default:
        return <Cancel color="disabled" />;
    }
  };

  const getTotalEstimatedHours = () => {
    return activeSprint.goals.reduce(
      (sum, goal) => sum + goal.estimatedHours,
      0
    );
  };

  const getTotalActualHours = () => {
    return activeSprint.goals.reduce(
      (sum, goal) => sum + (goal.actualHours || 0),
      0
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sprint Review 🏁
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          {activeSprint.name}
        </Typography>

        {!isSprintCompleted && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Your sprint isn't scheduled to end until{" "}
            {endDate.format("MMMM D, YYYY")}, but you can complete it early if
            needed.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Sprint Summary */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Sprint Summary
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="h6">
                      {progress.totalDays} days
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Goals Completed
                    </Typography>
                    <Typography variant="h6">
                      {progress.completedGoals}/{progress.totalGoals}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Hours
                    </Typography>
                    <Typography variant="h6">
                      {getTotalEstimatedHours()}h
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Actual Hours
                    </Typography>
                    <Typography variant="h6">
                      {getTotalActualHours().toFixed(1)}h
                    </Typography>
                  </Grid>
                </Grid>

                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    Overall Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress.goalCompletionRate}
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {progress.goalCompletionRate.toFixed(0)}% completion rate
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Review Goals */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              📋 Review Goals
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Mark the final status of each goal
            </Typography>

            {activeSprint.goals.map((goal) => (
              <Card key={goal.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Box>{getStatusIcon(goalStatuses[goal.id])}</Box>

                    <Box flex={1}>
                      <Typography variant="body1" gutterBottom>
                        {goal.description}
                      </Typography>

                      <Box display="flex" gap={1} mb={2}>
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
                        <Chip
                          label={`${goal.estimatedHours}h estimated`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`${(goal.actualHours || 0).toFixed(
                            1
                          )}h actual`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>

                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          value={goalStatuses[goal.id] || ""}
                          onChange={(e) =>
                            handleGoalStatusChange(goal.id, e.target.value)
                          }
                        >
                          <FormControlLabel
                            value="completed"
                            control={<Radio />}
                            label={
                              <Box display="flex" alignItems="center" gap={1}>
                                <CheckCircle color="success" fontSize="small" />
                                Completed
                              </Box>
                            }
                          />
                          <FormControlLabel
                            value="partial"
                            control={<Radio />}
                            label={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Warning color="warning" fontSize="small" />
                                Partially Done
                              </Box>
                            }
                          />
                          <FormControlLabel
                            value="not-done"
                            control={<Radio />}
                            label={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Cancel color="error" fontSize="small" />
                                Not Done
                              </Box>
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Reflection Questions */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              🤔 Sprint Reflection
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="What went well during this sprint?"
              value={reflections.wentWell}
              onChange={(e) =>
                handleReflectionChange("wentWell", e.target.value)
              }
              placeholder="Describe what you accomplished successfully, what strategies worked, what you're proud of..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="What was challenging?"
              value={reflections.challenges}
              onChange={(e) =>
                handleReflectionChange("challenges", e.target.value)
              }
              placeholder="What obstacles did you face? What was harder than expected?"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="What would you do differently next time?"
              value={reflections.improvements}
              onChange={(e) =>
                handleReflectionChange("improvements", e.target.value)
              }
              placeholder="What lessons did you learn? How can you improve your planning or execution?"
            />
          </Grid>

          {/* Sprint Rating */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⭐ Rate Your Sprint
                </Typography>

                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body1">Overall satisfaction:</Typography>
                  <Rating
                    value={sprintRating}
                    onChange={(event, newValue) => setSprintRating(newValue)}
                    size="large"
                    icon={<Star fontSize="inherit" />}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {sprintRating > 0 && `${sprintRating}/5`}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Complete Sprint Button */}
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <Button variant="outlined" onClick={() => navigate("/")}>
                Back to Dashboard
              </Button>

              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={handleCompleteSprint}
                disabled={
                  Object.keys(goalStatuses).length !==
                    activeSprint.goals.length || sprintRating === 0
                }
                color="success"
              >
                Complete Sprint
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SprintReview;
