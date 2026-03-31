import React from 'react';

const LogisticsLogo = ({ size = 40, className = '', animated = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} ${animated ? 'animate-fade-in' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Truck body */}
      <rect x="15" y="40" width="45" height="25" fill="currentColor" opacity="0.8" rx="3"/>
      
      {/* Truck cab */}
      <rect x="60" y="35" width="20" height="30" fill="currentColor" rx="3"/>
      
      {/* Truck wheels */}
      <circle cx="30" cy="70" r="8" fill="currentColor" opacity="0.6"/>
      <circle cx="55" cy="70" r="8" fill="currentColor" opacity="0.6"/>
      <circle cx="70" cy="70" r="8" fill="currentColor" opacity="0.6"/>
      
      {/* Wheel centers */}
      <circle cx="30" cy="70" r="3" fill="var(--color-background, #ffffff)"/>
      <circle cx="55" cy="70" r="3" fill="var(--color-background, #ffffff)"/>
      <circle cx="70" cy="70" r="3" fill="var(--color-background, #ffffff)"/>
      
      {/* Cargo boxes */}
      <rect x="20" y="45" width="12" height="12" fill="var(--color-accent, #eab308)" opacity="0.7" rx="1"/>
      <rect x="35" y="45" width="12" height="12" fill="var(--color-accent, #eab308)" opacity="0.5" rx="1"/>
      <rect x="50" y="45" width="8" height="12" fill="var(--color-accent, #eab308)" opacity="0.3" rx="1"/>
      
      {/* Movement lines */}
      <path d="M5 25 L15 25" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <path d="M5 30 L20 30" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <path d="M5 35 L12 35" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
      
      {/* Route/GPS indicator */}
      <circle cx="85" cy="20" r="8" fill="var(--color-accent, #eab308)" opacity="0.9"/>
      <circle cx="85" cy="20" r="3" fill="white"/>
      
      {/* Arrow indicating direction */}
      <path d="M88 15 L95 20 L88 25" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
    </svg>
  );
};

export default LogisticsLogo;