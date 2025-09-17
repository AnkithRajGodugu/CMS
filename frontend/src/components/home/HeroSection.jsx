import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero min-h-screen gradient-bg">
      <div className="hero-content text-center text-white">
        <div className="max-w-4xl animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Modern CMS Platform for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Every Sector
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Streamline customer management across Banking, Healthcare, Logistics, and Content Creation 
            with our powerful, sector-specific solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started Free
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/demo" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
              Watch Demo
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9 4h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="stat">
              <div className="stat-value text-white">10K+</div>
              <div className="stat-desc text-white opacity-80">Active Users</div>
            </div>
            <div className="stat">
              <div className="stat-value text-white">4</div>
              <div className="stat-desc text-white opacity-80">Sectors Covered</div>
            </div>
            <div className="stat">
              <div className="stat-value text-white">99.9%</div>
              <div className="stat-desc text-white opacity-80">Uptime</div>
            </div>
            <div className="stat">
              <div className="stat-value text-white">24/7</div>
              <div className="stat-desc text-white opacity-80">Support</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;