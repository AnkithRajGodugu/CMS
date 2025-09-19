import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme configuration for each sector
const sectorThemes = {
  banking: {
    name: 'Banking',
    primary: '#1e40af', // blue-800
    secondary: '#64748b', // slate-500
    accent: '#f59e0b', // amber-500
    background: '#f8fafc', // slate-50
    surface: '#ffffff',
    text: '#1e293b', // slate-800
    textSecondary: '#64748b', // slate-500
    border: '#e2e8f0', // slate-200
    gradient: 'from-blue-600 to-blue-800',
    logo: 'banking',
    description: 'Professional and trustworthy'
  },
  healthcare: {
    name: 'Healthcare',
    primary: '#059669', // emerald-600
    secondary: '#6b7280', // gray-500
    accent: '#dc2626', // red-600
    background: '#f0fdf4', // green-50
    surface: '#ffffff',
    text: '#1f2937', // gray-800
    textSecondary: '#6b7280', // gray-500
    border: '#d1fae5', // green-100
    gradient: 'from-emerald-500 to-emerald-700',
    logo: 'healthcare',
    description: 'Clean and caring'
  },
  logistics: {
    name: 'Logistics',
    primary: '#ea580c', // orange-600
    secondary: '#78716c', // stone-500
    accent: '#eab308', // yellow-500
    background: '#fffbeb', // amber-50
    surface: '#ffffff',
    text: '#292524', // stone-800
    textSecondary: '#78716c', // stone-500
    border: '#fed7aa', // orange-200
    gradient: 'from-orange-500 to-orange-700',
    logo: 'logistics',
    description: 'Dynamic and efficient'
  },
  content: {
    name: 'Content Creation',
    primary: '#7c3aed', // violet-600
    secondary: '#6b7280', // gray-500
    accent: '#ec4899', // pink-500
    background: '#faf5ff', // violet-50
    surface: '#ffffff',
    text: '#374151', // gray-700
    textSecondary: '#6b7280', // gray-500
    border: '#e9d5ff', // violet-200
    gradient: 'from-violet-500 to-pink-500',
    logo: 'content',
    description: 'Creative and vibrant'
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentSector, setCurrentSector] = useState('banking');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get current theme based on sector
  const currentTheme = sectorThemes[currentSector];

  // Apply CSS custom properties to document root
  useEffect(() => {
    try {
      const root = document.documentElement;
      const theme = sectorThemes[currentSector];

      if (!theme) {
        console.warn(`Theme not found for sector: ${currentSector}`);
        return;
      }

      // Set CSS custom properties
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-secondary', theme.secondary);
      root.style.setProperty('--color-accent', theme.accent);
      root.style.setProperty('--color-background', theme.background);
      root.style.setProperty('--color-surface', theme.surface);
      root.style.setProperty('--color-text', theme.text);
      root.style.setProperty('--color-text-secondary', theme.textSecondary);
      root.style.setProperty('--color-border', theme.border);

      // Update data-theme attribute for DaisyUI
      root.setAttribute('data-theme', currentSector);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [currentSector]); // Only depend on currentSector, not currentTheme

  // Change sector with transition
  const changeSector = (newSector) => {
    if (newSector === currentSector || isTransitioning || !sectorThemes[newSector]) {
      return;
    }

    setIsTransitioning(true);
    
    // Add transition class to body
    if (document.body) {
      document.body.classList.add('theme-transitioning');
    }
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      setCurrentSector(newSector);
      
      // Clean up transition after animation
      const cleanup = setTimeout(() => {
        if (document.body) {
          document.body.classList.remove('theme-transitioning');
        }
        setIsTransitioning(false);
      }, 300);

      // Store cleanup function for potential cleanup
      return () => clearTimeout(cleanup);
    });
  };

  // Get theme for specific sector
  const getTheme = (sector) => sectorThemes[sector] || sectorThemes.banking;

  // Get all available sectors
  const getAllSectors = () => Object.keys(sectorThemes);

  const value = {
    currentSector,
    currentTheme,
    isTransitioning,
    changeSector,
    getTheme,
    getAllSectors,
    sectorThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;