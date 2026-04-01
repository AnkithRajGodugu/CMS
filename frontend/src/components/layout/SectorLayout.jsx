import { Outlet } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import UserOnboardingModal from '../UserOnboardingModal';

const DRAWER_ID = 'mobile-sidebar-drawer';

/**
 * SectorLayout
 *
 * Desktop (≥ lg):  Persistent sidebar column + Navbar on top of content area.
 * Mobile  (< lg):  Full-width. Hamburger opens a sidebar overlay (React-state
 *                  driven, not DaisyUI checkbox) so layout is never broken.
 */
const SectorLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen,  setSearchOpen]  = useState(false);

    const openSearch   = useCallback(() => setSearchOpen(true),   []);
    const closeSearch  = useCallback(() => setSearchOpen(false),  []);
    const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    // Close sidebar on route change / resize to desktop
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Lock body scroll when sidebar overlay is open on mobile
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    return (
        <>
            {/* ── Root shell ─────────────────────────────────────────────── */}
            <div className="flex h-screen w-full overflow-hidden">

                {/* Desktop sidebar — always visible, hidden on mobile */}
                <div className="hidden lg:flex lg:flex-shrink-0">
                    <Sidebar drawerId={DRAWER_ID} onNavClick={() => {}} />
                </div>

                {/* Content column */}
                <div className="flex flex-col flex-1 overflow-hidden min-w-0">

                    {/* Sticky navbar — passes hamburger handler on mobile */}
                    <div className="flex-shrink-0 sticky top-0 z-40">
                        <Navbar
                            drawerId={DRAWER_ID}
                            onMobileMenuOpen={openSidebar}
                            externalSearchOpen={searchOpen}
                            onExternalSearchClose={closeSearch}
                        />
                    </div>

                    {/* Page content */}
                    <main className="flex-1 overflow-y-auto scroll-touch bg-base-200 pb-nav-safe lg:pb-0">
                        <div className="p-3 sm:p-5 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
                            <Outlet />
                        </div>
                    </main>

                    {/* Mobile bottom nav — CSS hides on lg+ */}
                    <MobileBottomNav
                        onSearchOpen={openSearch}
                        onMenuOpen={openSidebar}
                        drawerId={DRAWER_ID}
                    />
                </div>
            </div>

            {/* ── Mobile sidebar overlay ──────────────────────────────────── */}
            {/* Rendered as a portal outside the flex row so it never         */}
            {/* affects desktop layout. Controlled by React state.            */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-[200] flex">
                    {/* Dark backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeSidebar}
                        aria-label="Close menu"
                    />
                    {/* Sidebar panel */}
                    <div className="relative z-10 h-full shadow-2xl animate-slide-in-right">
                        <Sidebar drawerId={DRAWER_ID} onNavClick={closeSidebar} />
                    </div>
                </div>
            )}

            <UserOnboardingModal />
        </>
    );
};

export default SectorLayout;
