import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * SectorHeader - Header component with sector branding and user controls
 * Features: sector logo, user profile dropdown, notifications, sidebar toggle
 */
const SectorHeader = ({ sector, onToggleSidebar, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSectorIcon = (sectorCode) => {
    const icons = {
      banking: '🏦',
      healthcare: '🏥',
      education: '🎓',
      retail: '🛒',
      manufacturing: '🏭',
      logistics: '📦',
      content: '✍️'
    };
    return icons[sectorCode?.toLowerCase()] || '📊';
  };

  return (
    <header 
      className="bg-base-100 shadow-md sticky top-0 z-50"
      role="banner"
    >
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Section: Menu Toggle & Sector Branding */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="btn btn-ghost btn-sm md:btn-md"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!sidebarCollapsed}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Sector Branding */}
          <div className="flex items-center gap-3">
            <span 
              className="text-2xl md:text-3xl" 
              role="img" 
              aria-label={`${sector?.name} icon`}
            >
              {getSectorIcon(sector?.code)}
            </span>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-primary">
                {sector?.name || 'CMS'}
              </h1>
              <p className="text-xs text-base-content/60">
                {sector?.description || 'Content Management System'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle btn-sm md:btn-md relative"
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>
            {showNotifications && (
              <div 
                tabIndex={0} 
                className="dropdown-content mt-3 z-[1] card card-compact w-64 md:w-80 p-2 shadow-lg bg-base-100"
              >
                <div className="card-body">
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <div className="divider my-1"></div>
                  <div className="space-y-2">
                    <div className="p-2 hover:bg-base-200 rounded-lg cursor-pointer">
                      <p className="text-sm font-medium">System Update</p>
                      <p className="text-xs text-base-content/60">New features available</p>
                    </div>
                    <div className="p-2 hover:bg-base-200 rounded-lg cursor-pointer">
                      <p className="text-sm font-medium">Welcome!</p>
                      <p className="text-xs text-base-content/60">Get started with your dashboard</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-sm md:btn-md gap-2"
              aria-label="User menu"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                  <span className="text-xs">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <span className="hidden md:inline-block font-medium">
                {user?.username || 'User'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showUserMenu && (
              <ul 
                tabIndex={0} 
                className="dropdown-content mt-3 z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52"
              >
                <li className="menu-title">
                  <span>Account</span>
                </li>
                <li>
                  <a className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </a>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <a 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-error"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SectorHeader;
