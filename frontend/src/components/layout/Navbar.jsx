import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/SectorThemeProvider';
import { getHomeRoute, isAdmin, isManager, isSuperAdmin, isUser } from '../../utils/roleUtils';
import DynamicLogo from '../logos/DynamicLogo';
import NotificationsDropdown from '../NotificationsDropdown';

const SafeNavbar = ({ hideSectorSwitcher = false }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { currentTheme, changeSector, getAllSectors } = useTheme();
  const navigate = useNavigate();

  // ── Search State ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]   = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeIdx, setActiveIdx]       = useState(0);
  const searchRef    = useRef(null);
  const inputRef     = useRef(null);
  const resultsRef   = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const openSearch  = () => { setIsSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 50); };
  const closeSearch = () => { setIsSearchOpen(false); setSearchQuery(''); setActiveIdx(0); };

  // ── Searchable Pages (role-aware) ────────────────────────────────────────
  const allPages = [
    // Sector dashboards – admin
    { name: 'Banking Dashboard',       path: '/dashboard/banking',               icon: '🏦', category: 'Banking',    keywords: 'overview analytics home banking', adminOnly: false },
    { name: 'Banking · Accounts',      path: '/dashboard/banking/accounts',      icon: '💳', category: 'Banking',    keywords: 'accounts money create bank', adminOnly: false },
    { name: 'Banking · Transactions',  path: '/dashboard/banking/transactions',  icon: '🔄', category: 'Banking',    keywords: 'transfer history records transactions', adminOnly: false },
    { name: 'Banking · Customers',     path: '/dashboard/banking/customers',     icon: '👥', category: 'Banking',    keywords: 'clients users people customers', adminOnly: false },
    { name: 'Banking · Compliance',    path: '/dashboard/banking/compliance',    icon: '🛡️', category: 'Banking',    keywords: 'compliance rules risk banking', adminOnly: true },
    { name: 'Healthcare Dashboard',    path: '/dashboard/healthcare',            icon: '🏥', category: 'Healthcare', keywords: 'overview analytics home healthcare', adminOnly: false },
    { name: 'Healthcare · Patients',   path: '/dashboard/healthcare/patients',   icon: '🧑‍⚕️', category: 'Healthcare', keywords: 'patients medical health users', adminOnly: false },
    { name: 'Healthcare · Appointments', path: '/dashboard/healthcare/appointments', icon: '📅', category: 'Healthcare', keywords: 'doctor schedule calendar appointments', adminOnly: false },
    { name: 'Healthcare · Insurance',  path: '/dashboard/healthcare/insurance',  icon: '📋', category: 'Healthcare', keywords: 'insurance claims billing coverage', adminOnly: true },
    { name: 'Logistics Dashboard',     path: '/dashboard/logistics',             icon: '🚚', category: 'Logistics',  keywords: 'overview analytics home logistics', adminOnly: false },
    { name: 'Logistics · Tracking',    path: '/dashboard/logistics/tracking',    icon: '📍', category: 'Logistics',  keywords: 'track shipment delivery packages', adminOnly: false },
    { name: 'Logistics · Inventory',   path: '/dashboard/logistics/inventory',   icon: '📦', category: 'Logistics',  keywords: 'inventory stock warehouse', adminOnly: false },
    { name: 'Content Dashboard',       path: '/dashboard/content',               icon: '✏️', category: 'Content',    keywords: 'overview analytics home content', adminOnly: false },
    { name: 'Content · Projects',      path: '/dashboard/content/projects',      icon: '🗂️', category: 'Content',    keywords: 'media tasks campaigns projects', adminOnly: false },
    // Platform admin
    { name: 'User Management',         path: '/users',                           icon: '👤', category: 'Platform',   keywords: 'admin system role users accounts', superAdminOnly: true },
    { name: 'Audit Trail',             path: '/admin/audit-logs',                icon: '🔍', category: 'Platform',   keywords: 'security logs tracking audit changes', superAdminOnly: true },
    { name: 'Webhooks',                path: '/admin/webhooks',                  icon: '🔗', category: 'Platform',   keywords: 'webhook integration events api', adminOnly: true },
    // User‑side
    { name: 'My Insurance',            path: '/user/healthcare/insurance',       icon: '🏥', category: 'My Pages',   keywords: 'my insurance claims billing', userOnly: true },
    { name: 'My Appointments',         path: '/user/healthcare/appointments',    icon: '📅', category: 'My Pages',   keywords: 'my appointments schedule', userOnly: true },
    { name: 'My Health Records',       path: '/user/healthcare/records',         icon: '📋', category: 'My Pages',   keywords: 'my health records history', userOnly: true },
    // Common
    { name: 'Profile',                 path: '/user/profile',                    icon: '🙍', category: 'Account',    keywords: 'profile avatar 2fa security' },
    { name: 'Settings',                path: '/settings',                        icon: '⚙️', category: 'Account',    keywords: 'password settings config account' },
    { name: 'Notifications',           path: '/notifications',                   icon: '🔔', category: 'Account',    keywords: 'notifications alerts messages' },
  ];

  const visiblePages = allPages.filter(p => {
    if (p.superAdminOnly && !isSuperAdmin(user))  return false;
    if (p.adminOnly      && !isAdmin(user) && !isManager(user)) return false;
    if (p.userOnly       && !isUser(user))         return false;
    return true;
  });

  const highlight = (text, query) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-primary/20 text-primary rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const searchResults = searchQuery.trim()
    ? visiblePages.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : visiblePages.slice(0, 8); // Show recent/popular when empty

  // Group by category
  const grouped = searchResults.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  // Flat list for keyboard nav
  const flatResults = searchResults;

  // Reset active index on query change
  useEffect(() => { setActiveIdx(0); }, [searchQuery]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isSearchOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatResults[activeIdx]) {
      navigate(flatResults[activeIdx].path);
      closeSearch();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const el = resultsRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

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
        <Link to="/" className="flex items-center p-1">
          <img src="/favicon/favicon.svg" alt="CMS Logo" className="h-full w-auto max-h-12" />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        {isAuthenticated && (
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link
                to={getHomeRoute(user, currentTheme?.id || 'banking')}
                className="hover:text-primary transition-colors font-semibold"
              >
                {isUser(user)
                  ? (() => {
                      const icons = { banking: '🏦', healthcare: '🏥', logistics: '🚚', content: '✏️' };
                      const sector = (currentTheme?.id || 'banking').toLowerCase();
                      return `${icons[sector] || ''} ${sector.charAt(0).toUpperCase() + sector.slice(1)}`;
                    })()
                  : 'Dashboard'}
              </Link>
            </li>

            {isSuperAdmin(user) && (
              <li>
                <Link to="/users" className="hover:text-primary transition-colors">
                  Users
                </Link>
              </li>
            )}
            {isSuperAdmin(user) && (
              <li>
                <Link to="/admin/audit-logs" className="hover:text-primary transition-colors">
                  Audit Trail
                </Link>
              </li>
            )}
            {(isAdmin(user) || isManager(user)) && (
              <li>
                <Link to="/admin/webhooks" className="hover:text-primary transition-colors">
                  Webhooks
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="navbar-end">
        <div className="flex items-center gap-2">

          {/* ── Premium Command Palette Search ──────────────────────────── */}
          {isAuthenticated && (
            <div className="hidden md:block relative" ref={searchRef}>

              {/* Trigger button */}
              <button
                onClick={openSearch}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-base-300 bg-base-200/60 hover:bg-base-200 hover:border-primary/40 transition-all duration-200 text-base-content/50 hover:text-base-content group"
                style={{ minWidth: '200px' }}
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                </svg>
                <span className="text-sm flex-1 text-left">Search everywhere…</span>
                <span className="flex items-center gap-0.5 flex-shrink-0">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-base-100 border border-base-300 rounded text-base-content/40 shadow-sm">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-base-100 border border-base-300 rounded text-base-content/40 shadow-sm">K</kbd>
                </span>
              </button>

              {/* ── Palette Overlay ── */}
              {isSearchOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] animate-in fade-in duration-150"
                    onClick={closeSearch}
                  />

                  {/* Palette panel */}
                  <div
                    className="fixed top-[12%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[210] animate-in fade-in slide-in-from-top-4 duration-200"
                    onKeyDown={handleKeyDown}
                  >
                    <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden"
                      style={{ boxShadow: `0 25px 60px -12px ${currentTheme?.primary || '#1e40af'}33, 0 8px 32px -8px rgba(0,0,0,0.3)` }}
                    >
                      {/* Search input row */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-base-200">
                        <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                        </svg>
                        <input
                          ref={inputRef}
                          id="global-search-input"
                          type="text"
                          autoComplete="off"
                          placeholder="Search pages, features, settings…"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 bg-transparent outline-none text-base-content placeholder-base-content/30 text-sm font-medium"
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery('')} className="text-base-content/30 hover:text-base-content transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-base-200 border border-base-300 rounded text-base-content/40 flex-shrink-0">Esc</kbd>
                      </div>

                      {/* Results */}
                      <div ref={resultsRef} className="max-h-[400px] overflow-y-auto py-2">
                        {Object.keys(grouped).length === 0 ? (
                          <div className="px-4 py-12 text-center">
                            <div className="text-3xl mb-2">🔍</div>
                            <p className="text-sm font-semibold text-base-content/60">No results for <span className="text-base-content">"{searchQuery}"</span></p>
                            <p className="text-xs text-base-content/40 mt-1">Try "patients", "insurance", or "settings"</p>
                          </div>
                        ) : (
                          (() => {
                            let globalIdx = 0;
                            return Object.entries(grouped).map(([category, items]) => (
                              <div key={category}>
                                <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-base-content/35">
                                  {category}
                                </p>
                                {items.map((item) => {
                                  const idx = globalIdx++;
                                  const isActive = idx === activeIdx;
                                  return (
                                    <button
                                      key={item.path}
                                      data-idx={idx}
                                      onClick={() => { navigate(item.path); closeSearch(); }}
                                      onMouseEnter={() => setActiveIdx(idx)}
                                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100 ${
                                        isActive
                                          ? 'bg-primary/10 text-primary'
                                          : 'text-base-content/70 hover:text-base-content'
                                      }`}
                                    >
                                      <span className="text-base w-6 text-center flex-shrink-0">{item.icon}</span>
                                      <span className="flex-1 text-sm font-medium">
                                        {highlight(item.name, searchQuery)}
                                      </span>
                                      <span className={`text-xs font-mono transition-opacity ${isActive ? 'opacity-60' : 'opacity-0'}`}>
                                        {item.path}
                                      </span>
                                      {isActive && (
                                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-primary/20 text-primary border border-primary/30 rounded flex-shrink-0">↵</kbd>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            ));
                          })()
                        )}
                      </div>

                      {/* Footer hint */}
                      <div className="px-4 py-2.5 border-t border-base-200 flex items-center gap-4 text-[10px] text-base-content/30 font-medium">
                        <span className="flex items-center gap-1">
                          <kbd className="px-1 py-0.5 bg-base-200 border border-base-300 rounded">↑↓</kbd> Navigate
                        </span>
                        <span className="flex items-center gap-1">
                          <kbd className="px-1 py-0.5 bg-base-200 border border-base-300 rounded">↵</kbd> Open
                        </span>
                        <span className="flex items-center gap-1">
                          <kbd className="px-1 py-0.5 bg-base-200 border border-base-300 rounded">Esc</kbd> Close
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Notifications */}
          {isAuthenticated && <NotificationsDropdown />}

          {/* Sector switcher — SUPERADMIN only */}
          {isAuthenticated && !hideSectorSwitcher && isSuperAdmin(user) && (
             <div className="dropdown dropdown-end hidden lg:block">
              <div tabIndex={0} role="button" className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-base-300 bg-base-100 hover:bg-base-200 transition-colors shadow-sm cursor-pointer">
                 <DynamicLogo size={18} animated={false} />
                 <span className="text-sm font-semibold tracking-wide capitalize">{currentTheme?.name || 'Banking'}</span>
                 <svg className="w-4 h-4 opacity-50 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
               <ul tabIndex={0} className="dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-box w-56 border border-base-300">
                 <li className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-base-content/50 border-b border-base-200 mb-1">
                   Switch Sector Dashboard
                 </li>
                 {getAllSectors().map(s => (
                   <li key={s}>
                     <button
                       onClick={() => { changeSector(s); navigate(`/dashboard/${s}`); document.activeElement?.blur(); }}
                       className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg capitalize transition-colors hover:bg-base-200 ${currentTheme?.name?.toLowerCase() === s ? 'bg-primary/10 text-primary font-semibold' : ''}`}
                     >
                       <DynamicLogo size={18} sector={s} animated={false} />
                       <span className="text-sm font-medium">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                     </button>
                   </li>
                 ))}
               </ul>
             </div>
           )}

           {/* User avatar menu */}
           {isAuthenticated ? (
             <div className="dropdown dropdown-end ml-1">
               <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle avatar ${!user?.avatarUrl ? 'placeholder' : ''}`}>
                 <div
                   className="w-10 rounded-full flex items-center justify-center font-bold text-lg text-white"
                   style={{ backgroundColor: user?.avatarUrl ? 'transparent' : (currentTheme?.primary || '#1e40af') }}
                 >
                   {user?.avatarUrl ? <img src={user.avatarUrl} alt="User" /> : <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>}
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
                   <button onClick={logout} className="text-error hover:bg-error hover:text-error-content">Logout</button>
                 </li>
               </ul>
             </div>
           ) : (
             <div className="flex gap-2">
               <Link to="/login" className="btn btn-ghost">Login</Link>
               <Link to="/signup" className="btn text-white" style={{ backgroundColor: currentTheme?.primary || '#1e40af' }}>Sign Up</Link>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SafeNavbar;