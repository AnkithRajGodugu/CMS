import axios from 'axios';
import { getToken, logout } from '../utils/auth';
import { showErrorToast } from '../utils/toast';
import { logApiError, logNetworkError } from '../utils/errorLogger';

// ===============================
// Axios Instance
// ===============================
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8082'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000
});


// ===============================
// REQUEST INTERCEPTOR
// Adds JWT token automatically
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ===============================
// Extract User-Friendly Errors
// ===============================
const extractErrorMessage = (error) => {

  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const fieldErrors = error.response.data.errors
      .map(err => `${err.field}: ${err.message}`)
      .join(', ');

    return `Validation failed: ${fieldErrors}`;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }

  if (error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }

  const status = error.response?.status;

  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred. The resource may already exist.';
    case 500:
      return 'An internal server error occurred. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};


// ===============================
// RESPONSE INTERCEPTOR
// Handles all API errors globally
// ===============================
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // Log errors
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      logNetworkError(error);
    } else {
      logApiError(error, error.config?.url, error.config?.method);
    }

    // Token expired or unauthorized
    if (error.response?.status === 401) {
      logout();
      showErrorToast('Your session has expired. Please log in again.');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Forbidden
    if (error.response?.status === 403) {
      showErrorToast("You don't have permission to perform this action.");
      return Promise.reject(error);
    }

    // Extract readable message
    const errorMessage = extractErrorMessage(error);

    showErrorToast(errorMessage);

    // Attach readable message to error
    error.userMessage = errorMessage;

    return Promise.reject(error);
  }
);


export default api;