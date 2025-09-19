import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Core pages (loaded immediately)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TestCredentialsPage from './pages/TestCredentialsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Lazy-loaded pages (loaded on demand)
// Content-Creation Feature Pages
const ProjectManagementPage = lazy(() => import('./pages/content-creation/ProjectManagementPage'));
const ClientPortalPage = lazy(() => import('./pages/content-creation/ClientPortalPage'));
const ContentCalendarPage = lazy(() => import('./pages/content-creation/ContentCalendarPage'));
const CollaborationToolsPage = lazy(() => import('./pages/content-creation/CollaborationToolsPage'));
const AssetManagementPage = lazy(() => import('./pages/content-creation/AssetManagementPage'));
const TimeTrackingPage = lazy(() => import('./pages/content-creation/TimeTrackingPage'));
const BankingDashboard = lazy(() => import('./pages/dashboard/BankingDashboard'));
const SectorsOverviewPage = lazy(() => import('./pages/SectorsOverviewPage'));
const BankingSectorPage = lazy(() => import('./pages/sectors/BankingSectorPage'));
const HealthcareSectorPage = lazy(() => import('./pages/sectors/HealthcareSectorPage'));
const LogisticsSectorPage = lazy(() => import('./pages/sectors/LogisticsSectorPage'));
const ContentCreationSectorPage = lazy(() => import('./pages/sectors/ContentCreationSectorPage'));
// Logistics Feature Pages
const LogisticsShipmentTrackingPage = lazy(() => import('./pages/logistics-&-supply/LogisticsShipmentTrackingPage'));
const LogisticsInventoryManagementPage = lazy(() => import('./pages/logistics-&-supply/LogisticsInventoryManagementPage'));
const LogisticsRouteOptimizationPage = lazy(() => import('./pages/logistics-&-supply/LogisticsRouteOptimizationPage'));
const LogisticsVendorRelationsPage = lazy(() => import('./pages/logistics-&-supply/LogisticsVendorRelationsPage'));
const LogisticsWarehouseManagementPage = lazy(() => import('./pages/logistics-&-supply/LogisticsWarehouseManagementPage'));
const LogisticsFleetManagementPage = lazy(() => import('./pages/logistics-&-supply/LogisticsFleetManagementPage'));

// Legacy components (lazy-loaded)
const CustomerList = lazy(() => import('./components/CustomerList'));
const CustomerForm = lazy(() => import('./components/CustomerForm'));
const SectorList = lazy(() => import('./components/SectorList'));
const UserList = lazy(() => import('./components/UserList'));
const Report = lazy(() => import('./components/Report'));
const Counter = lazy(() => import('./components/Counter'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loading loading-spinner loading-lg text-primary"></div>
  </div>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        {/* Public Routes (loaded immediately) */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/test-credentials" element={<TestCredentialsPage />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        {/* Sector Information Pages (lazy-loaded) */}
                        <Route path="/sectors" element={<ProtectedRoute><SectorsOverviewPage /></ProtectedRoute>} />
                        <Route path="/sectors/banking" element={<ProtectedRoute><BankingSectorPage /></ProtectedRoute>} />
                        <Route path="/sectors/healthcare" element={<ProtectedRoute><HealthcareSectorPage /></ProtectedRoute>} />
                        <Route path="/sectors/logistics" element={<ProtectedRoute><LogisticsSectorPage /></ProtectedRoute>} />
                        <Route path="/sectors/content" element={<ProtectedRoute><ContentCreationSectorPage /></ProtectedRoute>} />
                        {/* Logistics Feature Pages */}
                        <Route path="/logistics-&-supply/LogisticsShipmentTrackingPage" element={<ProtectedRoute><LogisticsShipmentTrackingPage /></ProtectedRoute>} />
                        <Route path="/logistics-&-supply/LogisticsInventoryManagementPage" element={<ProtectedRoute><LogisticsInventoryManagementPage /></ProtectedRoute>} />
                        <Route path="/logistics-&-supply/LogisticsRouteOptimizationPage" element={<ProtectedRoute><LogisticsRouteOptimizationPage /></ProtectedRoute>} />
                        <Route path="/logistics-&-supply/LogisticsVendorRelationsPage" element={<ProtectedRoute><LogisticsVendorRelationsPage /></ProtectedRoute>} />
                        <Route path="/logistics-&-supply/LogisticsWarehouseManagementPage" element={<ProtectedRoute><LogisticsWarehouseManagementPage /></ProtectedRoute>} />
                        <Route path="/logistics-&-supply/LogisticsFleetManagementPage" element={<ProtectedRoute><LogisticsFleetManagementPage /></ProtectedRoute>} />
                        {/* Content-Creation Feature Pages */}
                        <Route path="/content-creation/ProjectManagementPage" element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
                        <Route path="/content-creation/ClientPortalPage" element={<ProtectedRoute><ClientPortalPage /></ProtectedRoute>} />
                        <Route path="/content-creation/ContentCalendarPage" element={<ProtectedRoute><ContentCalendarPage /></ProtectedRoute>} />
                        <Route path="/content-creation/CollaborationToolsPage" element={<ProtectedRoute><CollaborationToolsPage /></ProtectedRoute>} />
                        <Route path="/content-creation/AssetManagementPage" element={<ProtectedRoute><AssetManagementPage /></ProtectedRoute>} />
                        <Route path="/content-creation/TimeTrackingPage" element={<ProtectedRoute><TimeTrackingPage /></ProtectedRoute>} />
                        {/* Dashboard Routes (lazy-loaded) */}
                        <Route path="/dashboard/banking" element={<ProtectedRoute><BankingDashboard /></ProtectedRoute>} />
                        <Route path="/dashboard/healthcare" element={<ProtectedRoute><BankingDashboard /></ProtectedRoute>} />
                        <Route path="/dashboard/logistics" element={<ProtectedRoute><BankingDashboard /></ProtectedRoute>} />
                        <Route path="/dashboard/content" element={<ProtectedRoute><BankingDashboard /></ProtectedRoute>} />
                        {/* Legacy Routes (lazy-loaded for backward compatibility) */}
                        <Route path="/customers" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
                        <Route path="/customers/new" element={<ProtectedRoute><CustomerForm /></ProtectedRoute>} />
                        <Route path="/legacy-sectors" element={<ProtectedRoute><SectorList /></ProtectedRoute>} />
                        <Route path="/users" element={<ProtectedRoute requiredRole="ADMIN"><UserList /></ProtectedRoute>} />
                        <Route path="/reports" element={<ProtectedRoute><Report /></ProtectedRoute>} />
                        <Route path="/counter" element={<ProtectedRoute><Counter /></ProtectedRoute>} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;