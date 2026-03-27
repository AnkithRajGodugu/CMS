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
      
      // Robust normalization (handles string or object)
      let normalizedSector = null;
      if (typeof sectorData === 'string') {
        normalizedSector = { code: sectorData.toLowerCase() };
      } else if (sectorData?.code) {
        normalizedSector = {
          ...sectorData,
          code: sectorData.code.toLowerCase()
        };
      }

      setUser(userData || null);
      setSector(normalizedSector);
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
      // Robust normalization (handles string or object)
      let normalizedSector = null;
      if (typeof loginData.sector === 'string') {
        normalizedSector = { code: loginData.sector.toLowerCase() };
      } else if (loginData.sector?.code) {
        normalizedSector = {
          ...loginData.sector,
          code: loginData.sector.code.toLowerCase()
        };
      }
      
      if (normalizedSector) {
        setSector(normalizedSector);
        setSectorData(normalizedSector);
      }
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
        // Robust normalization (handles string or object)
        let normalizedSector = null;
        if (typeof sectorData === 'string') {
          normalizedSector = { code: sectorData.toLowerCase() };
        } else if (sectorData?.code) {
          normalizedSector = {
            ...sectorData,
            code: sectorData.code.toLowerCase()
          };
        }

        if (normalizedSector) {
          setSector(normalizedSector);
          setSectorData(normalizedSector);
        }
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
    window.location.href = '/login';
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