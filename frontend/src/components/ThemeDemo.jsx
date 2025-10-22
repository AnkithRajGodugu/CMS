import React from 'react';
import { useSectorTheme } from '../hooks/useSectorTheme';
import { SECTORS, getSectorNames } from '../config/themes';

/**
 * ThemeDemo component
 * Demonstrates the usage of SectorThemeProvider and theme utilities
 */
const ThemeDemo = () => {
  const { currentSector, currentTheme, isTransitioning, changeSector } = useSectorTheme();
  const sectors = getSectorNames();

  return (
    <div className="min-h-screen bg-theme-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-theme-text mb-2">
            Sector Theme System Demo
          </h1>
          <p className="text-theme-text-secondary">
            Current Sector: <span className="font-semibold text-theme-primary">{currentTheme.name}</span>
            {isTransitioning && <span className="ml-2 text-sm">(Transitioning...)</span>}
          </p>
        </div>

        {/* Sector Switcher */}
        <div className="bg-theme-surface rounded-lg shadow-lg p-6 mb-8 border border-theme-border">
          <h2 className="text-2xl font-semibold text-theme-text mb-4">Switch Sector</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => changeSector(sector.id)}
                disabled={isTransitioning || currentSector === sector.id}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200
                  ${currentSector === sector.id 
                    ? 'border-theme-primary bg-theme-primary text-white' 
                    : 'border-theme-border bg-theme-surface text-theme-text hover:border-theme-primary'
                  }
                  ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-3xl mb-2">{sector.icon}</div>
                <div className="font-medium text-sm">{sector.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-theme-surface rounded-lg shadow-lg p-6 mb-8 border border-theme-border">
          <h2 className="text-2xl font-semibold text-theme-text mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="bg-theme-primary h-20 rounded-lg"></div>
              <p className="text-sm text-theme-text-secondary">Primary</p>
              <p className="text-xs font-mono text-theme-text">{currentTheme.colors.primary}</p>
            </div>
            <div className="space-y-2">
              <div className="bg-theme-secondary h-20 rounded-lg"></div>
              <p className="text-sm text-theme-text-secondary">Secondary</p>
              <p className="text-xs font-mono text-theme-text">{currentTheme.colors.secondary}</p>
            </div>
            <div className="space-y-2">
              <div className="bg-theme-accent h-20 rounded-lg"></div>
              <p className="text-sm text-theme-text-secondary">Accent</p>
              <p className="text-xs font-mono text-theme-text">{currentTheme.colors.accent}</p>
            </div>
            <div className="space-y-2">
              <div className="bg-theme-background h-20 rounded-lg border border-theme-border"></div>
              <p className="text-sm text-theme-text-secondary">Background</p>
              <p className="text-xs font-mono text-theme-text">{currentTheme.colors.background}</p>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-theme-surface rounded-lg shadow-lg p-6 mb-8 border border-theme-border">
          <h2 className="text-2xl font-semibold text-theme-text mb-4">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-5xl font-bold text-theme-text">Heading 1</h1>
              <p className="text-sm text-theme-text-secondary mt-1">
                {currentTheme.typography.fontSizes['5xl']} / {currentTheme.typography.fontWeights.bold}
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-semibold text-theme-text">Heading 2</h2>
              <p className="text-sm text-theme-text-secondary mt-1">
                {currentTheme.typography.fontSizes['4xl']} / {currentTheme.typography.fontWeights.semibold}
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-medium text-theme-text">Heading 3</h3>
              <p className="text-sm text-theme-text-secondary mt-1">
                {currentTheme.typography.fontSizes['3xl']} / {currentTheme.typography.fontWeights.medium}
              </p>
            </div>
            <div>
              <p className="text-base text-theme-text">
                Body text with normal weight. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-sm text-theme-text-secondary mt-1">
                {currentTheme.typography.fontSizes.base} / {currentTheme.typography.fontWeights.normal}
              </p>
            </div>
          </div>
        </div>

        {/* Components */}
        <div className="bg-theme-surface rounded-lg shadow-lg p-6 border border-theme-border">
          <h2 className="text-2xl font-semibold text-theme-text mb-4">UI Components</h2>
          <div className="space-y-4">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-medium text-theme-text mb-3">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-theme-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                  Primary Button
                </button>
                <button className="px-4 py-2 bg-theme-secondary text-white rounded-lg hover:opacity-90 transition-opacity">
                  Secondary Button
                </button>
                <button className="px-4 py-2 bg-theme-accent text-white rounded-lg hover:opacity-90 transition-opacity">
                  Accent Button
                </button>
                <button className="px-4 py-2 border-2 border-theme-primary text-theme-primary rounded-lg hover:bg-theme-primary hover:text-white transition-all">
                  Outline Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="text-lg font-medium text-theme-text mb-3">Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-theme-background rounded-lg border border-theme-border">
                  <h4 className="font-semibold text-theme-text mb-2">Card Title</h4>
                  <p className="text-sm text-theme-text-secondary">
                    This is a sample card with themed colors.
                  </p>
                </div>
                <div className="p-4 bg-theme-primary text-white rounded-lg">
                  <h4 className="font-semibold mb-2">Primary Card</h4>
                  <p className="text-sm opacity-90">
                    This card uses the primary color.
                  </p>
                </div>
                <div className="p-4 bg-theme-accent text-white rounded-lg">
                  <h4 className="font-semibold mb-2">Accent Card</h4>
                  <p className="text-sm opacity-90">
                    This card uses the accent color.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
