import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/SectorThemeProvider';
import { getSectorNavItems } from '../../utils/roleUtils';
import { useState } from 'react';

const Sidebar = () => {
    const { user } = useAuth();
    const { currentTheme, currentSector } = useTheme();
    
    // Pass currentSector and user.role to get role-filtered links
    const navItems = getSectorNavItems(currentSector, user?.role);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside 
            className={`bg-base-100 border-r min-h-[calc(100vh-4rem)] p-4 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}
            style={{ 
                borderColor: currentTheme?.primary ? `${currentTheme.primary}40` : 'var(--color-border)',
                borderRightWidth: '1px'
            }}
        >
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setCollapsed(!collapsed)}
                    className="btn btn-ghost btn-square btn-sm"
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                    </svg>
                </button>
            </div>

            <ul className="menu gap-1 px-0">
                {navItems.map(item => (
                    <li key={item.path}>
                        <NavLink 
                            to={item.path} 
                            className={({ isActive }) => 
                                `rounded-lg ${isActive ? 'bg-primary/10 text-primary font-medium border-l-4' : 'hover:bg-base-200'}`
                            }
                            style={({ isActive }) => 
                                isActive ? { borderLeftColor: currentTheme?.primary } : {}
                            }
                        >
                            <span className="flex items-center gap-3">
                                {/* Generic icon placeholder if no icon maps exist yet */}
                                <div className="w-5 h-5 opacity-70">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path fillRule="evenodd" d="M11.097 1.515a.75.75 0 01.589.882L10.666 7.5h4.47l1.079-5.397a.75.75 0 111.47.294L16.665 7.5h3.585a.75.75 0 010 1.5h-3.885l-1.2 6h3.585a.75.75 0 010 1.5h-3.885l-1.08 5.397a.75.75 0 11-1.47-.294l1.02-5.103h-4.47l-1.08 5.397a.75.75 0 01-1.47-.294l1.02-5.103H3.75a.75.75 0 110-1.5h3.885l1.2-6H5.25a.75.75 0 010-1.5h3.885l1.08-5.397a.75.75 0 01.882-.588zM10.365 9l-1.2 6h4.47l1.2-6h-4.47z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            </span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
