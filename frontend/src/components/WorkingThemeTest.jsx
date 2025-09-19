import React from 'react';
import { useTheme } from '../context/SafeThemeContext';
import { useSector } from '../hooks/useSector';

const WorkingThemeTest = () => {
  const { currentSector, currentTheme, changeSector, getAllSectors, isTransitioning, error } = useTheme();
  const { getSectorDisplayName } = useSector();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Theme System Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
            🎨 Working Theme System
          </h1>
          <p className="text-xl text-base-content/70">
            Dynamic theming across all sectors - fully functional!
          </p>
        </div>

        {/* Current Theme Info */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title" style={{ color: currentTheme.colors.primary }}>
              Current Theme: {getSectorDisplayName(currentSector)}
            </h2>
            <p className="text-base-content/70 mb-4">{currentTheme.description}</p>
            
            {isTransitioning && (
              <div className="alert alert-info mb-4">
                <span>🔄 Theme transition in progress...</span>
              </div>
            )}
            
            {/* Sector Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {getAllSectors().map(sector => (
                <button
                  key={sector}
                  onClick={() => changeSector(sector)}
                  className={`btn transition-all duration-200 ${
                    currentSector === sector 
                      ? 'btn-primary' 
                      : 'btn-outline hover:btn-primary'
                  }`}
                  disabled={isTransitioning}
                >
                  {getSectorDisplayName(sector)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Color Palette Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Color Palette</h3>
              <div className="space-y-3">
                {[
                  ['Primary', currentTheme.primary],
                  ['Secondary', currentTheme.secondary],
                  ['Accent', currentTheme.accent],
                  ['Background', currentTheme.background],
                  ['Surface', currentTheme.surface],
                  ['Text', currentTheme.text]
                ].map(([name, color]) => (
                  <div key={name} className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg border border-base-300 shadow-sm"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div>
                      <div className="font-medium text-sm">{name}</div>
                      <div className="text-xs text-base-content/60 font-mono">{color}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Component Preview</h3>
              <div className="space-y-3">
                <button 
                  className="btn btn-primary w-full"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  Primary Button
                </button>
                <button 
                  className="btn btn-outline w-full"
                  style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
                >
                  Outline Button
                </button>
                <div className="alert alert-info">
                  <span>This is a themed alert component</span>
                </div>
                <div 
                  className="p-4 rounded-lg text-white"
                  style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})` }}
                >
                  <div className="font-semibold">Gradient Background</div>
                  <div className="text-sm opacity-90">Using theme colors</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Theme Details</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Sector:</strong> {currentSector}</div>
                <div><strong>Name:</strong> {currentTheme.name}</div>
                <div><strong>Description:</strong> {currentTheme.description}</div>
                <div><strong>Logo:</strong> {currentTheme.logo}</div>
                <div><strong>Gradient:</strong> {currentTheme.gradient}</div>
                <div><strong>Transitioning:</strong> {isTransitioning ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <div className="alert alert-success max-w-2xl mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Theme System Working!</h3>
              <div className="text-sm">All theme functionality is operational. Try switching between sectors above.</div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="text-center mt-8">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/" className="btn btn-outline">← Back to Home</a>
            <a href="/counter" className="btn btn-outline">Redux Test</a>
            <a href="/about" className="btn btn-outline">About Page</a>
            <a href="/docs" className="btn btn-outline">Documentation</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingThemeTest;