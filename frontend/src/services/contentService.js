import api from './api';

/** User - content dashboard stats */
export const getUserContentDashboardStats = () =>
  api.get('/content/my-dashboard');

/** User - current user's projects */
export const getMyProjects = (page = 0, size = 20) =>
  api.get(`/content/my-projects?page=${page}&size=${size}`);

/** User - current user's tasks (mock — backend not yet implemented) */
export const getMyTasks = () =>
  api.get('/content/tasks/me');

/** User - update task status */
export const updateTaskStatus = (taskId, status) =>
  api.put(`/content/tasks/${taskId}/status`, { status });

/** User - content calendar events */
export const getMyCalendar = () =>
  api.get('/content/calendar/me');

/** Admin - all projects (paginated) */
export const getAllProjects = (page = 0, size = 20) =>
  api.get(`/content/projects?page=${page}&size=${size}`);

/** Admin - all content assets (paginated) */
export const getAllAssets = (page = 0, size = 20) =>
  api.get(`/content/assets?page=${page}&size=${size}`);

/** Admin - content dashboard summary stats */
export const getContentAdminStats = () =>
  api.get('/content/dashboard/stats');

/** Admin - analytics summary */
export const getContentAnalytics = () =>
  api.get('/content/analytics/summary');

/** Admin - content distribution channels */
export const getContentDistribution = () =>
  api.get('/content/distribution');

/** Admin - create a project */
export const createProject = (data) =>
  api.post('/content/projects', data);

/** Admin - create an asset */
export const createAsset = (data) =>
  api.post('/content/assets', data);
