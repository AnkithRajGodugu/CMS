import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const SectorLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-base-200">
            {/* Top Navbar spans full width */}
            <div className="sticky top-0 z-50">
                <Navbar />
            </div>
            
            <div className="flex flex-1 overflow-hidden">
                {/* Fixed Sidebar */}
                <div className="hidden lg:block z-40">
                    <Sidebar />
                </div>
                
                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SectorLayout;
