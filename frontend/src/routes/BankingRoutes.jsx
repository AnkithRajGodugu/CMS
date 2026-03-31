import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

/* ---------------- Banking Pages (Admin) ---------------- */
const BankingDashboard = lazy(() => import("../pages/dashboard/BankingDashboard"));
const AccountManagementPage = lazy(() => import("../pages/banking/AccountManagementPage"));
const TransactionTrackingPage = lazy(() => import("../pages/banking/TransactionTrackingPage"));
const ComplianceToolsPage = lazy(() => import("../pages/banking/ComplianceToolsPage"));
const RiskAssessmentPage = lazy(() => import("../pages/banking/RiskAssessmentPage"));
const CustomersPage = lazy(() => import("../pages/banking/CustomersPage"));

/* ---------------- Banking Pages (User) ---------------- */
const BankingUserDashboard = lazy(() => import("../pages/banking/user/BankingUserDashboard"));
const BankingTransactionsPage = lazy(() => import("../pages/banking/user/BankingTransactionsPage"));
const BankingTransferPage = lazy(() => import("../pages/banking/user/BankingTransferPage"));
const BankingStatementsPage = lazy(() => import("../pages/banking/user/BankingStatementsPage"));

export const BankingAdminRoutes = () => (
    <Routes>
        <Route path="/" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><BankingDashboard /></ProtectedRoute>} />
        <Route path="accounts" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><AccountManagementPage /></ProtectedRoute>} />
        <Route path="transactions" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><TransactionTrackingPage /></ProtectedRoute>} />
        <Route path="compliance" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><ComplianceToolsPage /></ProtectedRoute>} />
        <Route path="risk" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><RiskAssessmentPage /></ProtectedRoute>} />
        <Route path="customers" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><CustomersPage /></ProtectedRoute>} />
    </Routes>
);

export const BankingUserRoutes = () => (
    <Routes>
        <Route path="dashboard" element={<ProtectedRoute requiredRoles={['USER']}><BankingUserDashboard /></ProtectedRoute>} />
        <Route path="transactions" element={<ProtectedRoute requiredRoles={['USER']}><BankingTransactionsPage /></ProtectedRoute>} />
        <Route path="transfer" element={<ProtectedRoute requiredRoles={['USER']}><BankingTransferPage /></ProtectedRoute>} />
        <Route path="statements" element={<ProtectedRoute requiredRoles={['USER']}><BankingStatementsPage /></ProtectedRoute>} />
    </Routes>
);
