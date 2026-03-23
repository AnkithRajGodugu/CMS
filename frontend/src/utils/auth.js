// Authentication utilities
export const AUTH_TOKEN_KEY = 'cms_auth_token';
export const USER_DATA_KEY = 'cms_user_data';
export const SECTOR_DATA_KEY = 'cms_sector_data';

export const setAuthToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setUserData = (userData) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const getUserData = () => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const setSectorData = (sectorData) => {
  localStorage.setItem(SECTOR_DATA_KEY, JSON.stringify(sectorData));
};

export const getSectorData = () => {
  const sectorData = localStorage.getItem(SECTOR_DATA_KEY);
  return sectorData ? JSON.parse(sectorData) : null;
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(SECTOR_DATA_KEY);
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Fix Base64Url to standard Base64
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    return payload.exp * 1000 > Date.now();
  } catch (err) {
    console.error('JWT Decode Error:', err);
    return false;
  }
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const login = async (username, password) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8082'}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || 'Login failed');
    }

    const data = await response.json();
    
    if (data.token) {
      setAuthToken(data.token);
      
      // Store user data from response
      if (data.user) {
        setUserData(data.user);
      }
      
      // Store sector data from response
      if (data.sector) {
        setSectorData(data.sector);
      }
      
      return {
        user: data.user,
        sector: data.sector
      };
    } else {
      throw new Error('No token received');
    }
  } catch (loginError) {
    console.error('Login error:', loginError);
    throw loginError;
  }
};

export const logout = () => {
  clearAuth();
};

export const getToken = () => {
  return getAuthToken();
};