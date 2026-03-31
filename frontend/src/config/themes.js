/**
 * Centralized theme configuration for all sectors
 * This file contains all theme-related constants and configurations
 */

// Sector identifiers
export const SECTORS = {
  BANKING: 'banking',
  HEALTHCARE: 'healthcare',
  LOGISTICS: 'logistics',
  CONTENT: 'content'
};

// Complete theme configuration for each sector
export const SECTOR_THEMES = {
  [SECTORS.BANKING]: {
    id: 'banking',
    name: 'Banking & Finance',
    description: 'Professional and trustworthy financial services',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9'
    },
    gradients: {
      primary: 'from-blue-600 to-blue-800',
      secondary: 'from-slate-500 to-slate-700',
      accent: 'from-amber-400 to-amber-600',
      hero: 'from-blue-900 via-blue-800 to-blue-700'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(30 64 175 / 0.05)',
      md: '0 4px 6px -1px rgb(30 64 175 / 0.1)',
      lg: '0 10px 15px -3px rgb(30 64 175 / 0.1)',
      xl: '0 20px 25px -5px rgb(30 64 175 / 0.1)'
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Georgia, serif'
    },
    typography: {
      fontSizes: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem'     // 48px
      },
      fontWeights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800'
      },
      lineHeights: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2'
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em'
      }
    },
    spacing: {
      xs: '0.25rem',   // 4px
      sm: '0.5rem',    // 8px
      md: '1rem',      // 16px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
      '2xl': '3rem',   // 48px
      '3xl': '4rem',   // 64px
      '4xl': '6rem'    // 96px
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',  // 2px
      md: '0.375rem',  // 6px
      lg: '0.5rem',    // 8px
      xl: '0.75rem',   // 12px
      '2xl': '1rem',   // 16px
      full: '9999px'
    },
    logo: 'banking',
    icon: '🏦',
    daisyTheme: 'banking'
  },

  [SECTORS.HEALTHCARE]: {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Clean and caring medical solutions',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#dc2626',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#d1fae5',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9'
    },
    gradients: {
      primary: 'from-emerald-500 to-emerald-700',
      secondary: 'from-gray-500 to-gray-700',
      accent: 'from-red-500 to-red-700',
      hero: 'from-emerald-800 via-emerald-700 to-emerald-600'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(5 150 105 / 0.05)',
      md: '0 4px 6px -1px rgb(5 150 105 / 0.1)',
      lg: '0 10px 15px -3px rgb(5 150 105 / 0.1)',
      xl: '0 20px 25px -5px rgb(5 150 105 / 0.1)'
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'system-ui, sans-serif'
    },
    typography: {
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      fontWeights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800'
      },
      lineHeights: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2'
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px'
    },
    logo: 'healthcare',
    icon: '🏥',
    daisyTheme: 'healthcare'
  },

  [SECTORS.LOGISTICS]: {
    id: 'logistics',
    name: 'Logistics & Supply Chain',
    description: 'Dynamic and efficient supply chain management',
    colors: {
      primary: '#ea580c',
      secondary: '#78716c',
      accent: '#eab308',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#292524',
      textSecondary: '#78716c',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9'
    },
    gradients: {
      primary: 'from-orange-500 to-orange-700',
      secondary: 'from-stone-500 to-stone-700',
      accent: 'from-yellow-400 to-yellow-600',
      hero: 'from-orange-800 via-orange-700 to-orange-600'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(234 88 12 / 0.05)',
      md: '0 4px 6px -1px rgb(234 88 12 / 0.1)',
      lg: '0 10px 15px -3px rgb(234 88 12 / 0.1)',
      xl: '0 20px 25px -5px rgb(234 88 12 / 0.1)'
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'system-ui, sans-serif'
    },
    typography: {
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      fontWeights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800'
      },
      lineHeights: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2'
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px'
    },
    logo: 'logistics',
    icon: '🚚',
    daisyTheme: 'logistics'
  },

  [SECTORS.CONTENT]: {
    id: 'content',
    name: 'Content Creation',
    description: 'Creative and vibrant content management',
    colors: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      accent: '#ec4899',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#374151',
      textSecondary: '#6b7280',
      border: '#e9d5ff',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#f87171',
      info: '#0ea5e9'
    },
    gradients: {
      primary: 'from-violet-500 to-violet-700',
      secondary: 'from-gray-500 to-gray-700',
      accent: 'from-pink-500 to-pink-700',
      hero: 'from-violet-800 via-violet-700 to-pink-600'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(124 58 237 / 0.05)',
      md: '0 4px 6px -1px rgb(124 58 237 / 0.1)',
      lg: '0 10px 15px -3px rgb(124 58 237 / 0.1)',
      xl: '0 20px 25px -5px rgb(124 58 237 / 0.1)'
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'system-ui, sans-serif'
    },
    typography: {
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      fontWeights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800'
      },
      lineHeights: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2'
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px'
    },
    logo: 'content',
    icon: '🎨',
    daisyTheme: 'content'
  }
};

// Default theme
export const DEFAULT_SECTOR = SECTORS.BANKING;
export const DEFAULT_THEME = SECTOR_THEMES[DEFAULT_SECTOR];

// Theme utility functions
export const getTheme = (sector) => {
  return SECTOR_THEMES[sector] || DEFAULT_THEME;
};

export const getAllSectors = () => {
  return Object.keys(SECTOR_THEMES);
};

