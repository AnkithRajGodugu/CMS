import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * BankingKPICard - Premium fintech-style KPI stat card
 * @param {String} title
 * @param {String|Number} value
 * @param {ReactNode} icon - Lucide icon component
 * @param {String} iconBg - Tailwind gradient class e.g. 'from-blue-600 to-indigo-600'
 * @param {String} iconColor - text color for the icon e.g. 'text-white'
 * @param {Object} trend - { value: '+5.2%', direction: 'up'|'down'|'neutral' }
 * @param {String} subtitle
 * @param {String} borderColor - e.g. 'border-blue-500'
 */
const BankingKPICard = ({
  title,
  value,
  icon: Icon,
  iconBg = 'from-blue-600 to-indigo-700',
  iconColor = 'text-white',
  trend,
  subtitle,
  className = '',
}) => {
  const trendColor = !trend ? '' : trend.direction === 'up' ? 'text-emerald-600' : trend.direction === 'down' ? 'text-red-500' : 'text-slate-500';
  const TrendIcon = !trend ? null : trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden group ${className}`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${iconBg}`} />

      <div className="p-5 pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              {title}
            </p>
            <p className="text-3xl font-extrabold text-slate-800 leading-tight tabular-nums">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
            )}
            {trend && (
              <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
                {TrendIcon && <TrendIcon className="w-3 h-3" />}
                <span>{trend.value}</span>
              </div>
            )}
          </div>

          {Icon && (
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankingKPICard;
