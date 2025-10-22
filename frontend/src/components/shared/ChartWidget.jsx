import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * ChartWidget - Reusable chart component using Chart.js
 * @param {String} type - Chart type: 'line'|'bar'|'pie'|'doughnut'
 * @param {Object} data - Chart data in Chart.js format
 * @param {Object} options - Chart options (optional)
 * @param {String} title - Chart title
 * @param {String} subtitle - Chart subtitle
 * @param {String} height - Chart height (default: '300px')
 */
const ChartWidget = ({ 
  type = 'line',
  data,
  options = {},
  title,
  subtitle,
  height = '300px',
  className = ''
}) => {
  
  // Default options
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: type !== 'pie' && type !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    } : undefined
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins
    }
  };

  const renderChart = () => {
    const chartProps = {
      data,
      options: mergedOptions
    };

    switch (type) {
      case 'bar':
        return <Bar {...chartProps} />;
      case 'pie':
        return <Pie {...chartProps} />;
      case 'doughnut':
        return <Doughnut {...chartProps} />;
      case 'line':
      default:
        return <Line {...chartProps} />;
    }
  };

  return (
    <div className={`card bg-base-100 shadow-lg ${className}`}>
      <div className="card-body">
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-bold text-base-content">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-base-content/60 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div style={{ height }}>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

// Helper function to generate common color palettes
export const chartColors = {
  primary: [
    'rgba(59, 130, 246, 0.8)',
    'rgba(37, 99, 235, 0.8)',
    'rgba(29, 78, 216, 0.8)',
    'rgba(30, 64, 175, 0.8)',
  ],
  success: [
    'rgba(16, 185, 129, 0.8)',
    'rgba(5, 150, 105, 0.8)',
    'rgba(4, 120, 87, 0.8)',
    'rgba(6, 95, 70, 0.8)',
  ],
  warning: [
    'rgba(245, 158, 11, 0.8)',
    'rgba(217, 119, 6, 0.8)',
    'rgba(180, 83, 9, 0.8)',
    'rgba(146, 64, 14, 0.8)',
  ],
  error: [
    'rgba(239, 68, 68, 0.8)',
    'rgba(220, 38, 38, 0.8)',
    'rgba(185, 28, 28, 0.8)',
    'rgba(153, 27, 27, 0.8)',
  ],
  mixed: [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)',
  ]
};

export default ChartWidget;
