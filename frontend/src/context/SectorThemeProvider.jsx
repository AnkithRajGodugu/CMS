import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  SECTOR_THEMES, 
  DEFAULT_SECTOR, 
  getTheme, 
  applyThemeColors,
  getDaisyTheme,
  isSectorValid,
  ANIMATION_DURATIONS,
  getAllSectors
} from '../config/themes';
import { useAuth } from '../hooks/useAuth';

const SectorThemeContext = createContext(null);

/**
 * Hook to access sector theme context
 * @returns {Object} Theme context value
 */
export const useSectorTheme = () => {
  const context = useContext(SectorThemeContext);
  if (!context) {
    console.warn('useSectorTheme must be used within a SectorThemeProvider');
    return {
      currentSector: DEFAULT_SECTOR,
      currentTheme: SECTOR_THEMES[DEFAULT_SECTOR],
      isTransitioning: false,
      changeSector: () => {},
      getThemeForSector: getTheme,
      applyTheme: () => {}
    };
  }
  return context;
};

/**
 * SectorThemeProvider component
 * Provides sector-based theming with automatic detection from AuthContext
 * and dynamic theme switching with smooth transitions
 */
export const SectorThemeProvider = ({ children }) => {
  const { sector } = useAuth();
  const [currentSector, setCurrentSector] = useState(DEFAULT_SECTOR);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Get current theme based on sector
  const currentTheme = getTheme(currentSector);

  /**
   * Apply theme to document
   */
  const applyTheme = useCallback((sectorCode, darkMode) => {
    if (typeof document === 'undefined') return;

    const theme = getTheme(sectorCode);
    const root = document.documentElement;

    try {
      // Apply CSS custom properties
      applyThemeColors(theme);

      // Update DaisyUI data-theme attribute
      const daisyTheme = darkMode ? 'dark' : getDaisyTheme(sectorCode);
      root.setAttribute('data-theme', daisyTheme);

      // Add sector class for additional styling
      root.classList.remove(...Object.keys(SECTOR_THEMES).map(s => `sector-${s}`));
      root.classList.add(`sector-${sectorCode}`);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, []);

  /**
   * Change sector with smooth transition
   */
  const changeSector = useCallback((newSector) => {
    if (!newSector || !isSectorValid(newSector)) {
      console.warn(`Invalid sector: ${newSector}`);
      return;
    }

    if (newSector === currentSector || isTransitioning) {
      return;
    }

    setIsTransitioning(true);

    // Add transition class to body
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('theme-transitioning');
    }

    // Apply new theme
    applyTheme(newSector, isDarkMode);
    setCurrentSector(newSector);

    // Remove transition class after animation completes
    const timeoutId = setTimeout(() => {
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.remove('theme-transitioning');
      }
      setIsTransitioning(false);
    }, ANIMATION_DURATIONS.THEME_TRANSITION);

    return () => clearTimeout(timeoutId);
  }, [currentSector, isTransitioning, applyTheme, isDarkMode]);

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('theme-mode', next ? 'dark' : 'light');
      applyTheme(currentSector, next);
      return next;
    });
  }, [currentSector, applyTheme]);

  /**
   * Sync with AuthContext sector
   */
  useEffect(() => {
    if (sector && sector.code) {
      const normalizedCode = sector.code.toLowerCase();
      if (isSectorValid(normalizedCode)) {
        changeSector(normalizedCode);
      }
    }
  }, [sector, changeSector]);

  /**
   * Apply initial theme on mount
   */
  useEffect(() => {
    applyTheme(currentSector, isDarkMode);
  }, [currentSector, isDarkMode, applyTheme]);

  const value = {
    currentSector,
    currentTheme,
    isTransitioning,
    changeSector,
    getAllSectors,
    getThemeForSector: getTheme,
    applyTheme,
    isDarkMode,
    toggleDarkMode
  };

  return (
    <SectorThemeContext.Provider value={value}>
      {children}
    </SectorThemeContext.Provider>
  );
};

// Backward-compat alias — Navbar and other files import `useTheme` from here
export const useTheme = useSectorTheme;

export default SectorThemeProvider;
