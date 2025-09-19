import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/SafeThemeContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { currentTheme } = useTheme();

  return (
    <div 
      className="navbar bg-base-100 shadow-lg transition-all duration-300"
      style={{ borderBottom: `2px solid ${currentTheme?.primary || '#1e40af'}` }}
    >
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          <span className="gradient-text">CMS Platform</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        {isAuthenticated && (
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to={`/dashboard/${user?.sector?.toLowerCase() || 'banking'}`}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/sectors">Sectors</Link>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
            {user?.role === 'ADMIN' && (
              <li>
                <Link to="/users">Users</Link>
              </li>
            )}
          </ul>
        )}
      </div>
      
      <div className="navbar-end">
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
              <li><a>Profile</a></li>
              <li><a>Settings</a></li>
              <li><button onClick={logout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <div className="space-x-2">
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
  );
};

export default Navbar;