import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { SectorThemeProvider } from "./context/SectorThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationProvider } from "./components/providers/NotificationProvider";
import { Toaster } from "sonner";

import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import SectorLayout from "./components/layout/SectorLayout";
import UserLayout from "./components/layout/UserLayout";
import ErrorBoundary from "./components/ErrorBoundary";

/* ---------------- Public Pages ---------------- */
import ProfessionalLandingPage from "./pages/ProfessionalLandingPage";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const TestCredentialsPage = lazy(() => import("./pages/TestCredentialsPage"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const DocumentationPage = lazy(() => import("./pages/DocumentationPage"));

/* ---------------- Phase 2 Pages ---------------- */
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage"));
const UserManagementPage = lazy(() => import("./pages/admin/UserManagementPage"));
const WebhooksPage = lazy(() => import("./pages/admin/WebhooksPage"));
const SettingsPage = lazy(() => import("./pages/profile/SettingsPage"));
const OrganizationSettingsPage = lazy(() => import("./pages/profile/OrganizationSettingsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const UserProfilePage = lazy(() => import("./pages/profile/UserProfilePage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const OrganizationSignupPage = lazy(() => import("./pages/auth/OrganizationSignupPage"));

/* ---------------- Sector Pages ---------------- */
const SectorsOverviewPage = lazy(() => import("./pages/SectorsOverviewPage"));
const BankingSectorPage = lazy(() => import("./pages/sectors/BankingSectorPage"));
const HealthcareSectorPage = lazy(() => import("./pages/sectors/HealthcareSectorPage"));
const LogisticsSectorPage = lazy(() => import("./pages/sectors/LogisticsSectorPage"));
const ContentCreationSectorPage = lazy(() => import("./pages/sectors/ContentCreationSectorPage"));

import { BankingAdminRoutes, BankingUserRoutes } from './routes/BankingRoutes';
import { HealthcareAdminRoutes, HealthcareUserRoutes } from './routes/HealthcareRoutes';
import { LogisticsAdminRoutes, LogisticsUserRoutes } from './routes/LogisticsRoutes';
import { ContentAdminRoutes, ContentUserRoutes } from './routes/ContentRoutes';


/* ---------------- Loading UI ---------------- */
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <SectorThemeProvider>
                    <Router>
                        <Toaster position="top-right" richColors closeButton />
                        <ErrorBoundary>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Routes>
                                    {/* ---------------- AUTH ROUTES (No Navbar) ---------------- */}
                                    <Route element={<AuthLayout />}>
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/signup" element={<SignupPage />} />
                                        <Route path="/register-organization" element={<OrganizationSignupPage />} />
                                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                                    </Route>

                                    {/* ---------------- MAIN ROUTES (With Top Navbar) ---------------- */}
                                    <Route element={<MainLayout />}>
                                        <Route path="/" element={<ProfessionalLandingPage />} />
                                        <Route path="/test-credentials" element={<TestCredentialsPage />} />
                                        <Route path="/about" element={<AboutPage />} />
                                        <Route path="/docs" element={<DocumentationPage />} />
                                        <Route path="/documentation" element={<DocumentationPage />} />

                                        {/* Sector overview — any authenticated user */}
                                        <Route path="/sectors" element={<ProtectedRoute><SectorsOverviewPage /></ProtectedRoute>} />
                                        <Route path="/sectors/banking" element={<ProtectedRoute><BankingSectorPage /></ProtectedRoute>} />
                                        <Route path="/sectors/healthcare" element={<ProtectedRoute><HealthcareSectorPage /></ProtectedRoute>} />
                                        <Route path="/sectors/logistics" element={<ProtectedRoute><LogisticsSectorPage /></ProtectedRoute>} />
                                        <Route path="/sectors/content" element={<ProtectedRoute><ContentCreationSectorPage /></ProtectedRoute>} />

                                        {/* Profile & settings — any authenticated user */}
                                        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                                        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                                        <Route path="/organization-settings" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}><OrganizationSettingsPage /></ProtectedRoute>} />

                                        {/* ---------------- ADMIN-ONLY ROUTES ---------------- */}
                                        <Route path="/admin/audit-logs" element={<ProtectedRoute requiredRoles={['SUPERADMIN']}><AuditLogsPage /></ProtectedRoute>} />
                                        <Route path="/admin/webhooks" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><WebhooksPage /></ProtectedRoute>} />
                                        <Route path="/users" element={<ProtectedRoute requiredRoles={['SUPERADMIN']}><UserManagementPage /></ProtectedRoute>} />
                                    
                                        {/* 404 Catch-All within MainLayout */}
                                        <Route path="*" element={<NotFoundPage />} />
                                    </Route>

                                    {/* ---------------- SECTOR ADMIN ROUTES (With Sidebar) ---------------- */}
                                    <Route element={<SectorLayout />}>
                                        <Route path="/dashboard/banking/*" element={<BankingAdminRoutes />} />
                                        <Route path="/dashboard/healthcare/*" element={<HealthcareAdminRoutes />} />
                                        <Route path="/dashboard/logistics/*" element={<LogisticsAdminRoutes />} />
                                        <Route path="/dashboard/content/*" element={<ContentAdminRoutes />} />
                                    </Route>

                                    {/* ============================================================
                                        PHASE B — USER ROUTES (With User Sidebar)
                                        ============================================================ */}
                                    <Route element={<UserLayout />}>
                                        <Route path="/user/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
                                        <Route path="/user/banking/*" element={<BankingUserRoutes />} />
                                        <Route path="/user/healthcare/*" element={<HealthcareUserRoutes />} />
                                        <Route path="/user/logistics/*" element={<LogisticsUserRoutes />} />
                                        <Route path="/user/content/*" element={<ContentUserRoutes />} />
                                    </Route>
                                </Routes>
                            </Suspense>
                        </ErrorBoundary>
                    </Router>
                </SectorThemeProvider>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;