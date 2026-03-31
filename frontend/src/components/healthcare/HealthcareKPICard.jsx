import React from 'react';

/**
 * HealthcareKPICard - Clean medical-grade KPI stat card
 * @param {String} title
 * @param {String|Number} value
 * @param {ReactNode} icon - Lucide icon component
 * @param {String} accentColor - Tailwind border+icon color class, e.g. 'border-teal-500 text-teal-600'
 * @param {String} bgAccent - Icon bg, e.g. 'bg-teal-50'
 * @param {String} subtitle
 * @param {Boolean} loading
 */
const HealthcareKPICard = ({
  title,
  value,
  icon: Icon,
  accentColor = 'border-teal-500',
  bgAccent = 'bg-teal-50',
  iconColor = 'text-teal-600',
  subtitle,
  loading = false,
  className = '',
}) => {
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 ${accentColor} flex items-start gap-4 p-5 ${className}`}
    >
      {Icon && (
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${bgAccent} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 truncate">
          {title}
        </p>
        {loading ? (
          <div className="mt-1 h-8 w-16 bg-slate-100 animate-pulse rounded" />
        ) : (
          <p className="text-3xl font-extrabold text-slate-800 tabular-nums leading-tight mt-0.5">
            {value}
          </p>
        )}
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-400 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default HealthcareKPICard;
