import React from 'react';
import { useTheme } from '../../context/SafeThemeContext';
import BankingLogo from './BankingLogo';
import HealthcareLogo from './HealthcareLogo';
import LogisticsLogo from './LogisticsLogo';
import ContentLogo from './ContentLogo';
import UnifiedLogo from './UnifiedLogo';

const DynamicLogo = ({ 
  size = 40, 
  className = '', 
  showUnified = false, 
  animated = true,
  sector = null 
}) => {
  const { currentSector, currentTheme, isTransitioning } = useTheme();
  
  // Use provided sector or current sector
  const activeSector = sector || currentSector;
  
  // Show unified logo if requested or during transitions
  if (showUnified || isTransitioning) {
    return (
      <div 
        className={`transition-all duration-300 ${className}`}
        style={{ color: currentTheme.colors.primary }}
      >
        <UnifiedLogo size={size} animated={animated} />
      </div>
    );
  }

  // Render sector-specific logo
  const renderSectorLogo = () => {
    const logoProps = { size, animated, className: 'w-full h-full' };
    
    switch (activeSector) {
      case 'banking':
        return <BankingLogo {...logoProps} />;
      case 'healthcare':
        return <HealthcareLogo {...logoProps} />;
      case 'logistics':
        return <LogisticsLogo {...logoProps} />;
      case 'content':
        return <ContentLogo {...logoProps} />;
      default:
        return <UnifiedLogo {...logoProps} />;
    }
  };

  return (
    <div 
      className={`transition-all duration-300 ${isTransitioning ? 'animate-theme-transition' : ''} ${className}`}
      style={{ color: currentTheme.colors.primary }}
    >
      {renderSectorLogo()}
    </div>
  );
};

export default DynamicLogo;