export const getSectorNames = () => {
  return Object.values(SECTOR_THEMES).map(theme => ({
    id: theme.id,
    name: theme.name,
    icon: theme.icon
  }));
};

// CSS custom property names
export const CSS_VARIABLES = {
  PRIMARY: '--color-primary',
  SECONDARY: '--color-secondary',
  ACCENT: '--color-accent',
  BACKGROUND: '--color-background',
  SURFACE: '--color-surface',
  TEXT: '--color-text',
  TEXT_SECONDARY: '--color-text-secondary',
  BORDER: '--color-border'
};

// Animation durations
export const ANIMATION_DURATIONS = {
  THEME_TRANSITION: 300,
  LOGO_TRANSITION: 400,
  HOVER: 200,
  MODAL: 250
};

// Theme utility functions

/**
 * Apply theme colors to CSS custom properties
 * @param {Object} theme - Theme object from SECTOR_THEMES
 */
export const applyThemeColors = (theme) => {
  if (!theme || !theme.colors) return;
  
  const root = document.documentElement;
  root.style.setProperty(CSS_VARIABLES.PRIMARY, theme.colors.primary);
  root.style.setProperty(CSS_VARIABLES.SECONDARY, theme.colors.secondary);
  root.style.setProperty(CSS_VARIABLES.ACCENT, theme.colors.accent);
  root.style.setProperty(CSS_VARIABLES.BACKGROUND, theme.colors.background);
  root.style.setProperty(CSS_VARIABLES.SURFACE, theme.colors.surface);
  root.style.setProperty(CSS_VARIABLES.TEXT, theme.colors.text);
  root.style.setProperty(CSS_VARIABLES.TEXT_SECONDARY, theme.colors.textSecondary);
  root.style.setProperty(CSS_VARIABLES.BORDER, theme.colors.border);
};

/**
 * Get color value from theme
 * @param {string} sector - Sector identifier
 * @param {string} colorKey - Color key (e.g., 'primary', 'secondary')
 * @returns {string} Color value
 */
export const getThemeColor = (sector, colorKey) => {
  const theme = getTheme(sector);
  return theme.colors[colorKey] || theme.colors.primary;
};

/**
 * Get gradient class from theme
 * @param {string} sector - Sector identifier
 * @param {string} gradientKey - Gradient key (e.g., 'primary', 'hero')
 * @returns {string} Tailwind gradient classes
 */
export const getThemeGradient = (sector, gradientKey = 'primary') => {
  const theme = getTheme(sector);
  return theme.gradients[gradientKey] || theme.gradients.primary;
};

/**
 * Get typography value from theme
 * @param {string} sector - Sector identifier
 * @param {string} category - Typography category (e.g., 'fontSizes', 'fontWeights')
 * @param {string} key - Specific key within category
 * @returns {string} Typography value
 */
export const getTypography = (sector, category, key) => {
  const theme = getTheme(sector);
  return theme.typography?.[category]?.[key] || '';
};

/**
 * Get spacing value from theme
 * @param {string} sector - Sector identifier
 * @param {string} size - Spacing size (e.g., 'sm', 'md', 'lg')
 * @returns {string} Spacing value
 */
export const getSpacing = (sector, size) => {
  const theme = getTheme(sector);
  return theme.spacing?.[size] || theme.spacing?.md || '1rem';
};

/**
 * Get border radius value from theme
 * @param {string} sector - Sector identifier
 * @param {string} size - Border radius size (e.g., 'sm', 'md', 'lg')
 * @returns {string} Border radius value
 */
export const getBorderRadius = (sector, size) => {
  const theme = getTheme(sector);
  return theme.borderRadius?.[size] || theme.borderRadius?.md || '0.375rem';
};

/**
 * Get shadow value from theme
 * @param {string} sector - Sector identifier
 * @param {string} size - Shadow size (e.g., 'sm', 'md', 'lg')
 * @returns {string} Shadow value
 */
export const getShadow = (sector, size) => {
  const theme = getTheme(sector);
  return theme.shadows?.[size] || theme.shadows?.md || '';
};

/**
 * Check if a sector exists
 * @param {string} sector - Sector identifier
 * @returns {boolean} True if sector exists
 */
export const isSectorValid = (sector) => {
  return sector && Object.prototype.hasOwnProperty.call(SECTOR_THEMES, sector);
};

/**
 * Get DaisyUI theme name for sector
 * @param {string} sector - Sector identifier
 * @returns {string} DaisyUI theme name
 */
export const getDaisyTheme = (sector) => {
  const theme = getTheme(sector);
  return theme.daisyTheme || 'light';
};

/**
 * Generate inline styles object from theme
 * @param {string} sector - Sector identifier
 * @returns {Object} Inline styles object
 */
export const getThemeStyles = (sector) => {
  const theme = getTheme(sector);
  return {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-border': theme.colors.border
  };
};

export default {
  SECTORS,
  SECTOR_THEMES,
  DEFAULT_SECTOR,
  DEFAULT_THEME,
  getTheme,
  getAllSectors,
  getSectorNames,
  CSS_VARIABLES,
  ANIMATION_DURATIONS,
  applyThemeColors,
  getThemeColor,
  getThemeGradient,
  getTypography,
  getSpacing,
  getBorderRadius,
  getShadow,
  isSectorValid,
  getDaisyTheme,
  getThemeStyles
};