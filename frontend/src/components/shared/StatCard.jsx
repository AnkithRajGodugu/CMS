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
 * @param {Boolean} loading - Show skeleton loader
 */
const StatCard = ({ 
  title, 
  value, 
  subtitle,
  trend,
  icon: Icon,
  variant = 'primary',
  className = '',
  loading = false,
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
      case 'up':   return <TrendingUp className="w-3.5 h-3.5" />;
      case 'down': return <TrendingDown className="w-3.5 h-3.5" />;
      default:     return <Minus className="w-3.5 h-3.5" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up':   return 'text-success';
      case 'down': return 'text-error';
      default:     return 'text-base-content/60';
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`card bg-base-100 shadow-lg ${className}`}>
        <div className="card-body gap-3 p-4 md:p-6">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-8 w-16 rounded" />
          <div className="skeleton h-3 w-32 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={`card bg-base-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ${className}`}>
      <div className="card-body p-4 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xs md:text-sm font-semibold text-base-content/50 uppercase tracking-wider truncate">
              {title}
            </h3>
            <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
              <p className="text-2xl md:text-3xl font-bold text-base-content tabular-nums">
                {value}
              </p>
              {trend && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span>{trend.value}</span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className="mt-1.5 text-xs md:text-sm text-base-content/50 line-clamp-2">
                {subtitle}
              </p>
            )}
          </div>
          
          {Icon && (
            <div className={`p-2.5 md:p-3 rounded-xl flex-shrink-0 ${variantClasses[variant]}`}>
              <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
