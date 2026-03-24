import api from './api';

/**
 * Get the current authenticated user's profile details
 */
export const getMe = () => {
  return api.get('/users/me');
};

/**
 * Update the current user's profile details
 * @param {Object} data - The updated profile data
 */
export const updateProfile = (data) => {
  return api.put('/users/me', data);
};

/**
 * Change the current user's password
 * @param {Object} data - Object containing oldPassword and newPassword
 */
export const changePassword = (data) => {
  return api.post('/users/me/password', data);
};
