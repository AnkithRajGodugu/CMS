import React, { useState, useEffect } from 'react';
import SectorHeader from './SectorHeader';
import SectorSidebar from './SectorSidebar';
import { useSectorTheme } from '../../hooks/useSectorTheme';

/**
 * SectorLayout - Responsive layout component for sector-specific pages
 * Provides consistent structure with header, sidebar, and main content area
 * Supports sector-specific theming and accessibility features
 */
const SectorLayout = ({ sector, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { changeSector, currentTheme } = useSectorTheme();

  // Sync theme with sector prop
  useEffect(() => {
    if (sector?.code && sector.code !== currentTheme.id) {
      changeSector(sector.code);
    }
  }, [sector, currentTheme.id, changeSector]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div 
      className="min-h-screen bg-theme-background flex flex-col"
      data-theme={sector?.code?.toLowerCase() || 'light'}
      role="main"
      aria-label={`${sector?.name || 'Sector'} Layout`}
    >
      {/* Header */}
      <SectorHeader 
        sector={sector} 
        onToggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SectorSidebar 
          sector={sector} 
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />

        {/* Main Content */}
        <main 
          className={`
            flex-1 overflow-y-auto transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-64'}
          `}
          role="region"
          aria-label="Main content"
        >
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SectorLayout;
