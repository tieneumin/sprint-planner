// Local Storage utility functions for Sprint Planner

const STORAGE_KEYS = {
  ACTIVE_SPRINT: 'sprintPlanner_activeSprint',
  COMPLETED_SPRINTS: 'sprintPlanner_completedSprints',
  DAILY_CHECKINS: 'sprintPlanner_dailyCheckins'
};

// Active Sprint Management
export const getActiveSprint = () => {
  try {
    const sprint = localStorage.getItem(STORAGE_KEYS.ACTIVE_SPRINT);
    return sprint ? JSON.parse(sprint) : null;
  } catch (error) {
    console.error('Error getting active sprint:', error);
    return null;
  }
};

export const setActiveSprint = (sprint) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SPRINT, JSON.stringify(sprint));
  } catch (error) {
    console.error('Error setting active sprint:', error);
  }
};

export const clearActiveSprint = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SPRINT);
  } catch (error) {
    console.error('Error clearing active sprint:', error);
  }
};

// Completed Sprints Management
export const getCompletedSprints = () => {
  try {
    const sprints = localStorage.getItem(STORAGE_KEYS.COMPLETED_SPRINTS);
    return sprints ? JSON.parse(sprints) : [];
  } catch (error) {
    console.error('Error getting completed sprints:', error);
    return [];
  }
};

export const addCompletedSprint = (sprint) => {
  try {
    const sprints = getCompletedSprints();
    sprints.push(sprint);
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SPRINTS, JSON.stringify(sprints));
  } catch (error) {
    console.error('Error adding completed sprint:', error);
  }
};

// Daily Check-ins Management
export const getDailyCheckins = () => {
  try {
    const checkins = localStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
    return checkins ? JSON.parse(checkins) : {};
  } catch (error) {
    console.error('Error getting daily checkins:', error);
    return {};
  }
};

export const saveDailyCheckin = (sprintId, date, checkin) => {
  try {
    const checkins = getDailyCheckins();
    if (!checkins[sprintId]) {
      checkins[sprintId] = {};
    }
    checkins[sprintId][date] = checkin;
    localStorage.setItem(STORAGE_KEYS.DAILY_CHECKINS, JSON.stringify(checkins));
  } catch (error) {
    console.error('Error saving daily checkin:', error);
  }
};

export const getSprintCheckins = (sprintId) => {
  try {
    const checkins = getDailyCheckins();
    return checkins[sprintId] || {};
  } catch (error) {
    console.error('Error getting sprint checkins:', error);
    return {};
  }
};
