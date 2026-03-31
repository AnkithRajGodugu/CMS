import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

/* ---------------- Logistics Pages (Admin) ---------------- */
const LogisticsDashboard = lazy(() => import("../pages/dashboard/LogisticsDashboard"));
const LogisticsShipmentTrackingPage = lazy(() => import("../pages/logistics/LogisticsShipmentTrackingPage"));
const LogisticsInventoryManagementPage = lazy(() => import("../pages/logistics/LogisticsInventoryManagementPage"));
const LogisticsFleetManagementPage = lazy(() => import("../pages/logistics/LogisticsFleetManagementPage"));
const LogisticsRouteOptimizationPage = lazy(() => import("../pages/logistics/LogisticsRouteOptimizationPage"));
const LogisticsWarehouseManagementPage = lazy(() => import("../pages/logistics/LogisticsWarehouseManagementPage"));
const LogisticsVendorRelationsPage = lazy(() => import("../pages/logistics/LogisticsVendorRelationsPage"));
const ServiceLevelAgreementPage = lazy(() => import("../pages/logistics/ServiceLevelAgreementPage"));

/* ---------------- Logistics Pages (User) ---------------- */
const LogisticsUserDashboard = lazy(() => import("../pages/logistics/user/LogisticsUserDashboard"));
const TrackShipmentPage = lazy(() => import("../pages/logistics/user/TrackShipmentPage"));
const MyOrdersPage = lazy(() => import("../pages/logistics/user/MyOrdersPage"));

export const LogisticsAdminRoutes = () => (
    <Routes>
        <Route path="/" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><LogisticsDashboard /></ProtectedRoute>} />
        <Route path="tracking" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><LogisticsShipmentTrackingPage /></ProtectedRoute>} />
        <Route path="inventory" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><LogisticsInventoryManagementPage /></ProtectedRoute>} />
        <Route path="fleet" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><LogisticsFleetManagementPage /></ProtectedRoute>} />
        <Route path="routes" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><LogisticsRouteOptimizationPage /></ProtectedRoute>} />
        <Route path="warehouse" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><LogisticsWarehouseManagementPage /></ProtectedRoute>} />
        <Route path="vendors" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><LogisticsVendorRelationsPage /></ProtectedRoute>} />
        <Route path="sla" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><ServiceLevelAgreementPage /></ProtectedRoute>} />
    </Routes>
);

export const LogisticsUserRoutes = () => (
    <Routes>
        <Route path="dashboard" element={<ProtectedRoute requiredRoles={['USER']}><LogisticsUserDashboard /></ProtectedRoute>} />
        <Route path="track" element={<ProtectedRoute requiredRoles={['USER']}><TrackShipmentPage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute requiredRoles={['USER']}><MyOrdersPage /></ProtectedRoute>} />
    </Routes>
);
