import React from 'react';

const UnifiedLogo = ({ size = 40, className = '', animated = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} ${animated ? 'animate-fade-in' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central circle representing unity */}
      <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2"/>
      
      {/* Four quadrants representing each sector */}
      
      {/* Banking quadrant (top-left) */}
      <g transform="translate(15, 15)">
        <rect x="5" y="10" width="15" height="12" fill="#1e40af" opacity="0.7" rx="1"/>
        <rect x="7" y="12" width="2" height="8" fill="#1e40af" rx="0.5"/>
        <rect x="11" y="12" width="2" height="8" fill="#1e40af" rx="0.5"/>
        <rect x="15" y="12" width="2" height="8" fill="#1e40af" rx="0.5"/>
        <path d="M5 10 L12.5 5 L20 10 Z" fill="#1e40af"/>
      </g>
      
      {/* Healthcare quadrant (top-right) */}
      <g transform="translate(65, 15)">
        <circle cx="10" cy="12" r="8" fill="#059669" opacity="0.2"/>
        <rect x="8" y="6" width="4" height="12" fill="#059669" rx="1"/>
        <rect x="4" y="10" width="12" height="4" fill="#059669" rx="1"/>
        <path d="M15 18 C15 16, 13 14, 11 14 C9 14, 7 16, 7 18 C7 20, 11 24, 11 24 C11 24, 15 20, 15 18 Z" fill="#dc2626" opacity="0.8"/>
      </g>
      
      {/* Logistics quadrant (bottom-left) */}
      <g transform="translate(15, 65)">
        <rect x="2" y="8" width="12" height="6" fill="#ea580c" opacity="0.8" rx="1"/>
        <rect x="14" y="6" width="6" height="8" fill="#ea580c" rx="1"/>
        <circle cx="6" cy="16" r="2" fill="#ea580c" opacity="0.6"/>
        <circle cx="12" cy="16" r="2" fill="#ea580c" opacity="0.6"/>
        <circle cx="17" cy="16" r="2" fill="#ea580c" opacity="0.6"/>
      </g>
      
      {/* Content Creation quadrant (bottom-right) */}
      <g transform="translate(65, 65)">
        <path d="M5 8 Q5 4, 8 4 L16 4 Q19 4, 19 8 L19 14 Q19 18, 16 18 L12 18 L10 20 L8 18 Q5 18, 5 14 Z" fill="#7c3aed" opacity="0.3"/>
        <circle cx="9" cy="10" r="1.5" fill="#7c3aed"/>
        <circle cx="13" cy="9" r="1.5" fill="#ec4899"/>
        <circle cx="16" cy="10" r="1.5" fill="#f59e0b"/>
        <circle cx="11" cy="14" r="1.5" fill="#10b981"/>
      </g>
      
      {/* Connecting lines showing integration */}
      <path d="M30 30 L50 50" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M70 30 L50 50" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M30 70 L50 50" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M70 70 L50 50" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      
      {/* Central "CMS" text */}
      <text x="50" y="55" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">CMS</text>
    </svg>
  );
};

export default UnifiedLogo;