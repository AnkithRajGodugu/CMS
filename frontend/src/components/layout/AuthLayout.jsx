import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="auth-layout-wrapper">
            {/* The individual auth pages handle their own centered containers,
                so we just render the outlet here without a navbar. */}
            <Outlet />
        </div>
    );
};

export default AuthLayout;
