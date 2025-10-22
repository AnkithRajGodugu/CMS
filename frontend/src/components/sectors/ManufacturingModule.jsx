import React from 'react';
import { Routes, Route } from 'react-router-dom';

const ManufacturingDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Manufacturing Dashboard</h1>
    <p>Welcome to the Manufacturing sector.</p>
  </div>
);

const ManufacturingModule = () => {
  return (
    <Routes>
      <Route path="/" element={<ManufacturingDashboard />} />
      <Route path="/dashboard" element={<ManufacturingDashboard />} />
    </Routes>
  );
};

export default ManufacturingModule;
