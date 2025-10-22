import React from 'react';
import { Routes, Route } from 'react-router-dom';

const LogisticsDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Logistics Dashboard</h1>
    <p>Welcome to the Logistics & Supply Chain sector.</p>
  </div>
);

const LogisticsModule = () => {
  return (
    <Routes>
      <Route path="/" element={<LogisticsDashboard />} />
      <Route path="/dashboard" element={<LogisticsDashboard />} />
    </Routes>
  );
};

export default LogisticsModule;
