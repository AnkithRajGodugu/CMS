import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/SafeThemeContext';
import { useSector } from '../../hooks/useSector';
import DynamicLogo from '../logos/DynamicLogo';

const SectorsSection = () => {
  const { currentTheme, getAllSectors, changeSector } = useTheme();
  const { getSectorDisplayName } = useSector();
  const [hoveredSector, setHoveredSector] = useState(null);

  const sectorDetails = {
    banking: {
      description: 'Comprehensive financial services management with advanced security and compliance tools',
      features: ['Account Management', 'Transaction Tracking', 'Risk Assessment', 'Compliance Tools'],
      color: '#1e40af',
      gradient: 'from-blue-500 to-blue-700'
    },
    healthcare: {
      description: 'Patient management and medical records with HIPAA compliance and care coordination',
      features: ['Patient Records', 'Appointment Scheduling', 'Medical History', 'Insurance Management'],
      color: '#059669',
      gradient: 'from-emerald-500 to-emerald-700'
    },
    logistics: {
      description: 'Supply chain and inventory management with real-time tracking and optimization',
      features: ['Shipment Tracking', 'Inventory Management', 'Route Optimization', 'Fleet Management'],
      color: '#ea580c',
      gradient: 'from-orange-500 to-orange-700'
    },
    content: {
      description: 'Content creation and project management with collaborative tools and asset management',
      features: ['Project Management', 'Asset Management', 'Collaboration Tools', 'Content Calendar'],
      color: '#7c3aed',
      gradient: 'from-violet-500 to-pink-500'
    }
  };

  const handleSectorHover = (sector) => {
    setHoveredSector(sector);
    if (sector) {
      changeSector(sector);
    }
  };

  return (
    <section className="py-20 bg-base-200 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: currentTheme.colors.text }}>
            Choose Your Sector
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            Our platform adapts to your industry needs with specialized tools, workflows, and interfaces 
            designed specifically for your sector's requirements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {getAllSectors().map(sector => {
            const details = sectorDetails[sector];
            const isHovered = hoveredSector === sector;
            
            return (
              <div 
                key={sector}
                className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  isHovered ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{ 
                  ringColor: isHovered ? details.color : 'transparent',
                  borderTop: `4px solid ${details.color}`
                }}
                onMouseEnter={() => handleSectorHover(sector)}
                onMouseLeave={() => handleSectorHover(null)}
              >
                <div className="card-body text-center p-6">
                  {/* Logo */}
                  <div className="flex justify-center mb-4">
                    <div 
                      className={`p-4 rounded-full bg-gradient-to-br ${details.gradient} shadow-lg`}
                    >
                      <DynamicLogo size={40} sector={sector} animated={isHovered} />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="card-title justify-center text-xl font-bold mb-3" style={{ color: details.color }}>
                    {getSectorDisplayName(sector)}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-base-content/70 mb-4 leading-relaxed">
                    {details.description}
                  </p>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <ul className="text-xs space-y-1">
                      {details.features.map((feature, index) => (
                        <li key={index} className="flex items-center justify-center gap-2">
                          <svg className="w-3 h-3" style={{ color: details.color }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="card-actions justify-center gap-2">
                    <Link 
                      to={`/sectors/${sector}`} 
                      className="btn btn-sm btn-outline hover:btn-primary transition-all duration-200"
                      style={{ 
                        borderColor: details.color,
                        color: details.color
                      }}
                    >
                      Learn More
                    </Link>
                    <Link 
                      to={`/dashboard/${sector}`} 
                      className="btn btn-sm text-white transition-all duration-200"
                      style={{ backgroundColor: details.color }}
                    >
                      Try Demo
                    </Link>
                  </div>
                </div>
                
                {/* Hover overlay effect */}
                {isHovered && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-br opacity-5 rounded-lg pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${details.color}, transparent)` }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-base-100 rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
              Not sure which sector fits your needs?
            </h3>
            <p className="text-base-content/70 mb-6">
              Our platform is flexible and can be customized for any industry. 
              Start with our unified dashboard and explore all sectors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/sectors" 
                className="btn btn-outline"
                style={{ borderColor: currentTheme.colors.primary, color: currentTheme.colors.primary }}
              >
                Compare All Sectors
              </Link>
              <Link 
                to="/contact" 
                className="btn text-white"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                Get Personalized Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectorsSection;