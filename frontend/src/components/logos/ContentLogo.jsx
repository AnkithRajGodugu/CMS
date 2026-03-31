import React from 'react';

const ContentLogo = ({ size = 40, className = '', animated = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} ${animated ? 'animate-fade-in' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Palette background */}
      <path 
        d="M20 30 Q20 20, 30 20 L70 20 Q80 20, 80 30 L80 60 Q80 70, 70 70 L50 70 L40 80 L30 70 Q20 70, 20 60 Z" 
        fill="currentColor" 
        opacity="0.1"
      />
      
      {/* Paint brush */}
      <rect x="60" y="15" width="4" height="25" fill="currentColor" opacity="0.8" rx="2"/>
      <ellipse cx="62" cy="42" rx="6" ry="3" fill="currentColor" opacity="0.6"/>
      
      {/* Color dots on palette */}
      <circle cx="35" cy="35" r="4" fill="var(--color-primary, #7c3aed)"/>
      <circle cx="50" cy="32" r="4" fill="var(--color-accent, #ec4899)"/>
      <circle cx="65" cy="35" r="4" fill="#f59e0b"/>
      <circle cx="40" cy="50" r="4" fill="#10b981"/>
      <circle cx="55" cy="53" r="4" fill="#ef4444"/>
      
      {/* Creative spark/star */}
      <path 
        d="M75 25 L77 30 L82 30 L78 33 L80 38 L75 35 L70 38 L72 33 L68 30 L73 30 Z" 
        fill="var(--color-accent, #ec4899)" 
        opacity="0.8"
      />
      
      {/* Design elements - geometric shapes */}
      <rect x="25" y="60" width="8" height="8" fill="currentColor" opacity="0.3" rx="1"/>
      <circle cx="45" cy="64" r="4" fill="currentColor" opacity="0.3"/>
      <path d="M55 60 L63 60 L59 68 Z" fill="currentColor" opacity="0.3"/>
      
      {/* Creativity lines */}
      <path d="M15 75 Q25 70, 35 75 Q45 80, 55 75" stroke="currentColor" strokeWidth="2" opacity="0.4" fill="none"/>
      <path d="M20 85 Q30 80, 40 85 Q50 90, 60 85" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="none"/>
    </svg>
  );
};

export default ContentLogo;