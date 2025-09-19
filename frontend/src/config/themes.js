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
      background: '#fffbeb',
      surface: '#ffffff',
      text: '#292524',
      textSecondary: '#78716c',
      border: '#fed7aa',
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

export default {
  SECTORS,
  SECTOR_THEMES,
  DEFAULT_SECTOR,
  DEFAULT_THEME,
  getTheme,
  getAllSectors,
  getSectorNames,
  CSS_VARIABLES,
  ANIMATION_DURATIONS
};