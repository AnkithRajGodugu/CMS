/**
 * Utility functions for sector detection and management
 */

// Valid sectors
export const SECTORS = {
  BANKING: 'banking',
  HEALTHCARE: 'healthcare',
  LOGISTICS: 'logistics',
  CONTENT: 'content'
};

// Sector validation
export const isValidSector = (sector) => {
  return Object.values(SECTORS).includes(sector?.toLowerCase());
};

// Normalize sector name
export const normalizeSector = (sector) => {
  if (!sector) return SECTORS.BANKING;
  
  const normalized = sector.toLowerCase().trim();
  
  // Handle common variations
  const sectorMap = {
    'banking': SECTORS.BANKING,
    'bank': SECTORS.BANKING,
    'finance': SECTORS.BANKING,
    'financial': SECTORS.BANKING,
    
    'healthcare': SECTORS.HEALTHCARE,
    'health': SECTORS.HEALTHCARE,
    'medical': SECTORS.HEALTHCARE,
    'medicine': SECTORS.HEALTHCARE,
    
    'logistics': SECTORS.LOGISTICS,
    'supply': SECTORS.LOGISTICS,
    'shipping': SECTORS.LOGISTICS,
    'transport': SECTORS.LOGISTICS,
    
    'content': SECTORS.CONTENT,
    'creative': SECTORS.CONTENT,
    'media': SECTORS.CONTENT,
    'marketing': SECTORS.CONTENT
  };

  return sectorMap[normalized] || SECTORS.BANKING;
};

// Get sector from URL path
export const getSectorFromPath = (pathname) => {
  if (!pathname) return null;
  
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Check for sector in path segments
  for (const segment of pathSegments) {
    const normalized = normalizeSector(segment);
    if (isValidSector(normalized)) {
      return normalized;
    }
  }
  
  return null;
};

// Get sector from user data
export const getSectorFromUser = (user) => {
  if (!user || !user.sector) return SECTORS.BANKING;
  return normalizeSector(user.sector);
};

// Auto-detect sector from multiple sources
export const autoDetectSector = (user, pathname) => {
  // Priority: URL path > User sector > Default
  const pathSector = getSectorFromPath(pathname);
  if (pathSector) return pathSector;
  
  const userSector = getSectorFromUser(user);
  if (userSector) return userSector;
  
  return SECTORS.BANKING;
};

// Get sector route prefix
export const getSectorRoutePrefix = (sector) => {
  const sectorRoutes = {
    [SECTORS.BANKING]: '/banking-&-finance',
    [SECTORS.HEALTHCARE]: '/healthcare',
    [SECTORS.LOGISTICS]: '/logistics-&-supply',
    [SECTORS.CONTENT]: '/content-creation'
  };
  
  return sectorRoutes[sector] || sectorRoutes[SECTORS.BANKING];
};

// Get sector dashboard route
export const getSectorDashboardRoute = (sector) => {
  return `/dashboard/${sector}`;
};

// Get sector overview route
export const getSectorOverviewRoute = (sector) => {
  return `/sectors/${sector}`;
};

export default {
  SECTORS,
  isValidSector,
  normalizeSector,
  getSectorFromPath,
  getSectorFromUser,
  autoDetectSector,
  getSectorRoutePrefix,
  getSectorDashboardRoute,
  getSectorOverviewRoute
};