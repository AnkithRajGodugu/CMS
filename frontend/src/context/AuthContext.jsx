import React, { useState, useEffect } from 'react';
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
    // Check if user is authenticated on app load
    if (isAuthenticated()) {
      const userData = getUserData();
      const sectorData = getSectorData();
      setUser(userData);
      setSector(sectorData);
    }
    setLoading(false);
  }, []);

  const login = (loginData) => {
    if (loginData.user) {
      setUser(loginData.user);
    }
    if (loginData.sector) {
      setSector(loginData.sector);
    }
  };

  const detectSector = async () => {
    try {
      const response = await api.get('/auth/sector');
      const sectorData = response.data;
      setSector(sectorData);
      setSectorData(sectorData);
      return sectorData;
    } catch (error) {
      console.error('Sector detection failed:', error);
      return null;
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setSector(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      sector, 
      login, 
      logout, 
      detectSector,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};


