import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

/* ---------------- Healthcare Pages (Admin) ---------------- */
const HealthcareDashboard = lazy(() => import("../pages/dashboard/HealthcareDashboard"));
const PatientRecordsPage = lazy(() => import("../pages/healthcare/PatientRecordsPage"));
const AppointmentSchedulingPage = lazy(() => import("../pages/healthcare/AppointmentSchedulingPage"));
const MedicalHistoryPage = lazy(() => import("../pages/healthcare/MedicalHistoryPage"));
const InsuranceManagementPage = lazy(() => import("../pages/healthcare/InsuranceManagementPage"));

/* ---------------- Healthcare Pages (User) ---------------- */
const HealthcareUserDashboard = lazy(() => import("../pages/healthcare/user/HealthcareUserDashboard"));
const MyAppointmentsPage = lazy(() => import("../pages/healthcare/user/MyAppointmentsPage"));
const MyHealthRecordsPage = lazy(() => import("../pages/healthcare/user/MyHealthRecordsPage"));
const MyInsurancePage = lazy(() => import("../pages/healthcare/user/MyInsurancePage"));

export const HealthcareAdminRoutes = () => (
    <Routes>
        <Route path="/" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><HealthcareDashboard /></ProtectedRoute>} />
        <Route path="patients" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><PatientRecordsPage /></ProtectedRoute>} />
        <Route path="appointments" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><AppointmentSchedulingPage /></ProtectedRoute>} />
        <Route path="medical-history" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><MedicalHistoryPage /></ProtectedRoute>} />
        <Route path="insurance" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><InsuranceManagementPage /></ProtectedRoute>} />
    </Routes>
);

export const HealthcareUserRoutes = () => (
    <Routes>
        <Route path="dashboard" element={<ProtectedRoute requiredRoles={['USER']}><HealthcareUserDashboard /></ProtectedRoute>} />
        <Route path="appointments" element={<ProtectedRoute requiredRoles={['USER']}><MyAppointmentsPage /></ProtectedRoute>} />
        <Route path="records" element={<ProtectedRoute requiredRoles={['USER']}><MyHealthRecordsPage /></ProtectedRoute>} />
        <Route path="insurance" element={<ProtectedRoute requiredRoles={['USER']}><MyInsurancePage /></ProtectedRoute>} />
    </Routes>
);
