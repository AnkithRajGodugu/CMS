import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatCard - Display metric cards with optional trend indicators
 * @param {String} title - Card title
 * @param {String|Number} value - Main metric value
 * @param {String} subtitle - Optional subtitle or description
 * @param {Object} trend - Trend data {value, direction: 'up'|'down'|'neutral'}
 * @param {ReactNode} icon - Optional icon component
 * @param {String} variant - Color variant: 'primary'|'secondary'|'success'|'warning'|'error'
 */
const StatCard = ({ 
  title, 
  value, 
  subtitle,
  trend,
  icon: Icon,
  variant = 'primary',
  className = ''
}) => {
  
  const variantClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info',
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-base-content/60';
    }
  };

  return (
    <div className={`card bg-base-100 shadow-lg hover:shadow-xl transition-shadow ${className}`}>
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-base-content/60 uppercase tracking-wide">
              {title}
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-base-content">
                {value}
              </p>
              {trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span>{trend.value}</span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className="mt-2 text-sm text-base-content/60">
                {subtitle}
              </p>
            )}
          </div>
          
          {Icon && (
            <div className={`p-3 rounded-lg ${variantClasses[variant]}`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
