import React from 'react';
import { Routes, Route } from 'react-router-dom';

const HealthcareDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Healthcare Dashboard</h1>
    <p>Welcome to the Healthcare sector.</p>
  </div>
);

const HealthcareModule = () => {
  return (
    <Routes>
      <Route path="/" element={<HealthcareDashboard />} />
      <Route path="/dashboard" element={<HealthcareDashboard />} />
    </Routes>
  );
};

export default HealthcareModule;
