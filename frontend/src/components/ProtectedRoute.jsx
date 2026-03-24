import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute
 *
 * Props:
 *  - requiredRoles: string[] - if provided, user.role must be in this array.
 *    Example: requiredRoles={['ADMIN', 'MANAGER']}
 *    Leave undefined to allow any authenticated user.
 */
const ProtectedRoute = ({ children, requiredRoles = null }) => {
    const { user, isAuthenticated } = useAuth();

    // Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Role check — requiredRoles must be an array and user.role must be in it
    if (requiredRoles && Array.isArray(requiredRoles) && !requiredRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;