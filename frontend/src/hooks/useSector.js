import { useAuth } from './useAuth';
import { useTheme } from '../context/SafeThemeContext';

/**
 * Custom hook for sector-related functionality
 * Combines user sector data with theme management
 */
export const useSector = () => {
  const { user } = useAuth();
  const { currentSector, changeSector, getTheme, getAllSectors } = useTheme();

  // Get user's assigned sector
  const userSector = user?.sector?.toLowerCase() || 'banking';

  // Switch to user's sector
  const switchToUserSector = () => {
    if (userSector && userSector !== currentSector) {
      changeSector(userSector);
    }
  };

  // Check if current sector matches user's sector
  const isUserSector = currentSector === userSector;

  // Get sector display name
  const getSectorDisplayName = (sector) => {
    const theme = getTheme(sector);
    return theme.name;
  };

  // Get sector color scheme
  const getSectorColors = (sector) => {
    const theme = getTheme(sector);
    return {
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
      background: theme.background,
      gradient: theme.gradient
    };
  };

  return {
    currentSector,
    userSector,
    isUserSector,
    changeSector,
    switchToUserSector,
    getSectorDisplayName,
    getSectorColors,
    getAllSectors
  };
};

export default useSector;