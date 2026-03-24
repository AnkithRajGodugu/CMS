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

/** True if the user holds a platform/sector admin level role */
export const isAdmin = (user) =>
    user?.role === ROLES.ADMIN || user?.role === ROLES.SUPERADMIN;

/** True if the user is a manager (sub-set of admin privileges) */
export const isManager = (user) =>
    user?.role === ROLES.MANAGER;

/** True for ADMIN + MANAGER (i.e. can access admin dashboards) */
export const isSectorAdmin = (user) =>
    isAdmin(user) || isManager(user);

/** True if the user is a regular end-user */
export const isUser = (user) =>
    user?.role === ROLES.USER;

/**
 * Returns the post-login redirect path for a given user.
 * @param {object} user  - user from AuthContext
 * @param {string|object} sector - sector string or object with .code
 */
export const getHomeRoute = (user, sector) => {
    const sectorCode = (
        typeof sector === 'string' ? sector :
        sector?.code || sector?.name || ''
    ).toLowerCase();

    switch (user?.role) {
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
 */
export const getSectorNavItems = (sector, role) => {
    const adminNavs = {
        banking: [
            { label: 'Overview', path: '/dashboard/banking' },
            { label: 'Accounts', path: '/dashboard/banking/accounts' },
            { label: 'Transactions', path: '/dashboard/banking/transactions' },
            { label: 'Compliance', path: '/dashboard/banking/compliance', adminOnly: true },
            { label: 'Risk', path: '/dashboard/banking/risk', adminOnly: true },
            { label: 'Customers', path: '/dashboard/banking/customers' },
        ],
        healthcare: [
            { label: 'Overview', path: '/dashboard/healthcare' },
            { label: 'Patients', path: '/dashboard/healthcare/patients' },
            { label: 'Appointments', path: '/dashboard/healthcare/appointments' },
            { label: 'Medical History', path: '/dashboard/healthcare/medical-history' },
            { label: 'Insurance', path: '/dashboard/healthcare/insurance', adminOnly: true },
        ],
        logistics: [
            { label: 'Overview', path: '/dashboard/logistics' },
            { label: 'Shipment Tracking', path: '/dashboard/logistics/tracking' },
            { label: 'Inventory', path: '/dashboard/logistics/inventory' },
            { label: 'Fleet', path: '/dashboard/logistics/fleet', adminOnly: true },
            { label: 'Routes', path: '/dashboard/logistics/routes' },
            { label: 'Warehouse', path: '/dashboard/logistics/warehouse' },
            { label: 'Vendors', path: '/dashboard/logistics/vendors', adminOnly: true },
            { label: 'SLA', path: '/dashboard/logistics/sla' },
        ],
        content: [
            { label: 'Overview', path: '/dashboard/content' },
            { label: 'Projects', path: '/dashboard/content/projects' },
            { label: 'Calendar', path: '/dashboard/content/calendar' },
            { label: 'Collaboration', path: '/dashboard/content/collaboration' },
            { label: 'Assets', path: '/dashboard/content/assets' },
            { label: 'Time Tracking', path: '/dashboard/content/time' },
            { label: 'Analytics', path: '/dashboard/content/analytics', adminOnly: true },
            { label: 'Workflow', path: '/dashboard/content/workflow', adminOnly: true },
        ],
    };

    const userNavs = {
        banking: [
            { label: 'My Dashboard', path: '/user/banking/dashboard' },
            { label: 'My Transactions', path: '/user/banking/transactions' },
            { label: 'Transfer Money', path: '/user/banking/transfer' },
            { label: 'Statements', path: '/user/banking/statements' },
        ],
        healthcare: [
            { label: 'My Dashboard', path: '/user/healthcare/dashboard' },
            { label: 'My Appointments', path: '/user/healthcare/appointments' },
            { label: 'Health Records', path: '/user/healthcare/records' },
            { label: 'My Insurance', path: '/user/healthcare/insurance' },
        ],
        logistics: [
            { label: 'My Dashboard', path: '/user/logistics/dashboard' },
            { label: 'Track Shipment', path: '/user/logistics/track' },
            { label: 'My Orders', path: '/user/logistics/orders' },
        ],
        content: [
            { label: 'My Dashboard', path: '/user/content/dashboard' },
            { label: 'My Tasks', path: '/user/content/tasks' },
            { label: 'My Calendar', path: '/user/content/calendar' },
            { label: 'My Projects', path: '/user/content/projects' },
        ],
    };

    const s = (sector || 'banking').toLowerCase();

    if (role === ROLES.USER) {
        return userNavs[s] || [];
    }
    
    const links = adminNavs[s] || [];
    if (role === ROLES.MANAGER) {
        return links.filter(item => !item.adminOnly);
    }
    return links;
};
