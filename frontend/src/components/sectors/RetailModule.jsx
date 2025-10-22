import React from 'react';
import { Routes, Route } from 'react-router-dom';

const RetailDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Retail Dashboard</h1>
    <p>Welcome to the Retail sector.</p>
  </div>
);

const RetailModule = () => {
  return (
    <Routes>
      <Route path="/" element={<RetailDashboard />} />
      <Route path="/dashboard" element={<RetailDashboard />} />
    </Routes>
  );
};

export default RetailModule;
