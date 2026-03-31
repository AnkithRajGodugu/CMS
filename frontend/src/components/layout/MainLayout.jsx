import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />
            <main className="container mx-auto p-4 md:p-6 lg:p-8 w-full max-w-screen-2xl">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
