import React from 'react';
import { useTheme } from '../context/SafeThemeContext';

const SafeLandingPage = () => {
  const { currentTheme, changeSector, getAllSectors } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Safe Hero Section */}
      <section 
        className="hero min-h-screen text-white relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme?.primary || '#1e40af'}, ${currentTheme?.accent || '#f59e0b'})` 
        }}
      >
        <div className="hero-content text-center relative z-10">
          <div className="max-w-6xl animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Modern CMS Platform for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mt-2">
                Every Business Sector
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed">
              Streamline customer management across Banking, Healthcare, Logistics, and Content Creation 
              with our powerful, sector-specific solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="/signup" 
                className="btn btn-lg px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                style={{ 
                  backgroundColor: currentTheme?.surface || '#ffffff',
                  color: currentTheme?.primary || '#1e40af',
                  border: 'none'
                }}
              >
                Get Started Free
              </a>
              <a 
                href="/theme-test" 
                className="btn btn-outline btn-lg px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white hover:text-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Try Theme System
              </a>
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
                    <span className="ml-1 capitalize">{sector}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safe Sectors Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: currentTheme?.text || '#1e293b' }}>
            Choose Your Sector
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getAllSectors().map(sector => (
              <div key={sector} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="card-body text-center">
                  <h3 className="card-title justify-center capitalize text-xl font-bold mb-3" style={{ color: currentTheme?.primary || '#1e40af' }}>
                    {sector}
                  </h3>
                  <p className="text-base-content/70 mb-4">
                    Specialized tools for {sector} industry management
                  </p>
                  <div className="card-actions justify-center">
                    <button 
                      className="btn btn-primary"
                      onClick={() => changeSector(sector)}
                      style={{ backgroundColor: currentTheme?.primary || '#1e40af' }}
                    >
                      Explore {sector}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safe Features Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: currentTheme?.text || '#1e293b' }}>
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Dynamic Theming', desc: 'Sector-specific themes that adapt to your industry' },
              { title: 'Redux Integration', desc: 'State management with Redux DevTools support' },
              { title: 'Modern UI', desc: 'Beautiful, responsive design with smooth animations' },
              { title: 'Secure & Compliant', desc: 'Enterprise-grade security and compliance features' },
              { title: 'Real-time Updates', desc: 'Live data synchronization across all devices' },
              { title: '24/7 Support', desc: 'Round-the-clock customer support and assistance' }
            ].map((feature, index) => (
              <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="card-body text-center">
                  <h3 className="card-title justify-center mb-3" style={{ color: currentTheme?.primary || '#1e40af' }}>
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safe CTA Section */}
      <section 
        className="py-20 text-white"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme?.primary || '#1e40af'}, ${currentTheme?.accent || '#f59e0b'})` 
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="btn btn-lg bg-white text-primary hover:bg-gray-100">
              Start Free Trial
            </a>
            <a href="/about" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Test Links */}
      <section className="py-10 bg-base-100 text-center">
        <h3 className="text-2xl font-bold mb-4">Test Features</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/theme-test" className="btn btn-outline">Theme System</a>
          <a href="/counter" className="btn btn-outline">Redux Test</a>
          <a href="/about" className="btn btn-outline">About Page</a>
          <a href="/docs" className="btn btn-outline">Documentation</a>
        </div>
      </section>
    </div>
  );
};

export default SafeLandingPage;