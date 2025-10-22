import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Lazy load sector modules
const BankingModule = React.lazy(() => import('./sectors/BankingModule'));
const HealthcareModule = React.lazy(() => import('./sectors/HealthcareModule'));
const EducationModule = React.lazy(() => import('./sectors/EducationModule'));
const RetailModule = React.lazy(() => import('./sectors/RetailModule'));
const ManufacturingModule = React.lazy(() => import('./sectors/ManufacturingModule'));
const LogisticsModule = React.lazy(() => import('./sectors/LogisticsModule'));
const ContentCreationModule = React.lazy(() => import('./sectors/ContentCreationModule'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="loading loading-spinner loading-lg text-primary"></div>
  </div>
);

// Sector selection page placeholder
const SectorSelectionPage = React.lazy(() => import('../pages/SectorSelectionPage'));

/**
 * SectorRouter component handles automatic sector detection and routing
 * Requirements: 1.3, 6.3
 */
export const SectorRouter = () => {
  const { sector, user, detectSector, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeSector = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      // If sector is already loaded from localStorage, use it
      if (sector) {
        setLoading(false);
        return;
      }

      // Try to detect sector from backend
      try {
        const detectedSector = await detectSector();
        if (detectedSector && detectedSector.routePath) {
          // Only redirect if not already on the correct path
          if (!location.pathname.startsWith(detectedSector.routePath)) {
            navigate(detectedSector.routePath);
          }
        } else {
          // No sector assigned, redirect to sector selection
          if (location.pathname !== '/select-sector') {
            navigate('/select-sector');
          }
        }
      } catch (err) {
        console.error('Error detecting sector:', err);
        setError('Failed to detect sector');
      } finally {
        setLoading(false);
      }
    };

    initializeSector();
  }, [sector, user, isAuthenticated, detectSector, navigate, location.pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!sector) {
    return <Navigate to="/select-sector" />;
  }

  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/banking/*" element={<BankingModule />} />
        <Route path="/healthcare/*" element={<HealthcareModule />} />
        <Route path="/education/*" element={<EducationModule />} />
        <Route path="/retail/*" element={<RetailModule />} />
        <Route path="/manufacturing/*" element={<ManufacturingModule />} />
        <Route path="/logistics/*" element={<LogisticsModule />} />
        <Route path="/content-creation/*" element={<ContentCreationModule />} />
        <Route path="/select-sector" element={<SectorSelectionPage />} />
        
        {/* Redirect to user's sector dashboard by default */}
        <Route 
          path="*" 
          element={<Navigate to={sector?.routePath || '/select-sector'} replace />} 
        />
      </Routes>
    </React.Suspense>
  );
};

export default SectorRouter;
