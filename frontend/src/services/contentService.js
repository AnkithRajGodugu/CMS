import api from './api';

/**
 * Get current user's content dashboard statistics
 */
export const getUserContentDashboardStats = () => {
  return api.get('/content/my-dashboard');
};

/**
 * Get the current user's assigned projects
 */
export const getMyProjects = (page = 0, size = 20) => {
  return api.get(`/content/my-projects?page=${page}&size=${size}`);
};

/**
 * Get the current user's tasks
 */
export const getMyTasks = () => {
  return api.get('/content/tasks/me');
};

/**
 * Update the status of a specific task
 * @param {string|number} taskId - The ID of the task
 * @param {string} status - The new status (e.g., 'IN_PROGRESS', 'DONE')
 */
export const updateTaskStatus = (taskId, status) => {
  return api.put(`/content/tasks/${taskId}/status`, { status });
};

/**
 * Get the current user's content calendar events
 */
export const getMyCalendar = () => {
  return api.get('/content/calendar/me');
};
