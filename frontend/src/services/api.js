import axios from 'axios';
import { getToken, logout } from '../utils/auth';
import { showErrorToast } from '../utils/toast';
import { logApiError, logNetworkError } from '../utils/errorLogger';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Extract user-friendly error message from error response
 */
const extractErrorMessage = (error) => {
  // Check for validation errors
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const fieldErrors = error.response.data.errors
      .map(err => `${err.field}: ${err.message}`)
      .join(', ');
    return `Validation failed: ${fieldErrors}`;
  }
  
  // Check for standard error response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for string error response
  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }
  
  // Network errors
  if (error.message === 'Network Error') {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Timeout errors
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }
  
  // Default error message based on status code
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



// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error with appropriate logger
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      logNetworkError(error);
    } else {
      logApiError(error, error.config?.url, error.config?.method);
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      logout();
      window.location.href = '/login';
      showErrorToast('Your session has expired. Please log in again.');
      return Promise.reject(error);
    }
    
    // Extract and show user-friendly error message
    const errorMessage = extractErrorMessage(error);
    showErrorToast(errorMessage);
    
    // Attach user-friendly message to error object
    error.userMessage = errorMessage;
    
    return Promise.reject(error);
  }
);

export default api;