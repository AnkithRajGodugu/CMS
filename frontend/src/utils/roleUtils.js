/**
 * roleUtils.js
 * Utility helpers for role-based logic throughout the app.
 * These are pure functions — they don't use hooks.
 */

export const ROLES = {
    SUPERADMIN: 'SUPERADMIN',
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    USER: 'USER',
};

/** Normalizes the role string by removing Spring Security's ROLE_ prefix */
export const normalizeRole = (role) => (role || '').replace(/^ROLE_/, '').toUpperCase();

/** True if the user holds a platform/sector admin level role */
export const isAdmin = (user) => {
    const r = normalizeRole(user?.role);
    return r === ROLES.ADMIN || r === ROLES.SUPERADMIN;
};

/** True if the user is a manager (sub-set of admin privileges) */
export const isManager = (user) =>
    normalizeRole(user?.role) === ROLES.MANAGER;

/** True for ADMIN + MANAGER (i.e. can access admin dashboards) */
export const isSectorAdmin = (user) =>
    isAdmin(user) || isManager(user);

/** True if the user is a regular end-user */
export const isUser = (user) =>
    normalizeRole(user?.role) === ROLES.USER;

/**
 * Returns the post-login redirect path for a given user.
 * @param {object} user  - user from AuthContext
 * @param {string|object} sector - sector string or object with .code
 */
export const getHomeRoute = (user, sector) => {
    const sectorCode = (
        typeof sector === 'string' ? sector :
        sector?.code || sector?.name || ''
    ).toUpperCase();

    const r = normalizeRole(user?.role);
    
    switch (r) {
        case ROLES.SUPERADMIN:
        case ROLES.ADMIN:
        case ROLES.MANAGER:
            return `/dashboard/${sectorCode || 'banking'}`;
        case ROLES.USER:
            return `/user/${sectorCode || 'banking'}/dashboard`;
        default:
            return '/sectors';
    }
};

/**
 * Returns the sidebar navigation config for a given sector + role.
 * Each item has { label, path, icon, adminOnly? }
 * icon is a react-icons/fa icon name string — Sidebar.jsx resolves it.
 */
