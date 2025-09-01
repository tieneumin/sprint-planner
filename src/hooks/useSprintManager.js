import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  getActiveSprint,
  setActiveSprint,
  clearActiveSprint,
  getCompletedSprints,
  addCompletedSprint,
  saveDailyCheckin,
  getSprintCheckins,
} from "../utils/localStorage";

export const useSprintManager = () => {
  const [activeSprint, setActiveSprintState] = useState(null);
  const [completedSprints, setCompletedSprints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const active = getActiveSprint();
    const completed = getCompletedSprints();

    setActiveSprintState(active);
    setCompletedSprints(completed);
    setLoading(false);
  };

  const createSprint = (sprintData) => {
    const newSprint = {
      id: Date.now().toString(),
      ...sprintData,
      createdAt: dayjs().toISOString(),
      status: "active",
    };

    setActiveSprint(newSprint);
    setActiveSprintState(newSprint);
    return newSprint;
  };

  const updateSprintGoals = (goals) => {
    if (!activeSprint) return;

    const updatedSprint = {
      ...activeSprint,
      goals: goals,
    };

    setActiveSprint(updatedSprint);
    setActiveSprintState(updatedSprint);
  };

  const completeSprint = (sprintData) => {
    if (!activeSprint) return;

    const completedSprint = {
      ...activeSprint,
      ...sprintData,
      completedAt: dayjs().toISOString(),
      status: "completed",
    };

    addCompletedSprint(completedSprint);
    clearActiveSprint();
    setActiveSprintState(null);
    loadData(); // Refresh completed sprints
  };

  const saveDailyUpdate = (date, checkin) => {
    if (!activeSprint) return;

    saveDailyCheckin(activeSprint.id, date, checkin);

    // Update sprint goals with new progress
    if (checkin.goalUpdates) {
      const updatedGoals = activeSprint.goals.map((goal) => {
        const update = checkin.goalUpdates.find((u) => u.goalId === goal.id);
        if (update) {
          return {
            ...goal,
            completed: update.completed,
            actualHours: (goal.actualHours || 0) + (update.hoursWorked || 0),
          };
        }
        return goal;
      });

      updateSprintGoals(updatedGoals);
    }
  };

  const getSprintProgress = () => {
    if (!activeSprint) return null;

    const startDate = dayjs(activeSprint.startDate);
    const endDate = dayjs(activeSprint.endDate);
    const today = dayjs();

    const totalDays = endDate.diff(startDate, "day") + 1;
    const daysPassed = today.diff(startDate, "day") + 1;
    const daysRemaining = endDate.diff(today, "day");

    const completedGoals = activeSprint.goals.filter(
      (goal) => goal.completed
    ).length;
    const totalGoals = activeSprint.goals.length;

    return {
      totalDays,
      daysPassed: Math.max(0, Math.min(daysPassed, totalDays)),
      daysRemaining: Math.max(0, daysRemaining),
      completedGoals,
      totalGoals,
      goalCompletionRate:
        totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
    };
  };

  const getTodayCheckin = () => {
    if (!activeSprint) return null;

    const today = dayjs().format("YYYY-MM-DD");
    const checkins = getSprintCheckins(activeSprint.id);
    return checkins[today] || null;
  };

  return {
    activeSprint,
    completedSprints,
    loading,
    createSprint,
    updateSprintGoals,
    completeSprint,
    saveDailyUpdate,
    getSprintProgress,
    getTodayCheckin,
    refreshData: loadData,
  };
};
