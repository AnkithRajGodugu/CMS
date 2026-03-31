import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/SectorThemeProvider';
import { getHomeRoute, isAdmin, isManager } from '../../utils/roleUtils';
import DynamicLogo from '../logos/DynamicLogo';
import NotificationsDropdown from '../NotificationsDropdown';

const SafeNavbar = ({ hideSectorSwitcher = false }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { currentTheme, changeSector, getAllSectors } = useTheme();
  const navigate = useNavigate();

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hotkey Ctrl+K to manually focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Universal Searchable Navigation Index
  const searchablePages = [
    { name: 'Banking Dashboard', path: '/dashboard/banking', keywords: 'home overview analytics' },
    { name: 'Banking - Accounts', path: '/dashboard/banking/accounts', keywords: 'bank accounts money create' },
    { name: 'Banking - Transactions', path: '/dashboard/banking/transactions', keywords: 'transfer history transactions records' },
    { name: 'Banking - Customers', path: '/dashboard/banking/customers', keywords: 'clients users people' },
    { name: 'Healthcare Dashboard', path: '/dashboard/healthcare', keywords: 'home overview analytics doc' },
    { name: 'Healthcare - Patients', path: '/dashboard/healthcare/patients', keywords: 'patients medical health users' },
    { name: 'Healthcare - Appointments', path: '/dashboard/healthcare/appointments', keywords: 'doctor schedule calendar time' },
    { name: 'Logistics Dashboard', path: '/dashboard/logistics', keywords: 'home overview analytics' },
    { name: 'Logistics - Shipments', path: '/dashboard/logistics/shipments', keywords: 'truck delivery packages freight' },
    { name: 'Logistics - Fleet', path: '/dashboard/logistics/fleet', keywords: 'vehicles fleet trucks cars' },
    { name: 'Content Dashboard', path: '/dashboard/content', keywords: 'home overview analytics' },
    { name: 'Content - Projects', path: '/dashboard/content/projects', keywords: 'media tasks campaigns' },
    { name: 'System Users', path: '/users', keywords: 'admin system role users accounts' },
    { name: 'Audit Trails', path: '/admin/audit-logs', keywords: 'security logs tracking audit changes' },
    { name: 'Profile', path: '/user/profile', keywords: 'profile avatar 2fa security setup' },
    { name: 'Settings', path: '/settings', keywords: 'password settings config account editing' },
  ];

  const searchResults = searchablePages.filter(page => 
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    page.keywords.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="navbar bg-base-100 shadow-lg transition-all duration-300 z-50 relative"
      style={{ borderBottom: `2px solid ${currentTheme?.primary || '#1e40af'}` }}
    >
      <div className="navbar-start">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden mr-2">
            <label htmlFor="mobile-sidebar-drawer" className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </label>
        </div>
        <Link to="/" className="btn btn-ghost text-xl flex items-center gap-2">
          <DynamicLogo size={28} animated={true} />
          <span className="gradient-text hidden sm:inline">CMS Platform</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        {isAuthenticated && (
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link 
                to={getHomeRoute(user, currentTheme?.id || 'banking')}
                className="hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </li>


            {isAdmin(user) && (
              <li>
                <Link 
                  to="/users"
                  className="hover:text-primary transition-colors"
                >
                  Users
                </Link>
              </li>
            )}
            {isAdmin(user) && (
              <li>
                <Link
                  to="/admin/audit-logs"
                  className="hover:text-primary transition-colors"
                >
                  Audit Trail
                </Link>
              </li>
            )}
            {(isAdmin(user) || isManager(user)) && (
              <li>
                <Link
                  to="/admin/webhooks"
                  className="hover:text-primary transition-colors"
                >
                  Webhooks
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
      
      <div className="navbar-end">
        <div className="flex items-center gap-2">

          {/* Global Search Bar */}
          {isAuthenticated && (
            <div className="hidden md:flex relative mr-1 group z-[100]" ref={searchRef}>
              <input 
                id="global-search-input"
                type="text" 
                autoComplete="off"
                placeholder="Search everywhere..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(e.target.value.length > 0);
                }}
                onFocus={() => { if(searchQuery.length > 0) setIsSearchOpen(true); }}
                className="input input-sm input-bordered w-48 focus:w-64 transition-all duration-300 rounded-full bg-base-200/50 pr-8 border-transparent focus:border-primary/50"
              />
              
              {!searchQuery && (
                <div className="absolute right-2 top-1.5 opacity-50 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer pointer-events-none">
                  <kbd className="kbd kbd-xs bg-base-300 shadow-none border-none">Ctrl</kbd>
                  <kbd className="kbd kbd-xs bg-base-300 shadow-none border-none">K</kbd>
                </div>
              )}

              {/* Search Results Dropdown Palette */}
              {isSearchOpen && (
                <ul className="absolute top-10 right-0 w-72 bg-base-100 shadow-2xl rounded-xl z-[150] p-2 max-h-80 overflow-y-auto border border-base-300 animate-in fade-in slide-in-from-top-2 duration-200">
                  <li className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-base-content/50 border-b border-base-200 mb-1">
                    Quick Navigation
                  </li>
                  
                  {searchResults.length > 0 ? (
                    searchResults.map((result, idx) => (
                      <li key={idx}>
                        <button 
                          className="w-full text-left px-3 py-2.5 hover:bg-base-200 rounded-lg text-sm font-medium transition-colors flex flex-col gap-0.5"
                          onClick={() => {
                            navigate(result.path);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          {result.name}
                          <span className="text-xs font-normal opacity-50 block">{result.path}</span>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-6 text-center">
                      <p className="text-sm font-semibold">No matches found</p>
                      <p className="text-xs opacity-60">Try searching for "patients" or "shipments"</p>
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}

          {/* Live notifications bell */}
          {isAuthenticated && <NotificationsDropdown />}

          {isAuthenticated ? (
            <div className="dropdown dropdown-end ml-1">
              <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle avatar ${!user?.avatarUrl ? 'placeholder' : ''}`}>
                <div 
                  className={`w-10 rounded-full flex items-center justify-center font-bold text-lg text-white`}
                  style={{ backgroundColor: user?.avatarUrl ? 'transparent' : (currentTheme?.primary || '#1e40af') }}
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="User" />
                  ) : (
                    <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>{user?.username}</span>
                  <span className="text-xs opacity-60">{user?.role} • {user?.sector}</span>
                </li>
                <li><Link to="/user/profile">Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                {(isAdmin(user) || isManager(user)) && user?.organizationId && (
                  <li><Link to="/organization-settings">Organization Settings</Link></li>
                )}
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
                className="btn text-white"
                style={{ backgroundColor: currentTheme?.primary || '#1e40af' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafeNavbar;