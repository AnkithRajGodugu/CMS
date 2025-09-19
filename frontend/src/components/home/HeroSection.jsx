import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/SafeThemeContext';
import DynamicLogo from '../logos/DynamicLogo';

const HeroSection = () => {
  const { currentTheme, getAllSectors, changeSector } = useTheme();

  return (
    <section 
      className="hero min-h-screen relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})` 
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${currentTheme.colors.surface} 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="hero-content text-center text-white relative z-10">
        <div className="max-w-6xl animate-fade-in-up">
          {/* Logo showcase */}
          <div className="mb-8 flex justify-center">
            <DynamicLogo size={80} showUnified={true} animated={true} />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Modern CMS Platform for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mt-2">
              Every Business Sector
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed">
            Streamline customer management across Banking, Healthcare, Logistics, and Content Creation 
            with our powerful, sector-specific solutions. One platform, infinite possibilities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/signup" 
              className="btn btn-lg px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.primary,
                border: 'none'
              }}
            >
              Get Started Free
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              to="/demo" 
              className="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white hover:text-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Watch Demo
            </Link>
          </div>

          {/* Sector Quick Access */}
          <div className="mb-12">
            <p className="text-sm opacity-80 mb-4">Explore by sector:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {getAllSectors().map(sector => (
                <button
                  key={sector}
                  onClick={() => changeSector(sector)}
                  className="btn btn-sm btn-ghost text-white border border-white border-opacity-30 hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                >
                  <DynamicLogo size={16} sector={sector} animated={false} />
                  <span className="ml-1 capitalize">{sector}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="stat bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200">
              <div className="stat-value text-white text-2xl lg:text-3xl font-bold">10K+</div>
              <div className="stat-desc text-white opacity-80 text-sm">Active Users</div>
            </div>
            <div className="stat bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200">
              <div className="stat-value text-white text-2xl lg:text-3xl font-bold">4</div>
              <div className="stat-desc text-white opacity-80 text-sm">Sectors Covered</div>
            </div>
            <div className="stat bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200">
              <div className="stat-value text-white text-2xl lg:text-3xl font-bold">99.9%</div>
              <div className="stat-desc text-white opacity-80 text-sm">Uptime</div>
            </div>
            <div className="stat bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200">
              <div className="stat-value text-white text-2xl lg:text-3xl font-bold">24/7</div>
              <div className="stat-desc text-white opacity-80 text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
        <DynamicLogo size={40} sector="banking" animated={false} />
      </div>
      <div className="absolute top-32 right-16 opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
        <DynamicLogo size={35} sector="healthcare" animated={false} />
      </div>
      <div className="absolute bottom-32 left-16 opacity-20 animate-bounce-gentle" style={{ animationDelay: '1.5s' }}>
        <DynamicLogo size={45} sector="logistics" animated={false} />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-bounce-gentle" style={{ animationDelay: '2s' }}>
        <DynamicLogo size={38} sector="content" animated={false} />
      </div>
    </section>
  );
};

export default HeroSection;