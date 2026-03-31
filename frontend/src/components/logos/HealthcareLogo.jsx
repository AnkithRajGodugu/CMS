import React from 'react';

const HealthcareLogo = ({ size = 40, className = '', animated = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} ${animated ? 'animate-fade-in' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Medical cross background circle */}
      <circle cx="50" cy="50" r="35" fill="currentColor" opacity="0.1"/>
      
      {/* Medical cross */}
      <rect x="42" y="25" width="16" height="50" fill="currentColor" rx="2"/>
      <rect x="25" y="42" width="50" height="16" fill="currentColor" rx="2"/>
      
      {/* Heart symbol overlay */}
      <path 
        d="M75 35 C75 30, 70 25, 65 25 C60 25, 55 30, 55 35 C55 30, 50 25, 45 25 C40 25, 35 30, 35 35 C35 45, 55 60, 55 60 C55 60, 75 45, 75 35 Z" 
        fill="var(--color-accent, #dc2626)" 
        opacity="0.8"
      />
      
      {/* Pulse line */}
      <path 
        d="M15 80 L25 80 L30 70 L35 90 L40 60 L45 80 L85 80" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
        opacity="0.6"
      />
      
      {/* Stethoscope element */}
      <circle cx="20" cy="20" r="6" fill="currentColor" opacity="0.4"/>
      <path d="M20 26 Q30 35 40 30" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"/>
    </svg>
  );
};

export default HealthcareLogo;