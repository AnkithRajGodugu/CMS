import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/SectorThemeProvider';
import { getSectorNavItems } from '../../utils/roleUtils';
import { useState } from 'react';
import * as FaIcons from 'react-icons/fa';

const SectorIcon = ({ iconName, className }) => {
    const Icon = FaIcons[iconName];
    if (!Icon) return <span className="w-4 h-4 inline-block" />;
    return <Icon className={className} />;
};

const Sidebar = () => {
    const { user } = useAuth();
    const { currentTheme, currentSector } = useTheme();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Derive sector from URL path so the sidebar always matches the current
    // dashboard section, regardless of what's stored in the auth context.
    // Admin routes: /dashboard/{sector}/...  User routes: /user/{sector}/...
    const pathParts = location.pathname.split('/').filter(Boolean);
    // pathParts[0] is 'dashboard' or 'user', pathParts[1] is the sector
    const urlSector = pathParts[1] || null;
    const activeSector = urlSector || currentSector;

    const navItems = getSectorNavItems(activeSector, user?.role);

    const sectorKey = (typeof currentSector === 'string'
        ? currentSector
        : currentSector?.code || ''
    ).toLowerCase();

    const primaryColor = currentTheme?.primary || '#3b82f6';

    // Derive a subtle sidebar accent from primary
    const sidebarStyle = {
        borderRight: `1px solid ${primaryColor}22`,
    };

    return (
        <aside
            className={`h-full flex flex-col transition-all duration-300 ease-in-out relative
                bg-base-100 ${collapsed ? 'w-[68px]' : 'w-64'}`}
            style={sidebarStyle}
        >
            {/* Subtle top accent line */}
            <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-b-full opacity-60"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}44)` }}
            />

            {/* Collapse Toggle */}
            <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'} px-3 pt-3 pb-1`}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="btn btn-ghost btn-square btn-xs opacity-50 hover:opacity-100 transition-opacity"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.8} stroke="currentColor"
                        className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                    </svg>
                </button>
            </div>

            {/* Nav Items */}
            <ul className="flex flex-col gap-0.5 px-2 flex-1 overflow-y-auto overflow-x-hidden mt-1 pb-2">
                {navItems.map(item => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            end={item.path.split('/').length <= 3}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) =>
                                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                                    isActive
                                        ? 'text-white font-semibold shadow-sm'
                                        : 'text-base-content/70 hover:text-base-content hover:bg-base-200/80'
                                } ${collapsed ? 'justify-center' : ''}`
                            }
                            style={({ isActive }) =>
                                isActive
                                    ? {
                                        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                                        boxShadow: `0 2px 12px ${primaryColor}44`,
                                    }
                                    : {}
                            }
                        >
                            {/* Icon */}
                            <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                <SectorIcon iconName={item.icon} className="w-4 h-4" />
                            </span>

                            {/* Label */}
                            {!collapsed && (
                                <span className="whitespace-nowrap truncate tracking-wide">
                                    {item.label}
                                </span>
                            )}

                            {/* Collapsed tooltip */}
                            {collapsed && (
                                <span className="
                                    absolute left-full ml-3 z-50 px-2.5 py-1.5
                                    bg-base-300 text-base-content text-xs font-medium
                                    rounded-lg shadow-lg whitespace-nowrap
                                    opacity-0 pointer-events-none
                                    group-hover:opacity-100 transition-opacity duration-150
                                ">
                                    {item.label}
                                </span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Divider */}
            <div
                className="mx-3 mb-2 h-px opacity-30"
                style={{ background: `linear-gradient(90deg, transparent, ${primaryColor}88, transparent)` }}
            />

            {/* Bottom User Info */}
            {user && (
                <div className={`px-3 pb-4 ${collapsed ? 'flex justify-center' : ''}`}>
                    {collapsed ? (
                        /* Collapsed: just avatar */
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}aa)` }}
                            title={user.username || user.name}
                        >
                            {(user.username || user.name || 'U')[0].toUpperCase()}
                        </div>
                    ) : (
                        /* Expanded: full user card */
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-base-200/60 hover:bg-base-200 transition-colors">
                            <div
                                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}aa)` }}
                            >
                                {(user.username || user.name || 'U')[0].toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold truncate leading-tight">
                                    {user.username || user.name}
                                </p>
                                <p className="text-[10px] text-base-content/45 truncate capitalize mt-0.5">
                                    {(user.role || '').toLowerCase().replace('role_', '')}
                                    {sectorKey ? ` · ${sectorKey}` : ''}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
