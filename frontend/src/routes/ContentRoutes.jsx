import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

/* ---------------- Content Pages (Admin) ---------------- */
const ContentDashboard = lazy(() => import("../pages/dashboard/ContentDashboard"));
const ProjectManagementPage = lazy(() => import("../pages/content-creation/ProjectManagementPage"));
const ClientPortalPage = lazy(() => import("../pages/content-creation/ClientPortalPage"));
const ContentCalendarPage = lazy(() => import("../pages/content-creation/ContentCalendarPage"));
const CollaborationToolsPage = lazy(() => import("../pages/content-creation/CollaborationToolsPage"));
const AssetManagementPage = lazy(() => import("../pages/content-creation/AssetManagementPage"));
const TimeTrackingPage = lazy(() => import("../pages/content-creation/TimeTrackingPage"));
const CreativeCollaborationPage = lazy(() => import("../pages/content-creation/CreativeCollaborationPage"));
const ContentDistributionPage = lazy(() => import("../pages/content-creation/ContentDistributionPage"));
const CreatorAnalyticPage = lazy(() => import("../pages/content-creation/CreatorAnalyticPage"));
const WorkflowAutomationPage = lazy(() => import("../pages/content-creation/WorkflowAutomationPage"));

/* ---------------- Content Pages (User) ---------------- */
const ContentUserDashboard = lazy(() => import("../pages/content-creation/user/ContentUserDashboard"));
const MyTasksPage = lazy(() => import("../pages/content-creation/user/MyTasksPage"));
const MyCalendarPage = lazy(() => import("../pages/content-creation/user/MyCalendarPage"));
const MyProjectsPage = lazy(() => import("../pages/content-creation/user/MyProjectsPage"));

export const ContentAdminRoutes = () => (
    <Routes>
        <Route path="/" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><ContentDashboard /></ProtectedRoute>} />
        <Route path="projects" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><ProjectManagementPage /></ProtectedRoute>} />
        <Route path="clients" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><ClientPortalPage /></ProtectedRoute>} />
        <Route path="calendar" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><ContentCalendarPage /></ProtectedRoute>} />
        <Route path="collaboration" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><CollaborationToolsPage /></ProtectedRoute>} />
        <Route path="assets" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><AssetManagementPage /></ProtectedRoute>} />
        <Route path="time" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><TimeTrackingPage /></ProtectedRoute>} />
        <Route path="creative-collab" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><CreativeCollaborationPage /></ProtectedRoute>} />
        <Route path="distribution" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><ContentDistributionPage /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><CreatorAnalyticPage /></ProtectedRoute>} />
        <Route path="workflow" element={<ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'SUPERADMIN']}><WorkflowAutomationPage /></ProtectedRoute>} />
    </Routes>
);

export const ContentUserRoutes = () => (
    <Routes>
        <Route path="dashboard" element={<ProtectedRoute requiredRoles={['USER']}><ContentUserDashboard /></ProtectedRoute>} />
        <Route path="tasks" element={<ProtectedRoute requiredRoles={['USER']}><MyTasksPage /></ProtectedRoute>} />
        <Route path="calendar" element={<ProtectedRoute requiredRoles={['USER']}><MyCalendarPage /></ProtectedRoute>} />
        <Route path="projects" element={<ProtectedRoute requiredRoles={['USER']}><MyProjectsPage /></ProtectedRoute>} />
    </Routes>
);
