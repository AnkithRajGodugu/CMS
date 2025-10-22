import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  SECTOR_THEMES, 
  DEFAULT_SECTOR, 
  getTheme, 
  applyThemeColors,
  getDaisyTheme,
  isSectorValid,
  ANIMATION_DURATIONS
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

  // Get current theme based on sector
  const currentTheme = getTheme(currentSector);

  /**
   * Apply theme to document
   */
  const applyTheme = useCallback((sectorCode) => {
    if (typeof document === 'undefined') return;

    const theme = getTheme(sectorCode);
    const root = document.documentElement;

    try {
      // Apply CSS custom properties
      applyThemeColors(theme);

      // Update DaisyUI data-theme attribute
      const daisyTheme = getDaisyTheme(sectorCode);
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
    applyTheme(newSector);
    setCurrentSector(newSector);

    // Remove transition class after animation completes
    const timeoutId = setTimeout(() => {
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.remove('theme-transitioning');
      }
      setIsTransitioning(false);
    }, ANIMATION_DURATIONS.THEME_TRANSITION);

    return () => clearTimeout(timeoutId);
  }, [currentSector, isTransitioning, applyTheme]);

  /**
   * Sync with AuthContext sector
   */
  useEffect(() => {
    if (sector && sector.code && isSectorValid(sector.code)) {
      changeSector(sector.code);
    }
  }, [sector, changeSector]);

  /**
   * Apply initial theme on mount
   */
  useEffect(() => {
    applyTheme(currentSector);
  }, [currentSector, applyTheme]);

  const value = {
    currentSector,
    currentTheme,
    isTransitioning,
    changeSector,
    getThemeForSector: getTheme,
    applyTheme
  };

  return (
    <SectorThemeContext.Provider value={value}>
      {children}
    </SectorThemeContext.Provider>
  );
};

export default SectorThemeProvider;
