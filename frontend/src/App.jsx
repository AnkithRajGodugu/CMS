import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { SectorThemeProvider } from "./context/SectorThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import SafeNavbar from "./components/SafeNavbar";
import { NotificationProvider } from "./components/providers/NotificationProvider";
import { Toaster } from "sonner";


/* ---------------- Public Pages ---------------- */

import ProfessionalLandingPage from "./pages/ProfessionalLandingPage";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const TestCredentialsPage = lazy(() => import("./pages/TestCredentialsPage"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const DocumentationPage = lazy(() => import("./pages/DocumentationPage"));

/* ---------------- Phase 2 Pages ---------------- */

const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogsPage"));
const UserManagementPage = lazy(() => import("./pages/admin/UserManagementPage"));
const SettingsPage = lazy(() => import("./pages/profile/SettingsPage"));
const OrganizationSettingsPage = lazy(() => import("./pages/profile/OrganizationSettingsPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const OrganizationSignupPage = lazy(() => import("./pages/auth/OrganizationSignupPage"));

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

/* ---------------- Logistics Pages ---------------- */

const LogisticsShipmentTrackingPage = lazy(() => import("./pages/logistics-&-supply/LogisticsShipmentTrackingPage"));
const LogisticsInventoryManagementPage = lazy(() => import("./pages/logistics-&-supply/LogisticsInventoryManagementPage"));
const LogisticsFleetManagementPage = lazy(() => import("./pages/logistics-&-supply/LogisticsFleetManagementPage"));
const LogisticsRouteOptimizationPage = lazy(() => import("./pages/logistics-&-supply/LogisticsRouteOptimizationPage"));
const LogisticsWarehouseManagementPage = lazy(() => import("./pages/logistics-&-supply/LogisticsWarehouseManagementPage"));
const LogisticsVendorRelationsPage = lazy(() => import("./pages/logistics-&-supply/LogisticsVendorRelationsPage"));

/* ---------------- Content Pages ---------------- */

const ProjectManagementPage = lazy(() => import("./pages/content-creation/ProjectManagementPage"));
const ClientPortalPage = lazy(() => import("./pages/content-creation/ClientPortalPage"));
const ContentCalendarPage = lazy(() => import("./pages/content-creation/ContentCalendarPage"));
const CollaborationToolsPage = lazy(() => import("./pages/content-creation/CollaborationToolsPage"));
const AssetManagementPage = lazy(() => import("./pages/content-creation/AssetManagementPage"));
const TimeTrackingPage = lazy(() => import("./pages/content-creation/TimeTrackingPage"));
/* ---------------- Healthcare Pages ---------------- */

const PatientRecordsPage = lazy(() => import("./pages/healthcare/PatientRecordsPage"));
const AppointmentSchedulingPage = lazy(() => import("./pages/healthcare/AppointmentSchedulingPage"));
const MedicalHistoryPage = lazy(() => import("./pages/healthcare/MedicalHistoryPage"));
const InsuranceManagementPage = lazy(() => import("./pages/healthcare/InsuranceManagementPage"));

/* ---------------- New Logistics Pages ---------------- */

const ServiceLevelAgreementPage = lazy(() => import("./pages/logistics-&-supply/ServiceLevelAgreementPage"));

/* ---------------- New Content Pages ---------------- */

const CreativeCollaborationPage = lazy(() => import("./pages/content-creation/CreativeCollaborationPage"));
const ContentDistributionPage = lazy(() => import("./pages/content-creation/ContentDistributionPage"));
const CreatorAnalyticPage = lazy(() => import("./pages/content-creation/CreatorAnalyticPage"));
const WorkflowAutomationPage = lazy(() => import("./pages/content-creation/WorkflowAutomationPage"));

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
                        <SafeNavbar />
                        <Toaster position="top-right" richColors closeButton />

                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>

                            {/* ---------------- PUBLIC ROUTES ---------------- */}

                            <Route path="/" element={<ProfessionalLandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/register-organization" element={<OrganizationSignupPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
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

                            <Route path="/dashboard/logistics/tracking" element={<ProtectedRoute><LogisticsShipmentTrackingPage /></ProtectedRoute>} />
                            <Route path="/dashboard/logistics/inventory" element={<ProtectedRoute><LogisticsInventoryManagementPage /></ProtectedRoute>} />
                            <Route path="/dashboard/logistics/fleet" element={<ProtectedRoute><LogisticsFleetManagementPage /></ProtectedRoute>} />
                            <Route path="/dashboard/logistics/routes" element={<ProtectedRoute><LogisticsRouteOptimizationPage /></ProtectedRoute>} />
                            <Route path="/dashboard/logistics/warehouse" element={<ProtectedRoute><LogisticsWarehouseManagementPage /></ProtectedRoute>} />
                            <Route path="/dashboard/logistics/vendors" element={<ProtectedRoute><LogisticsVendorRelationsPage /></ProtectedRoute>} />
                            <Route path="/dashboard/logistics/sla" element={<ProtectedRoute><ServiceLevelAgreementPage /></ProtectedRoute>} />

                            {/* Healthcare Sub-Pages */}
                            <Route path="/dashboard/healthcare/patients" element={<ProtectedRoute><PatientRecordsPage /></ProtectedRoute>} />
                            <Route path="/dashboard/healthcare/appointments" element={<ProtectedRoute><AppointmentSchedulingPage /></ProtectedRoute>} />
                            <Route path="/dashboard/healthcare/medical-history" element={<ProtectedRoute><MedicalHistoryPage /></ProtectedRoute>} />
                            <Route path="/dashboard/healthcare/insurance" element={<ProtectedRoute><InsuranceManagementPage /></ProtectedRoute>} />

                            <Route
                                path="/dashboard/content"
                                element={
                                    <ProtectedRoute>
                                        <ContentDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="/dashboard/content/projects" element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
                            <Route path="/dashboard/content/clients" element={<ProtectedRoute><ClientPortalPage /></ProtectedRoute>} />
                            <Route path="/dashboard/content/calendar" element={<ProtectedRoute><ContentCalendarPage /></ProtectedRoute>} />
                            <Route path="/dashboard/content/collaboration" element={<ProtectedRoute><CollaborationToolsPage /></ProtectedRoute>} />
                            <Route path="/dashboard/content/assets" element={<ProtectedRoute><AssetManagementPage /></ProtectedRoute>} />
                            <Route path="/dashboard/content/time" element={<ProtectedRoute><TimeTrackingPage /></ProtectedRoute>} />
                            <Route path="/dashboard/content/creative-collab" element={<ProtectedRoute><CreativeCollaborationPage /></ProtectedRoute>} />
                            <Route path="/dashboard/content/distribution" element={<ProtectedRoute><ContentDistributionPage /></ProtectedRoute>} />
                            <Route path="/dashboard/content/analytics" element={<ProtectedRoute><CreatorAnalyticPage /></ProtectedRoute>} />
                            <Route path="/dashboard/content/workflow" element={<ProtectedRoute><WorkflowAutomationPage /></ProtectedRoute>} />

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

                            <Route
                                path="/users"
                                element={
                                    <ProtectedRoute>
                                        <UserManagementPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/organization-settings"
                                element={
                                    <ProtectedRoute>
                                        <OrganizationSettingsPage />
                                    </ProtectedRoute>
                                }
                            />

                        </Routes>
                    </Suspense>
                </Router>
            </SectorThemeProvider>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;