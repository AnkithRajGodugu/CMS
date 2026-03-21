import React, { useState, useEffect, useCallback } from 'react';
import {
  isAuthenticated,
  getUserData,
  getSectorData,
  setSectorData,
  logout as authLogout
} from '../utils/auth';
import { AuthContext } from './auth';
import api from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sector, setSector] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    if (isAuthenticated()) {
      const userData = getUserData();
      const sectorData = getSectorData();

      setUser(userData || null);
      setSector(sectorData || null);
    }
    setLoading(false);
  };

  /**
   * Called after successful login
   */
  const login = useCallback((loginData) => {
    if (loginData?.user) {
      setUser(loginData.user);
    }

    if (loginData?.sector) {
      setSector(loginData.sector);
      setSectorData(loginData.sector);
    }
  }, []);

  /**
   * Detect sector from backend (if needed)
   */
  const detectSector = async () => {
    try {
      const response = await api.get('/auth/sector');
      const sectorData = response.data?.sector || null;

      if (sectorData) {
        setSector(sectorData);
        setSectorData(sectorData);
      }

      return sectorData;
    } catch (error) {
      console.error('Sector detection failed:', error);
      return null;
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    authLogout();
    setUser(null);
    setSector(null);
  };

  /**
   * Role Helpers (Phase 1 addition)
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => hasRole('ADMIN');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        sector,
        login,
        logout,
        detectSector,
        hasRole,
        isAdmin,
        isAuthenticated: isAuthenticated()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};  