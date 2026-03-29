import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/SectorThemeProvider';
import { getSectorNavItems } from '../../utils/roleUtils';
import { useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Sector accent colors for the sidebar header badge
const SECTOR_COLORS = {
    banking:    { bg: 'bg-blue-600',   text: 'text-white', label: '🏦 Banking' },
    healthcare: { bg: 'bg-emerald-600',text: 'text-white', label: '🏥 Healthcare' },
    logistics:  { bg: 'bg-amber-500',  text: 'text-white', label: '🚚 Logistics' },
    content:    { bg: 'bg-purple-600', text: 'text-white', label: '✏️ Content' },
};

const SectorIcon = ({ iconName, className }) => {
    const Icon = FaIcons[iconName];
    if (!Icon) return <span className="w-5 h-5 inline-block" />;
    return <Icon className={className} />;
};

const Sidebar = () => {
    const { user } = useAuth();
    const { currentTheme, currentSector } = useTheme();
    const navItems = getSectorNavItems(currentSector, user?.role);
    const [collapsed, setCollapsed] = useState(false);

    const sectorKey = (typeof currentSector === 'string'
        ? currentSector
        : currentSector?.code || ''
    ).toLowerCase();

    const sectorMeta = SECTOR_COLORS[sectorKey] || { bg: 'bg-base-300', text: 'text-base-content', label: 'Dashboard' };

    return (
        <aside
            className={`bg-base-100 border-r min-h-[calc(100vh-4rem)] flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
            style={{
                borderColor: currentTheme?.primary ? `${currentTheme.primary}40` : 'var(--color-border)',
                borderRightWidth: '1px',
            }}
        >
            {/* Sector Badge Header */}
            {!collapsed && (
                <div className={`${sectorMeta.bg} ${sectorMeta.text} px-4 py-3 text-sm font-semibold tracking-wide rounded-none`}>
                    {sectorMeta.label}
                </div>
            )}

            {/* Collapse Toggle */}
            <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'} p-2`}>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="btn btn-ghost btn-square btn-sm"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor"
                        className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                    </svg>
                </button>
            </div>

            {/* Nav Items */}
            <ul className="menu gap-0.5 px-2 flex-1">
                {navItems.map(item => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            end={item.path.split('/').length <= 3}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) =>
                                `rounded-lg flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                                    isActive
                                        ? 'bg-primary/10 text-primary font-semibold border-l-4'
                                        : 'hover:bg-base-200 text-base-content/80'
                                }`
                            }
                            style={({ isActive }) =>
                                isActive ? { borderLeftColor: currentTheme?.primary || '#3b82f6' } : {}
                            }
                        >
                            {/* Icon */}
                            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                <SectorIcon iconName={item.icon} className="w-4 h-4" />
                            </span>
                            {/* Label */}
                            {!collapsed && (
                                <span className="whitespace-nowrap truncate">{item.label}</span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Bottom User Info */}
            {!collapsed && user && (
                <div className="p-3 border-t border-base-200 mt-auto">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="avatar placeholder flex-shrink-0">
                            <div className="bg-primary text-primary-content rounded-full w-8">
                                <span className="text-xs font-bold">
                                    {(user.username || user.name || 'U')[0].toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{user.username || user.name}</p>
                            <p className="text-xs text-base-content/50 truncate capitalize">{(user.role || '').toLowerCase()}</p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
