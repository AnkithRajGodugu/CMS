import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { normalizeRole } from '../utils/roleUtils';

/**
 * ProtectedRoute
 *
 * Props:
 *  - requiredRoles: string[] - if provided, the user's normalized role must be in this array.
 *    Example: requiredRoles={['ADMIN', 'MANAGER']}
 *    Leave undefined to allow any authenticated user.
 *
 * Note: normalizeRole strips the Spring Security 'ROLE_' prefix before comparing,
 *       so 'ROLE_USER' and 'USER' are treated as equivalent.
 */
const ProtectedRoute = ({ children, requiredRoles = null }) => {
    const { user, isAuthenticated } = useAuth();

    // Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Role check — normalize first to handle Spring Security's ROLE_ prefix
    if (requiredRoles && Array.isArray(requiredRoles)) {
        const normalizedUserRole = normalizeRole(user?.role);
        if (!requiredRoles.includes(normalizedUserRole)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;