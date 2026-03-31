import { Outlet } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

const SectorLayout = () => {
    const [searchOpen, setSearchOpen] = useState(false);

    const openSearch = useCallback(() => setSearchOpen(true), []);
    const closeSearch = useCallback(() => setSearchOpen(false), []);

    return (
        /*
         * DaisyUI drawer in lg:drawer-open mode:
         *   - On lg+: sidebar is always visible, takes up left column
         *   - On < lg: sidebar is a sheet/overlay triggered by the checkbox toggle;
         *              the drawer-content takes FULL width (w-full, no offset)
         */
        <div className="drawer lg:drawer-open min-h-screen">
            <input id="mobile-sidebar-drawer" type="checkbox" className="drawer-toggle" />

            {/* ─── Main content ─────────────────────────────────────── */}
            <div className="drawer-content flex flex-col min-h-screen w-full">
                {/* Navbar */}
                <div className="z-40 w-full flex-shrink-0 sticky top-0">
                    <Navbar
                        externalSearchOpen={searchOpen}
                        onExternalSearchClose={closeSearch}
                    />
                </div>

                {/* Page content — pb clears the mobile bottom nav bar */}
                <main className="flex-1 overflow-y-auto scroll-touch w-full bg-base-200">
                    <div className="p-3 md:p-6 lg:p-8 max-w-[1600px] mx-auto pb-nav-safe lg:pb-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* ─── Sidebar drawer ───────────────────────────────────── */}
            {/*
             * On lg+: rendered as a persistent left column (lg:drawer-open)
             * On < lg: rendered as an overlay sheet over the content.
             *          The drawer-overlay click closes it.
             */}
            <div className="drawer-side z-50">
                <label
                    htmlFor="mobile-sidebar-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                />
                <div className="min-h-full">
                    <Sidebar />
                </div>
            </div>

            {/* Mobile Bottom Nav — hidden on lg+ by CSS inside component */}
            <MobileBottomNav onSearchOpen={openSearch} />
        </div>
    );
};

export default SectorLayout;
