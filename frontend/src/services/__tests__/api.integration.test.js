import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import api from '../api';
import * as authUtils from '../../utils/auth';
import * as toast from '../../utils/toast';

// Mock the auth utilities
vi.mock('../../utils/auth', () => ({
  getToken: vi.fn(),
  logout: vi.fn(),
}));

// Mock toast utilities
vi.mock('../../utils/toast', () => ({
  showErrorToast: vi.fn(),
}));

// Mock error logger
vi.mock('../../utils/errorLogger', () => ({
  logApiError: vi.fn(),
  logNetworkError: vi.fn(),
}));

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should add authorization header when token exists', () => {
    const mockToken = 'test-jwt-token';
    authUtils.getToken.mockReturnValue(mockToken);

    const config = { headers: {} };
    const result = api.interceptors.request.handlers[0].fulfilled(config);

    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('should not add authorization header when token does not exist', () => {
    authUtils.getToken.mockReturnValue(null);

    const config = { headers: {} };
    const result = api.interceptors.request.handlers[0].fulfilled(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should handle 401 unauthorized errors', async () => {
    const error = {
      response: { status: 401 },
      config: { url: '/test', method: 'GET' }
    };

    try {
      await api.interceptors.response.handlers[0].rejected(error);
    } catch (e) {
      expect(authUtils.logout).toHaveBeenCalled();
      expect(toast.showErrorToast).toHaveBeenCalledWith(
        'Your session has expired. Please log in again.'
      );
    }
  });

  it('should extract error message from response data', async () => {
    const error = {
      response: {
        status: 400,
        data: { message: 'Invalid input data' }
      },
      config: { url: '/test', method: 'POST' }
    };

    try {
      await api.interceptors.response.handlers[0].rejected(error);
    } catch (e) {
      expect(toast.showErrorToast).toHaveBeenCalledWith('Invalid input data');
      expect(e.userMessage).toBe('Invalid input data');
    }
  });

  it('should handle validation errors', async () => {
    const error = {
      response: {
        status: 400,
        data: {
          errors: [
            { field: 'email', message: 'Invalid email format' },
            { field: 'password', message: 'Password too short' }
          ]
        }
      },
      config: { url: '/auth/register', method: 'POST' }
    };

    try {
      await api.interceptors.response.handlers[0].rejected(error);
    } catch (e) {
      expect(toast.showErrorToast).toHaveBeenCalled();
      const errorMessage = toast.showErrorToast.mock.calls[0][0];
      expect(errorMessage).toContain('Validation failed');
      expect(errorMessage).toContain('email');
      expect(errorMessage).toContain('password');
    }
  });

  it('should handle network errors', async () => {
    const error = {
      message: 'Network Error',
      config: { url: '/test', method: 'GET' }
    };

    try {
      await api.interceptors.response.handlers[0].rejected(error);
    } catch (e) {
      expect(toast.showErrorToast).toHaveBeenCalledWith(
        'Unable to connect to the server. Please check your internet connection.'
      );
    }
  });

  it('should handle 403 forbidden errors', async () => {
    const error = {
      response: { status: 403 },
      config: { url: '/admin/users', method: 'GET' }
    };

    try {
      await api.interceptors.response.handlers[0].rejected(error);
    } catch (e) {
      expect(toast.showErrorToast).toHaveBeenCalledWith(
        'You do not have permission to perform this action.'
      );
    }
  });

  it('should handle 404 not found errors', async () => {
    const error = {
      response: { status: 404 },
      config: { url: '/users/999', method: 'GET' }
    };

    try {
      await api.interceptors.response.handlers[0].rejected(error);
    } catch (e) {
      expect(toast.showErrorToast).toHaveBeenCalledWith(
        'The requested resource was not found.'
      );
    }
  });

  it('should handle 500 server errors', async () => {
    const error = {
      response: { status: 500 },
      config: { url: '/test', method: 'POST' }
    };

    try {
      await api.interceptors.response.handlers[0].rejected(error);
    } catch (e) {
      expect(toast.showErrorToast).toHaveBeenCalledWith(
        'An internal server error occurred. Please try again later.'
      );
    }
  });
});
