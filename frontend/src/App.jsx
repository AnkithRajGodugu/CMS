import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import Login from './components/Login';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import SectorList from './components/SectorList';
import UserList from './components/UserList';
import Report from './components/Report';
import Counter from './components/Counter';
import LoanPage from './pages/banking/loan';
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <h1>CMS Dashboard</h1>
                <nav style={{ marginBottom: 12 }}>
                    <a href="/" style={{ marginRight: 8 }}>Home</a>
                    <a href="/banking/loan" style={{ marginRight: 8 }}>Loan</a>
                    <a href="/customers" style={{ marginRight: 8 }}>Customers</a>
                    <a href="/sectors" style={{ marginRight: 8 }}>Sectors</a>
                </nav>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/customers" element={<CustomerList />} />
                    <Route path="/customers/new" element={<CustomerForm />} />
                    <Route path="/sectors" element={<SectorList />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/reports" element={<Report />} />
                    <Route path="/counter" element={<Counter />} />
                    <Route path="/banking/loan" element={<LoanPage />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </Router>
=======
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';

// Core pages (loaded immediately)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

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
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        {/* Public Routes (loaded immediately) */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        {/* Sector Information Pages (lazy-loaded) */}
                        <Route path="/sectors" element={<SectorsOverviewPage />} />
                        <Route path="/sectors/banking" element={<BankingSectorPage />} />
                        <Route path="/sectors/healthcare" element={<HealthcareSectorPage />} />
                        <Route path="/sectors/logistics" element={<LogisticsSectorPage />} />
                        <Route path="/sectors/content" element={<ContentCreationSectorPage />} />
                        {/* Logistics Feature Pages */}
                        <Route path="/logistics-&-supply/LogisticsShipmentTrackingPage" element={<LogisticsShipmentTrackingPage />} />
                        <Route path="/logistics-&-supply/LogisticsInventoryManagementPage" element={<LogisticsInventoryManagementPage />} />
                        <Route path="/logistics-&-supply/LogisticsRouteOptimizationPage" element={<LogisticsRouteOptimizationPage />} />
                        <Route path="/logistics-&-supply/LogisticsVendorRelationsPage" element={<LogisticsVendorRelationsPage />} />
                        <Route path="/logistics-&-supply/LogisticsWarehouseManagementPage" element={<LogisticsWarehouseManagementPage />} />
                        <Route path="/logistics-&-supply/LogisticsFleetManagementPage" element={<LogisticsFleetManagementPage />} />
                        {/* Content-Creation Feature Pages */}
                        <Route path="/content-creation/ProjectManagementPage" element={<ProjectManagementPage />} />
                        <Route path="/content-creation/ClientPortalPage" element={<ClientPortalPage />} />
                        <Route path="/content-creation/ContentCalendarPage" element={<ContentCalendarPage />} />
                        <Route path="/content-creation/CollaborationToolsPage" element={<CollaborationToolsPage />} />
                        <Route path="/content-creation/AssetManagementPage" element={<AssetManagementPage />} />
                        <Route path="/content-creation/TimeTrackingPage" element={<TimeTrackingPage />} />
                        {/* Dashboard Routes (lazy-loaded) */}
                        <Route path="/dashboard/banking" element={<BankingDashboard />} />
                        <Route path="/dashboard/healthcare" element={<BankingDashboard />} />
                        <Route path="/dashboard/logistics" element={<BankingDashboard />} />
                        <Route path="/dashboard/content" element={<BankingDashboard />} />
                        {/* Legacy Routes (lazy-loaded for backward compatibility) */}
                        <Route path="/customers" element={<CustomerList />} />
                        <Route path="/customers/new" element={<CustomerForm />} />
                        <Route path="/legacy-sectors" element={<SectorList />} />
                        <Route path="/users" element={<UserList />} />
                        <Route path="/reports" element={<Report />} />
                        <Route path="/counter" element={<Counter />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
>>>>>>> 06a63022a5f5ac49ae6077e0b44ad5bc96a6a9cb
    );
}

export default App;