import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/SafeThemeContext';
import { useSector } from '../../hooks/useSector';
import DynamicLogo from '../logos/DynamicLogo';

const EnhancedHeader = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { currentTheme, changeSector, getAllSectors } = useTheme();
  const { getSectorDisplayName } = useSector();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSectorChange = (sector) => {
    changeSector(sector);
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search query:', searchQuery);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const isActivePath = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className="navbar bg-base-100 shadow-lg sticky top-0 z-50 transition-all duration-300"
      style={{ 
        borderBottom: `2px solid ${currentTheme.colors.primary}`,
        backgroundColor: currentTheme.colors.surface 
      }}
    >
      {/* Mobile menu button */}
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          {isMenuOpen && (
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64">
              {/* Mobile navigation items */}
              {isAuthenticated && (
                <>
                  <li className="menu-title">
                    <span>Navigation</span>
                  </li>
                  <li>
                    <Link 
                      to={`/dashboard/${user?.sector?.toLowerCase() || 'banking'}`}
                      className={isActivePath('/dashboard') ? 'active' : ''}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/sectors"
                      className={isActivePath('/sectors') ? 'active' : ''}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sectors
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/customers"
                      className={isActivePath('/customers') ? 'active' : ''}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Customers
                    </Link>
                  </li>
                  {user?.role === 'ADMIN' && (
                    <li>
                      <Link 
                        to="/users"
                        className={isActivePath('/users') ? 'active' : ''}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Users
                      </Link>
                    </li>
                  )}
                  
                  <li className="menu-title mt-4">
                    <span>Switch Sector</span>
                  </li>
                  {getAllSectors().map(sector => (
                    <li key={sector}>
                      <button 
                        onClick={() => handleSectorChange(sector)}
                        className="flex items-center gap-2"
                      >
                        <DynamicLogo size={16} sector={sector} animated={false} />
                        {getSectorDisplayName(sector)}
                      </button>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </div>
        
        {/* Logo and brand */}
        <Link to="/" className="btn btn-ghost text-xl font-bold flex items-center gap-2">
          <DynamicLogo size={32} animated={true} />
          <span className="gradient-text">CMS Platform</span>
        </Link>
      </div>
      
      {/* Desktop navigation */}
      <div className="navbar-center hidden lg:flex">
        {isAuthenticated && (
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link 
                to={`/dashboard/${user?.sector?.toLowerCase() || 'banking'}`}
                className={`hover:text-primary transition-colors ${isActivePath('/dashboard') ? 'text-primary font-semibold' : ''}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/sectors"
                className={`hover:text-primary transition-colors ${isActivePath('/sectors') ? 'text-primary font-semibold' : ''}`}
              >
                Sectors
              </Link>
            </li>
            <li>
              <Link 
                to="/customers"
                className={`hover:text-primary transition-colors ${isActivePath('/customers') ? 'text-primary font-semibold' : ''}`}
              >
                Customers
              </Link>
            </li>
            {user?.role === 'ADMIN' && (
              <li>
                <Link 
                  to="/users"
                  className={`hover:text-primary transition-colors ${isActivePath('/users') ? 'text-primary font-semibold' : ''}`}
                >
                  Users
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
      
      {/* Right side actions */}
      <div className="navbar-end">
        <div className="flex items-center gap-2">
          {/* Search */}
          {isAuthenticated && (
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-circle"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {isSearchOpen && (
                <div tabIndex={0} className="dropdown-content mt-3 z-[1] p-4 shadow bg-base-100 rounded-box w-80">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="input input-bordered flex-1"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="btn btn-primary">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Sector switcher for desktop */}
          {isAuthenticated && (
            <div className="dropdown dropdown-end hidden lg:block">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm flex items-center gap-2">
                <DynamicLogo size={20} animated={false} />
                <span className="text-sm">{getSectorDisplayName(user?.sector?.toLowerCase() || 'banking')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ul tabIndex={0} className="dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>Switch Sector</span>
                </li>
                {getAllSectors().map(sector => (
                  <li key={sector}>
                    <button 
                      onClick={() => handleSectorChange(sector)}
                      className="flex items-center gap-2 w-full text-left"
                    >
                      <DynamicLogo size={16} sector={sector} animated={false} />
                      {getSectorDisplayName(sector)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* User menu or auth buttons */}
          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div 
                  className="w-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>{user?.username}</span>
                  <span className="text-xs opacity-60">{user?.role} • {user?.sector}</span>
                </li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><hr className="my-2" /></li>
                <li>
                  <button 
                    onClick={logout}
                    className="text-error hover:bg-error hover:text-error-content"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn btn-primary"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;