import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl">
          CMS Platform
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
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
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
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-outline">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;