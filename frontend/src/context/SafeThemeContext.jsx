import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Theme configuration for each sector
const sectorThemes = {
  banking: {
    name: 'Banking',
    primary: '#1e40af',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    gradient: 'from-blue-600 to-blue-800',
    logo: 'banking',
    description: 'Professional and trustworthy'
  },
  healthcare: {
    name: 'Healthcare',
    primary: '#059669',
    secondary: '#6b7280',
    accent: '#dc2626',
    background: '#f0fdf4',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#d1fae5',
    gradient: 'from-emerald-500 to-emerald-700',
    logo: 'healthcare',
    description: 'Clean and caring'
  },
  logistics: {
    name: 'Logistics',
    primary: '#ea580c',
    secondary: '#78716c',
    accent: '#eab308',
    background: '#fffbeb',
    surface: '#ffffff',
    text: '#292524',
    textSecondary: '#78716c',
    border: '#fed7aa',
    gradient: 'from-orange-500 to-orange-700',
    logo: 'logistics',
    description: 'Dynamic and efficient'
  },
  content: {
    name: 'Content Creation',
    primary: '#7c3aed',
    secondary: '#6b7280',
    accent: '#ec4899',
    background: '#faf5ff',
    surface: '#ffffff',
    text: '#374151',
    textSecondary: '#6b7280',
    border: '#e9d5ff',
    gradient: 'from-violet-500 to-pink-500',
    logo: 'content',
    description: 'Creative and vibrant'
  }
};

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return a fallback instead of throwing an error
    console.warn('useTheme must be used within a ThemeProvider. Using fallback theme.');
    return {
      currentSector: 'banking',
      currentTheme: sectorThemes.banking,
      isTransitioning: false,
      changeSector: () => {},
      getTheme: (sector) => sectorThemes[sector] || sectorThemes.banking,
      getAllSectors: () => Object.keys(sectorThemes),
      sectorThemes
    };
  }
  return context;
};

export const SafeThemeProvider = ({ children }) => {
  const [currentSector, setCurrentSector] = useState('banking');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState(null);

  // Get current theme based on sector
  const currentTheme = sectorThemes[currentSector] || sectorThemes.banking;

  // Apply CSS custom properties to document root
  useEffect(() => {
    try {
      if (typeof document === 'undefined') return; // SSR safety
      
      const root = document.documentElement;
      const theme = sectorThemes[currentSector];

      if (!theme) {
        console.warn(`Theme not found for sector: ${currentSector}`);
        return;
      }

      // Set CSS custom properties safely
      const properties = [
        ['--color-primary', theme.primary],
        ['--color-secondary', theme.secondary],
        ['--color-accent', theme.accent],
        ['--color-background', theme.background],
        ['--color-surface', theme.surface],
        ['--color-text', theme.text],
        ['--color-text-secondary', theme.textSecondary],
        ['--color-border', theme.border]
      ];

      properties.forEach(([property, value]) => {
        if (value) {
          root.style.setProperty(property, value);
        }
      });

      // Update data-theme attribute for DaisyUI
      root.setAttribute('data-theme', currentSector);
      
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error applying theme:', err);
      setError(err.message);
    }
  }, [currentSector]);

  // Change sector with transition
  const changeSector = useCallback((newSector) => {
    try {
      if (!newSector || newSector === currentSector || isTransitioning || !sectorThemes[newSector]) {
        return;
      }

      setIsTransitioning(true);
      
      // Add transition class to body safely
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.add('theme-transitioning');
      }
      
      // Change sector immediately for better UX
      setCurrentSector(newSector);
      
      // Clean up transition after animation
      const timeoutId = setTimeout(() => {
        if (typeof document !== 'undefined' && document.body) {
          document.body.classList.remove('theme-transitioning');
        }
        setIsTransitioning(false);
      }, 300);

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        setIsTransitioning(false);
      };
    } catch (err) {
      console.error('Error changing sector:', err);
      setError(err.message);
      setIsTransitioning(false);
    }
  }, [currentSector, isTransitioning]);

  // Get theme for specific sector
  const getTheme = useCallback((sector) => {
    return sectorThemes[sector] || sectorThemes.banking;
  }, []);

  // Get all available sectors
  const getAllSectors = useCallback(() => {
    return Object.keys(sectorThemes);
  }, []);

  const value = {
    currentSector,
    currentTheme,
    isTransitioning,
    changeSector,
    getTheme,
    getAllSectors,
    sectorThemes,
    error
  };

  // If there's a critical error, render fallback
  if (error) {
    console.error('ThemeProvider error:', error);
    // Still provide the context but with limited functionality
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;