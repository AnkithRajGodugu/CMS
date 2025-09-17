import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Core pages (loaded immediately)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Lazy-loaded pages (loaded on demand)
const BankingDashboard = lazy(() => import('./pages/dashboard/BankingDashboard'));
const SectorsOverviewPage = lazy(() => import('./pages/SectorsOverviewPage'));
const BankingSectorPage = lazy(() => import('./pages/sectors/BankingSectorPage'));
const HealthcareSectorPage = lazy(() => import('./pages/sectors/HealthcareSectorPage'));
const LogisticsSectorPage = lazy(() => import('./pages/sectors/LogisticsSectorPage'));
const ContentCreationSectorPage = lazy(() => import('./pages/sectors/ContentCreationSectorPage'));

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
    );
}

export default App;