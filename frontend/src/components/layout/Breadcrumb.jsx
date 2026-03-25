import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/SectorThemeProvider';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  const { currentTheme } = useTheme();
  
  // Generate breadcrumb items from URL path
  const generateBreadcrumbs = () => {
    if (customItems) return customItems;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Format segment name
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Special cases for better naming
      const specialCases = {
        'banking-&-finance': 'Banking & Finance',
        'logistics-&-supply': 'Logistics & Supply',
        'content-creation': 'Content Creation',
        'healthcare': 'Healthcare'
      };
      
      if (specialCases[segment]) {
        label = specialCases[segment];
      }
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <div className="breadcrumbs text-sm py-2 px-4 bg-base-200">
      <ul>
        {breadcrumbs.map((item, index) => (
          <li key={index}>
            {item.isLast ? (
              <span 
                className="font-semibold"
                style={{ color: currentTheme.colors.primary }}
              >
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.path}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumb;