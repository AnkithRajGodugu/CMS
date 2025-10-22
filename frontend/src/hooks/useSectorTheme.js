import { useSectorTheme as useThemeContext } from '../context/SectorThemeProvider';

/**
 * Custom hook to access sector theme functionality
 * @returns {Object} Theme context with utilities
 */
export const useSectorTheme = () => {
  return useThemeContext();
};

export default useSectorTheme;
