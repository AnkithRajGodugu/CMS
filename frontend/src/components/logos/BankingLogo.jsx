import React from 'react';

const BankingLogo = ({ size = 40, className = '', animated = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} ${animated ? 'animate-fade-in' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bank building structure */}
      <rect x="20" y="30" width="60" height="50" fill="currentColor" opacity="0.1" rx="2"/>
      
      {/* Columns */}
      <rect x="25" y="35" width="6" height="40" fill="currentColor" rx="1"/>
      <rect x="37" y="35" width="6" height="40" fill="currentColor" rx="1"/>
      <rect x="49" y="35" width="6" height="40" fill="currentColor" rx="1"/>
      <rect x="61" y="35" width="6" height="40" fill="currentColor" rx="1"/>
      <rect x="73" y="35" width="6" height="40" fill="currentColor" rx="1"/>
      
      {/* Roof/Triangle */}
      <path d="M15 30 L50 15 L85 30 Z" fill="currentColor"/>
      
      {/* Steps */}
      <rect x="15" y="75" width="70" height="4" fill="currentColor" opacity="0.8"/>
      <rect x="18" y="79" width="64" height="3" fill="currentColor" opacity="0.6"/>
      <rect x="21" y="82" width="58" height="3" fill="currentColor" opacity="0.4"/>
      
      {/* Door */}
      <rect x="45" y="60" width="10" height="15" fill="currentColor" opacity="0.3" rx="1"/>
      
      {/* Dollar sign overlay */}
      <circle cx="75" cy="25" r="8" fill="var(--color-accent, #f59e0b)" opacity="0.9"/>
      <text x="75" y="30" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">$</text>
    </svg>
  );
};

export default BankingLogo;