import React from 'react';
import { useTheme } from '../context/SafeThemeContext';
import { useSector } from '../hooks/useSector';

const ThemeTest = () => {
  const { currentSector, currentTheme, changeSector, getAllSectors } = useTheme();
  const { getSectorDisplayName } = useSector();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
        Theme System Test
      </h2>
      
      <div className="mb-6">
        <p className="mb-2">Current Sector: <strong>{getSectorDisplayName(currentSector)}</strong></p>
        <p className="mb-4">Description: {currentTheme.description}</p>
        
        <div className="flex gap-2 flex-wrap">
          {getAllSectors().map(sector => (
            <button
              key={sector}
              onClick={() => changeSector(sector)}
              className={`btn ${currentSector === sector ? 'btn-primary' : 'btn-outline'}`}
            >
              {getSectorDisplayName(sector)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Color Palette</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                ></div>
                <span>Primary: {currentTheme.colors.primary}</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: currentTheme.colors.secondary }}
                ></div>
                <span>Secondary: {currentTheme.colors.secondary}</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: currentTheme.colors.accent }}
                ></div>
                <span>Accent: {currentTheme.colors.accent}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Theme Components</h3>
            <div className="space-y-2">
              <button className="btn btn-primary w-full">Primary Button</button>
              <button className="btn btn-secondary w-full">Secondary Button</button>
              <button className="btn btn-accent w-full">Accent Button</button>
              <div className="alert alert-info">
                <span>This is an info alert with current theme</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div 
          className={`p-6 rounded-lg bg-gradient-to-r ${currentTheme.gradients.primary} text-white`}
        >
          <h3 className="text-xl font-bold mb-2">Gradient Background</h3>
          <p>This demonstrates the sector-specific gradient styling.</p>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;