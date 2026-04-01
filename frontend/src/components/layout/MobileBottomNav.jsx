import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/SectorThemeProvider';
import { getHomeRoute } from '../../utils/roleUtils';

const MobileBottomNav = ({ onSearchOpen, drawerId = 'mobile-sidebar-drawer', onMenuOpen }) => {
    const { user } = useAuth();
    const { currentTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const primary = currentTheme?.primary || '#1e40af';
    const homeRoute = getHomeRoute(user, currentTheme?.id || 'banking');

    // Derive active section from path
    const path = location.pathname;
    const isHome = path === homeRoute || path.startsWith('/dashboard') || path.startsWith('/user/');
    const isNotif = path === '/notifications';
    const isProfile = path === '/user/profile' || path === '/settings';

    const navBtnBase = `
        flex flex-col items-center justify-center flex-1 gap-1 py-2 text-[10px] font-semibold
        transition-all duration-200 relative
    `;

    const iconBox = (active) => `
        w-10 h-7 flex items-center justify-center rounded-xl transition-all duration-200
        ${active ? 'scale-110' : ''}
    `;

    return (
        <nav
            className="mobile-bottom-nav lg:hidden bg-base-100/95 shadow-[0_-4px_24px_rgba(0,0,0,0.12)]"
            role="navigation"
            aria-label="Mobile navigation"
        >
            {/* Active indicator line at top */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${primary}, transparent)` }}
            />

            <div className="flex items-center w-full h-full px-1">

                {/* Home */}
                <button
                    onClick={() => navigate(homeRoute)}
                    className={navBtnBase}
                    style={{ color: isHome ? primary : undefined }}
                    aria-label="Home"
                >
                    <div className={iconBox(isHome)} style={isHome ? { background: `${primary}18` } : {}}>
                        <svg className="w-5 h-5" fill={isHome ? primary : 'currentColor'} viewBox="0 0 24 24">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                    </div>
                    <span style={{ color: isHome ? primary : undefined, opacity: isHome ? 1 : 0.5 }}>Home</span>
                </button>

                {/* Search */}
                <button
                    onClick={onSearchOpen}
                    className={navBtnBase}
                    aria-label="Search"
                >
                    <div className={iconBox(false)}>
                        <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                                d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                        </svg>
                    </div>
                    <span className="opacity-50">Search</span>
                </button>

                {/* Notifications */}
                <NavLink
                    to="/notifications"
                    className={navBtnBase}
                    style={{ color: isNotif ? primary : undefined }}
                    aria-label="Notifications"
                >
                    <div className={iconBox(isNotif)} style={isNotif ? { background: `${primary}18` } : {}}>
                        <svg className="w-5 h-5" fill={isNotif ? primary : 'none'} stroke={isNotif ? primary : 'currentColor'}
                            strokeWidth={isNotif ? 0 : 2.2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <span style={{ opacity: isNotif ? 1 : 0.5 }}>Alerts</span>
                </NavLink>

                {/* Profile */}
                <NavLink
                    to="/user/profile"
                    className={navBtnBase}
                    style={{ color: isProfile ? primary : undefined }}
                    aria-label="Profile"
                >
                    <div className={iconBox(isProfile)} style={isProfile ? { background: `${primary}18` } : {}}>
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="avatar"
                                className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{ background: isProfile ? primary : `${primary}66` }}
                            >
                                {(user?.username || 'U')[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    <span style={{ opacity: isProfile ? 1 : 0.5 }}>Profile</span>
                </NavLink>

                {/* Menu — opens sidebar */}
                <button
                    onClick={onMenuOpen}
                    className={navBtnBase + ' cursor-pointer'}
                    aria-label="Open menu"
                >
                    <div className={iconBox(false)}>
                        <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <span className="opacity-50">Menu</span>
                </button>

            </div>
        </nav>
    );
};

export default MobileBottomNav;
