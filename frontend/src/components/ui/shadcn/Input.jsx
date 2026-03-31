import React from 'react';
import { useTheme } from '../../../context/SectorThemeProvider';

const Input = ({ 
  type = 'text', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const { currentTheme } = useTheme();

  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{ 
        borderColor: currentTheme.colors.border,
        '--tw-ring-color': currentTheme.colors.primary
      }}
      disabled={disabled}
      {...props}
    />
  );
};

export default Input;