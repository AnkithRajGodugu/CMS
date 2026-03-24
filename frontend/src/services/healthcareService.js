import api from './api';

/**
 * Get the current user's patient records
 */
export const getMyPatientRecord = () => {
  return api.get('/healthcare/patient/records/me');
};

/**
 * Get the current user's healthcare dashboard statistics
 */
export const getUserHealthcareDashboardStats = () => {
  return api.get('/sectors/healthcare/my-dashboard');
};

/**
 * Get the current user's appointments
 */
export const getMyAppointments = (page = 0, size = 20) => {
  return api.get(`/sectors/healthcare/my-appointments?page=${page}&size=${size}`);
};

/**
 * Book a new healthcare appointment
 * @param {Object} data - Appointment details (date, reason, etc.)
 */
export const bookAppointment = (data) => {
  return api.post('/healthcare/appointments', data);
};

/**
 * Get the current user's insurance policy and claims details
 */
export const getMyInsurance = () => {
  return api.get('/healthcare/insurance/me');
};
