import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider } from '../AuthContext';
import { useAuth } from '../../hooks/useAuth';
import * as authUtils from '../../utils/auth';
import api from '../../services/api';

// Mock the auth utilities
vi.mock('../../utils/auth', () => ({
  isAuthenticated: vi.fn(),
  getUserData: vi.fn(),
  getSectorData: vi.fn(),
  setSectorData: vi.fn(),
  logout: vi.fn(),
}));

// Mock the API
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
  }
}));

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with null user and sector when not authenticated', async () => {
    authUtils.isAuthenticated.mockReturnValue(false);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.sector).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it('should load user and sector data from storage when authenticated', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockSector = { code: 'BANKING', routePath: '/banking' };

    authUtils.isAuthenticated.mockReturnValue(true);
    authUtils.getUserData.mockReturnValue(mockUser);
    authUtils.getSectorData.mockReturnValue(mockSector);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.sector).toEqual(mockSector);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('should update user and sector on login', async () => {
    authUtils.isAuthenticated.mockReturnValue(false);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const loginData = {
      user: { id: 1, username: 'testuser' },
      sector: { code: 'HEALTHCARE', routePath: '/healthcare' }
    };

    await waitFor(() => {
      result.current.login(loginData);
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(loginData.user);
      expect(result.current.sector).toEqual(loginData.sector);
    });
  });

  it('should detect sector from API', async () => {
    authUtils.isAuthenticated.mockReturnValue(true);
    authUtils.getUserData.mockReturnValue({ id: 1, username: 'testuser' });
    authUtils.getSectorData.mockReturnValue(null);

    const mockSectorData = { code: 'BANKING', routePath: '/banking' };
    api.get.mockResolvedValue({ data: { sector: mockSectorData } });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toBeTruthy();
    });

    const detectedSector = await result.current.detectSector();

    expect(api.get).toHaveBeenCalledWith('/auth/sector');
    expect(detectedSector).toEqual(mockSectorData);
    expect(authUtils.setSectorData).toHaveBeenCalledWith(mockSectorData);
  });

  it('should handle sector detection failure', async () => {
    authUtils.isAuthenticated.mockReturnValue(true);
    authUtils.getUserData.mockReturnValue({ id: 1, username: 'testuser' });
    authUtils.getSectorData.mockReturnValue(null);

    api.get.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toBeTruthy();
    });

    const detectedSector = await result.current.detectSector();

    expect(detectedSector).toBeNull();
  });

  it('should clear user and sector on logout', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockSector = { code: 'BANKING', routePath: '/banking' };

    authUtils.isAuthenticated.mockReturnValue(true);
    authUtils.getUserData.mockReturnValue(mockUser);
    authUtils.getSectorData.mockReturnValue(mockSector);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    result.current.logout();

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.sector).toBeNull();
      expect(authUtils.logout).toHaveBeenCalled();
    });
  });

  describe('Role Helpers', () => {
    it('should correctly evaluate hasRole', async () => {
      authUtils.isAuthenticated.mockReturnValue(true);
      authUtils.getUserData.mockReturnValue({ id: 1, username: 'manager', role: 'MANAGER' });
      
      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
      
      await waitFor(() => {
        expect(result.current.user).toBeTruthy();
      });

      expect(result.current.hasRole('MANAGER')).toBe(true);
      expect(result.current.hasRole('ADMIN')).toBe(false);
      expect(result.current.hasRole('USER')).toBe(false);
    });

    it('should correctly evaluate isAdmin', async () => {
      authUtils.isAuthenticated.mockReturnValue(true);
      authUtils.getUserData.mockReturnValue({ id: 2, username: 'admin', role: 'ADMIN' });
      
      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
      
      await waitFor(() => {
        expect(result.current.user).toBeTruthy();
      });

      expect(result.current.isAdmin()).toBe(true);
      expect(result.current.hasRole('ADMIN')).toBe(true);
    });

    it('isAdmin should return false for non-admins', async () => {
      authUtils.isAuthenticated.mockReturnValue(true);
      authUtils.getUserData.mockReturnValue({ id: 3, username: 'user', role: 'USER' });
      
      const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
      
      await waitFor(() => {
        expect(result.current.user).toBeTruthy();
      });

      expect(result.current.isAdmin()).toBe(false);
    });
  });
});
