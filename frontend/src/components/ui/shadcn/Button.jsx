import React from 'react';
import { useTheme } from '../../../context/SectorThemeProvider';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  disabled = false,
  onClick,
  ...props 
}) => {
  const { currentTheme } = useTheme();

  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    default: `text-white shadow hover:opacity-90`,
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: `border border-input hover:bg-accent hover:text-accent-foreground`,
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary'
  };

  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md'
  };

  const variantStyles = variant === 'default' 
    ? { backgroundColor: currentTheme.colors.primary }
    : variant === 'outline'
    ? { borderColor: currentTheme.colors.primary, color: currentTheme.colors.primary }
    : {};

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variantStyles}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;