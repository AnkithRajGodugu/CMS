import { Link } from 'react-router-dom';
import { useTheme } from '../context/SafeThemeContext';
import DynamicLogo from './logos/DynamicLogo';

const SimpleNavbar = () => {
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
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link 
              to="/about"
              className="hover:text-primary transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/docs"
              className="hover:text-primary transition-colors"
            >
              Documentation
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
        </ul>
      </div>
      
      <div className="navbar-end">
        <div className="flex items-center gap-2">
          {/* Sector switcher */}
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
        </div>
      </div>
    </div>
  );
};

export default SimpleNavbar;