export const getSectorNavItems = (sector, role) => {
    const adminNavs = {
        banking: [
            { label: 'Overview',      path: '/dashboard/banking',              icon: 'FaChartPie' },
            { label: 'Accounts',      path: '/dashboard/banking/accounts',     icon: 'FaCreditCard' },
            { label: 'Transactions',  path: '/dashboard/banking/transactions', icon: 'FaExchangeAlt' },
            { label: 'Customers',     path: '/dashboard/banking/customers',    icon: 'FaUsers' },
            { label: 'Compliance',    path: '/dashboard/banking/compliance',   icon: 'FaShieldAlt', adminOnly: true },
            { label: 'Risk',          path: '/dashboard/banking/risk',         icon: 'FaExclamationTriangle', adminOnly: true },
        ],
        healthcare: [
            { label: 'Overview',        path: '/dashboard/healthcare',                  icon: 'FaHospital' },
            { label: 'Patients',        path: '/dashboard/healthcare/patients',         icon: 'FaUserMd' },
            { label: 'Appointments',    path: '/dashboard/healthcare/appointments',     icon: 'FaCalendarCheck' },
            { label: 'Medical History', path: '/dashboard/healthcare/medical-history', icon: 'FaFileMedical' },
            { label: 'Insurance',       path: '/dashboard/healthcare/insurance',        icon: 'FaShieldAlt', adminOnly: true },
        ],
        logistics: [
            { label: 'Overview',          path: '/dashboard/logistics',           icon: 'FaTruck' },
            { label: 'Shipment Tracking', path: '/dashboard/logistics/tracking',  icon: 'FaShippingFast' },
            { label: 'Inventory',         path: '/dashboard/logistics/inventory', icon: 'FaBoxes' },
            { label: 'Routes',            path: '/dashboard/logistics/routes',    icon: 'FaRoute' },
            { label: 'Warehouse',         path: '/dashboard/logistics/warehouse', icon: 'FaWarehouse' },
            { label: 'Fleet',             path: '/dashboard/logistics/fleet',     icon: 'FaCarSide', adminOnly: true },
            { label: 'Vendors',           path: '/dashboard/logistics/vendors',   icon: 'FaHandshake', adminOnly: true },
            { label: 'SLA',              path: '/dashboard/logistics/sla',        icon: 'FaFileContract' },
        ],
        content: [
            { label: 'Overview',      path: '/dashboard/content',               icon: 'FaEdit' },
            { label: 'Projects',      path: '/dashboard/content/projects',      icon: 'FaProjectDiagram' },
            { label: 'Calendar',      path: '/dashboard/content/calendar',      icon: 'FaCalendarAlt' },
            { label: 'Assets',        path: '/dashboard/content/assets',        icon: 'FaPhotoVideo' },
            { label: 'Collaboration', path: '/dashboard/content/collaboration', icon: 'FaUsers' },
            { label: 'Time Tracking', path: '/dashboard/content/time',          icon: 'FaClock' },
            { label: 'Analytics',     path: '/dashboard/content/analytics',     icon: 'FaChartLine', adminOnly: true },
            { label: 'Workflow',      path: '/dashboard/content/workflow',      icon: 'FaSitemap', adminOnly: true },
        ],
    };

    const userNavs = {
        banking: [
            { label: 'My Dashboard',    path: '/user/banking/dashboard',     icon: 'FaChartPie' },
            { label: 'My Transactions', path: '/user/banking/transactions',  icon: 'FaExchangeAlt' },
            { label: 'Transfer Money',  path: '/user/banking/transfer',      icon: 'FaPaperPlane' },
            { label: 'Statements',      path: '/user/banking/statements',    icon: 'FaFileAlt' },
        ],
        healthcare: [
            { label: 'My Dashboard',   path: '/user/healthcare/dashboard',    icon: 'FaHospital' },
            { label: 'My Appointments',path: '/user/healthcare/appointments', icon: 'FaCalendarCheck' },
            { label: 'Health Records', path: '/user/healthcare/records',      icon: 'FaFileMedical' },
            { label: 'My Insurance',   path: '/user/healthcare/insurance',    icon: 'FaShieldAlt' },
        ],
        logistics: [
            { label: 'My Dashboard',   path: '/user/logistics/dashboard', icon: 'FaTruck' },
            { label: 'Track Shipment', path: '/user/logistics/track',     icon: 'FaShippingFast' },
            { label: 'My Orders',      path: '/user/logistics/orders',    icon: 'FaBoxes' },
        ],
        content: [
            { label: 'My Dashboard', path: '/user/content/dashboard', icon: 'FaEdit' },
            { label: 'My Tasks',     path: '/user/content/tasks',     icon: 'FaTasks' },
            { label: 'My Calendar',  path: '/user/content/calendar',  icon: 'FaCalendarAlt' },
            { label: 'My Projects',  path: '/user/content/projects',  icon: 'FaProjectDiagram' },
        ],
    };

    const s = (typeof sector === 'string' ? sector : sector?.code || 'banking').toLowerCase();
    const r = normalizeRole(role);

    if (r === ROLES.USER) {
        return userNavs[s] || [];
    }
    
    const links = adminNavs[s] || [];
    if (r === ROLES.MANAGER) {
        return links.filter(item => !item.adminOnly);
    }
    return links;
};

/**
 * Helper to check if a user belongs to a specific sector (case-insensitive)
 */
export const hasSector = (userSector, targetCode) => {
    const sectorCode = (
        typeof userSector === 'string' ? userSector :
        userSector?.code || ''
    ).toUpperCase();
    
    return sectorCode === targetCode.toUpperCase();
};
