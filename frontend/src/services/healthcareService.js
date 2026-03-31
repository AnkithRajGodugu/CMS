import api from './api';

/** User - healthcare dashboard stats */
export const getUserHealthcareDashboardStats = () =>
  api.get('/sectors/healthcare/my-dashboard');

/** User - my appointments (paginated) */
export const getMyAppointments = (page = 0, size = 20) =>
  api.get(`/sectors/healthcare/my-appointments?page=${page}&size=${size}`);

/** User - my health records */
export const getMyHealthRecords = () =>
  api.get('/sectors/healthcare/my-records');

/** User - my insurance claims */
export const getMyInsurance = () =>
  api.get('/sectors/healthcare/insurance/my-claims');

/** Admin - recent activity */
export const getRecentHealthcareActivity = () =>
  api.get('/sectors/healthcare/activity/recent');

/** Admin - dashboard stats */
export const getHealthcareAdminStats = () =>
  api.get('/sectors/healthcare/dashboard/stats');

/** Admin - all patients (paginated) */
export const getAllPatients = (page = 0, size = 50) =>
  api.get(`/sectors/healthcare/patients?page=${page}&size=${size}`);

/** Admin - search patients */
export const searchPatients = (query) =>
  api.get(`/sectors/healthcare/patients/search?query=${encodeURIComponent(query)}`);

/** Admin - all appointments (paginated) */
export const getAllAppointments = (page = 0, size = 50) =>
  api.get(`/sectors/healthcare/appointments?page=${page}&size=${size}`);

/** Admin - all insurance claims (with full detail) */
export const getAllInsuranceClaims = () =>
  api.get('/sectors/healthcare/insurance/claims/all');

/** Admin - insurance claims summary stats */
export const getInsuranceClaimStats = () =>
  api.get('/sectors/healthcare/insurance/claims');

/** Admin - all health records across all users */
export const getAllHealthRecords = () =>
  api.get('/sectors/healthcare/records/all');

/** Admin - patient history by ID */
export const getPatientHistory = (patientId) =>
  api.get(`/sectors/healthcare/patients/${patientId}/history`);

/** User - book a new appointment */
export const bookAppointment = (data) =>
  api.post('/sectors/healthcare/appointments', data);

