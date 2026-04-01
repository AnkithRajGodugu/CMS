import { Outlet } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import UserOnboardingModal from '../UserOnboardingModal';

const DRAWER_ID = 'mobile-user-drawer';

/**
 * UserLayout — same React-state sidebar pattern as SectorLayout.
 * Desktop: flex row, persistent sidebar. Mobile: overlay sidebar.
 */
const UserLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen,  setSearchOpen]  = useState(false);

    const openSearch   = useCallback(() => setSearchOpen(true),   []);
    const closeSearch  = useCallback(() => setSearchOpen(false),  []);
    const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 1024) setSidebarOpen(false); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    return (
        <>
            <div className="flex h-screen w-full overflow-hidden">

                {/* Desktop sidebar */}
                <div className="hidden lg:flex lg:flex-shrink-0">
                    <Sidebar drawerId={DRAWER_ID} onNavClick={() => {}} />
                </div>

                {/* Content column */}
                <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                    <div className="flex-shrink-0 sticky top-0 z-40">
                        <Navbar
                            hideSectorSwitcher={true}
                            drawerId={DRAWER_ID}
                            onMobileMenuOpen={openSidebar}
                            externalSearchOpen={searchOpen}
                            onExternalSearchClose={closeSearch}
                        />
                    </div>

                    <main className="flex-1 overflow-y-auto scroll-touch bg-base-200 pb-nav-safe lg:pb-0">
                        <div className="p-3 sm:p-5 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
                            <Outlet />
                        </div>
                    </main>

                    <MobileBottomNav
                        onSearchOpen={openSearch}
                        onMenuOpen={openSidebar}
                        drawerId={DRAWER_ID}
                    />
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-[200] flex">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeSidebar}
                        aria-label="Close menu"
                    />
                    <div className="relative z-10 h-full shadow-2xl animate-slide-in-right">
                        <Sidebar drawerId={DRAWER_ID} onNavClick={closeSidebar} />
                    </div>
                </div>
            )}

            <UserOnboardingModal />
        </>
    );
};

export default UserLayout;
