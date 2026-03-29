import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import UserOnboardingModal from '../UserOnboardingModal';

const UserLayout = () => {
    return (
        <>
            <div className="h-screen flex flex-col bg-base-200 overflow-hidden">
                {/* Top Navbar spans full width */}
                <div className="z-50 flex-shrink-0 w-full">
                    <Navbar hideSectorSwitcher={true} />
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                    {/* Fixed Sidebar (reusing the same component, it reads the USER role via context) */}
                    <div className="hidden lg:block z-40">
                        <Sidebar />
                    </div>
                    
                    {/* Scrollable Main Content */}
                    <main className="flex-1 overflow-y-auto w-full">
                        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
            
            <UserOnboardingModal />
        </>
    );
};

export default UserLayout;
