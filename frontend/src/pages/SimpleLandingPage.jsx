import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/SafeThemeContext';

const SimpleLandingPage = () => {
  const { currentTheme, changeSector, getAllSectors } = useTheme();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Simple Hero Section */}
      <div 
        className="hero min-h-screen text-white"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})` 
        }}
      >
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">CMS Platform</h1>
            <p className="py-6">
              Modern customer management system for Banking, Healthcare, Logistics, and Content Creation.
            </p>
            <div className="space-x-4">
              <Link to="/login" className="btn btn-primary">Get Started</Link>
              <Link to="/signup" className="btn btn-outline btn-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Sectors Section */}
      <div className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Choose Your Sector</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getAllSectors().map(sector => (
              <div key={sector} className="card bg-base-100 shadow-xl">
                <div className="card-body text-center">
                  <h3 className="card-title justify-center capitalize">{sector}</h3>
                  <p>Specialized tools for {sector} industry</p>
                  <div className="card-actions justify-center">
                    <button 
                      className="btn btn-primary"
                      onClick={() => changeSector(sector)}
                    >
                      Explore {sector}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Links */}
      <div className="py-10 bg-base-100 text-center">
        <h3 className="text-2xl font-bold mb-4">Test Features</h3>
        <div className="space-x-4">
          <Link to="/theme-test" className="btn btn-outline">Theme Test</Link>
          <Link to="/about" className="btn btn-outline">About</Link>
          <Link to="/docs" className="btn btn-outline">Documentation</Link>
          <Link to="/counter" className="btn btn-outline">Counter (Redux Test)</Link>
        </div>
      </div>
    </div>
  );
};

export default SimpleLandingPage;