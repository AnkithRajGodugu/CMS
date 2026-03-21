import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { SectorThemeProvider } from "./context/SectorThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import SafeNavbar from "./components/SafeNavbar";


/* ---------------- Public Pages ---------------- */

import WorkingLandingPage from "./pages/WorkingLandingPage";
import SafeLandingPage from "./pages/SafeLandingPage";
import ProfessionalLandingPage from "./pages/ProfessionalLandingPage";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const TestCredentialsPage = lazy(() => import("./pages/TestCredentialsPage"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const DocumentationPage = lazy(() => import("./pages/DocumentationPage"));

/* ---------------- Phase 2 Pages ---------------- */

const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage"));
const SettingsPage = lazy(() => import("./pages/profile/SettingsPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));

/* ---------------- Sector Pages ---------------- */

const SectorsOverviewPage = lazy(() => import("./pages/SectorsOverviewPage"));
const BankingSectorPage = lazy(() => import("./pages/sectors/BankingSectorPage"));
const HealthcareSectorPage = lazy(() => import("./pages/sectors/HealthcareSectorPage"));
const LogisticsSectorPage = lazy(() => import("./pages/sectors/LogisticsSectorPage"));
const ContentCreationSectorPage = lazy(() =>
    import("./pages/sectors/ContentCreationSectorPage")
);

/* ---------------- Dashboards ---------------- */

const BankingDashboard = lazy(() => import("./pages/dashboard/BankingDashboard"));
const HealthcareDashboard = lazy(() =>
    import("./pages/dashboard/HealthcareDashboard")
);
const LogisticsDashboard = lazy(() =>
    import("./pages/dashboard/LogisticsDashboard")
);
const ContentDashboard = lazy(() => import("./pages/dashboard/ContentDashboard"));

/* ---------------- Banking Pages ---------------- */

const AccountManagementPage = lazy(() =>
    import("./pages/banking-&-finance/AccountManagementPage")
);
const TransactionTrackingPage = lazy(() =>
    import("./pages/banking-&-finance/TransactionTrackingPage")
);
const ComplianceToolsPage = lazy(() =>
    import("./pages/banking-&-finance/ComplianceToolsPage")
);
const RiskAssessmentPage = lazy(() =>
    import("./pages/banking-&-finance/RiskAssessmentPage")
);
const CustomersPage = lazy(() => import("./pages/banking-&-finance/CustomersPage"));
/* ---------------- Loading UI ---------------- */

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <SectorThemeProvider>
                <Router>
                    <SafeNavbar />

                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>

                            {/* ---------------- PUBLIC ROUTES ---------------- */}

                            <Route path="/" element={<ProfessionalLandingPage />} />
                            <Route path="/old-landing" element={<SafeLandingPage />} />
                            <Route path="/simple" element={<WorkingLandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/test-credentials" element={<TestCredentialsPage />} />
                            <Route path="/unauthorized" element={<UnauthorizedPage />} />

                            {/* ---------------- SECTOR PAGES ---------------- */}

                            <Route
                                path="/sectors"
                                element={
                                    <ProtectedRoute>
                                        <SectorsOverviewPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/sectors/banking"
                                element={
                                    <ProtectedRoute>
                                        <BankingSectorPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/sectors/healthcare"
                                element={
                                    <ProtectedRoute>
                                        <HealthcareSectorPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/sectors/logistics"
                                element={
                                    <ProtectedRoute>
                                        <LogisticsSectorPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/sectors/content"
                                element={
                                    <ProtectedRoute>
                                        <ContentCreationSectorPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* ---------------- BANKING DASHBOARD ---------------- */}

                            <Route
                                path="/dashboard/banking"
                                element={
                                    <ProtectedRoute>
                                        <BankingDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/dashboard/banking/accounts"
                                element={
                                    <ProtectedRoute>
                                        <AccountManagementPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/dashboard/banking/transactions"
                                element={
                                    <ProtectedRoute>
                                        <TransactionTrackingPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/dashboard/banking/compliance"
                                element={
                                    <ProtectedRoute>
                                        <ComplianceToolsPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/dashboard/banking/risk"
                                element={
                                    <ProtectedRoute>
                                        <RiskAssessmentPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/dashboard/banking/customers"
                                element={
                                    <ProtectedRoute>
                                        <CustomersPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* ---------------- OTHER DASHBOARDS ---------------- */}

                            <Route
                                path="/dashboard/healthcare"
                                element={
                                    <ProtectedRoute>
                                        <HealthcareDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/dashboard/logistics"
                                element={
                                    <ProtectedRoute>
                                        <LogisticsDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/dashboard/content"
                                element={
                                    <ProtectedRoute>
                                        <ContentDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* ---------------- INFO PAGES ---------------- */}

                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/docs" element={<DocumentationPage />} />
                            <Route path="/documentation" element={<DocumentationPage />} />

                            {/* ---------------- PROFILE & ADMIN ---------------- */}

                            <Route
                                path="/settings"
                                element={
                                    <ProtectedRoute>
                                        <SettingsPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/audit-logs"
                                element={
                                    <ProtectedRoute>
                                        <AuditLogsPage />
                                    </ProtectedRoute>
                                }
                            />

                        </Routes>
                    </Suspense>
                </Router>
            </SectorThemeProvider>
        </AuthProvider>
    );
}

export default App;