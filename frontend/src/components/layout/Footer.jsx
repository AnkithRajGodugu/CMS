import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/SafeThemeContext';
import { useSector } from '../../hooks/useSector';
import DynamicLogo from '../logos/DynamicLogo';

const Footer = () => {
  const { currentTheme, getAllSectors } = useTheme();
  const { getSectorDisplayName } = useSector();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-neutral text-neutral-content transition-all duration-300"
      style={{ 
        backgroundColor: currentTheme.colors.text,
        color: currentTheme.colors.surface 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <DynamicLogo size={32} showUnified={true} />
              <h3 className="text-xl font-bold">CMS Platform</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Modern customer management solutions for multiple sectors including banking, healthcare, logistics, and content creation. 
              Streamline your operations with our comprehensive platform.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm hover:bg-opacity-20"
                style={{ '--tw-bg-opacity': '0.1' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm hover:bg-opacity-20"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm hover:bg-opacity-20"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Stay Updated</h5>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="input input-sm bg-opacity-20 border-opacity-30 text-white placeholder-gray-300 flex-1"
                />
                <button 
                  className="btn btn-sm"
                  style={{ backgroundColor: currentTheme.colors.primary, color: 'white' }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Sectors */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
              Sectors
            </h4>
            <ul className="space-y-3 text-sm">
              {getAllSectors().map(sector => (
                <li key={sector}>
                  <Link 
                    to={`/sectors/${sector}`} 
                    className="flex items-center gap-2 hover:text-primary transition-colors opacity-80 hover:opacity-100"
                  >
                    <DynamicLogo size={16} sector={sector} animated={false} />
                    {getSectorDisplayName(sector)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Resources
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/docs" className="hover:text-primary hover:opacity-100 transition-all">Documentation</Link></li>
              <li><Link to="/api" className="hover:text-primary hover:opacity-100 transition-all">API Reference</Link></li>
              <li><Link to="/support" className="hover:text-primary hover:opacity-100 transition-all">Support Center</Link></li>
              <li><Link to="/blog" className="hover:text-primary hover:opacity-100 transition-all">Blog</Link></li>
              <li><Link to="/tutorials" className="hover:text-primary hover:opacity-100 transition-all">Tutorials</Link></li>
              <li><Link to="/community" className="hover:text-primary hover:opacity-100 transition-all">Community</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
              </svg>
              Company
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/about" className="hover:text-primary hover:opacity-100 transition-all">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary hover:opacity-100 transition-all">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary hover:opacity-100 transition-all">Contact</Link></li>
              <li><Link to="/press" className="hover:text-primary hover:opacity-100 transition-all">Press Kit</Link></li>
              <li><Link to="/partners" className="hover:text-primary hover:opacity-100 transition-all">Partners</Link></li>
              <li><Link to="/investors" className="hover:text-primary hover:opacity-100 transition-all">Investors</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="divider opacity-20 my-8"
          style={{ borderColor: currentTheme.colors.border }}
        ></div>
        
        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-sm opacity-60">
              © {currentYear} CMS Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs opacity-60">
              <span>Made with</span>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>for better business management</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm opacity-60">
            <Link to="/terms" className="hover:text-primary hover:opacity-100 transition-all">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-primary hover:opacity-100 transition-all">Privacy Policy</Link>
            <Link to="/cookies" className="hover:text-primary hover:opacity-100 transition-all">Cookie Policy</Link>
            <Link to="/security" className="hover:text-primary hover:opacity-100 transition-all">Security</Link>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 pt-6 border-t border-opacity-20 text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs opacity-60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;