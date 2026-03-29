import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const SectorLayout = () => {
    return (
        <div className="drawer lg:drawer-open h-screen bg-base-200 overflow-hidden">
            <input id="mobile-sidebar-drawer" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col h-screen overflow-hidden">
                {/* Navbar */}
                <div className="z-40 w-full flex-shrink-0">
                    <Navbar />
                </div>
                
                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div> 
            
            {/* Drawer Side (Sidebar) */}
            <div className="drawer-side z-50">
                <label htmlFor="mobile-sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label> 
                <div className="w-72 min-h-full bg-base-100/50">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default SectorLayout;
