import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/SafeThemeContext';
import DynamicLogo from './logos/DynamicLogo';
import NotificationsDropdown from './NotificationsDropdown';

const SafeNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { currentTheme, changeSector, getAllSectors } = useTheme();

  return (
    <div 
      className="navbar bg-base-100 shadow-lg transition-all duration-300"
      style={{ borderBottom: `2px solid ${currentTheme?.primary || '#1e40af'}` }}
    >
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl flex items-center gap-2">
          <DynamicLogo size={28} animated={true} />
          <span className="gradient-text">CMS Platform</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        {isAuthenticated && (
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link 
                to={`/dashboard/${user?.sector?.toLowerCase() || 'banking'}`}
                className="hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/sectors"
                className="hover:text-primary transition-colors"
              >
                Sectors
              </Link>
            </li>
            <li>
              <Link 
                to="/customers"
                className="hover:text-primary transition-colors"
              >
                Customers
              </Link>
            </li>
            {user?.role === 'ADMIN' && (
              <li>
                <Link 
                  to="/users"
                  className="hover:text-primary transition-colors"
                >
                  Users
                </Link>
              </li>
            )}
            {user?.role === 'ADMIN' && (
              <li>
                <Link
                  to="/admin/audit-logs"
                  className="hover:text-primary transition-colors"
                >
                  Audit Trail
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
      
      <div className="navbar-end">
        <div className="flex items-center gap-2">

          {/* Live notifications bell */}
          {isAuthenticated && <NotificationsDropdown />}

          {/* Sector switcher for desktop */}
          {isAuthenticated && (
            <div className="dropdown dropdown-end hidden lg:block">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-sm flex items-center gap-2">
                <DynamicLogo size={20} animated={false} />
                <span className="text-sm capitalize">{currentTheme?.name || 'Banking'}</span>
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
                      onClick={() => changeSector(sector)}
                      className="flex items-center gap-2 w-full text-left capitalize"
                    >
                      <DynamicLogo size={16} sector={sector} animated={false} />
                      {sector}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div 
                  className="w-10 rounded-full text-white flex items-center justify-center font-semibold"
                  style={{ backgroundColor: currentTheme?.primary || '#1e40af' }}
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>{user?.username}</span>
                  <span className="text-xs opacity-60">{user?.role} • {user?.sector}</span>
                </li>
                <li><Link to="/settings">Profile & Settings</Link></li>
                {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && user?.organizationId && (
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