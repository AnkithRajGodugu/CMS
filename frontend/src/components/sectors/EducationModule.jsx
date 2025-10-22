import React from 'react';
import { Routes, Route } from 'react-router-dom';

const EducationDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Education Dashboard</h1>
    <p>Welcome to the Education sector.</p>
  </div>
);

const EducationModule = () => {
  return (
    <Routes>
      <Route path="/" element={<EducationDashboard />} />
      <Route path="/dashboard" element={<EducationDashboard />} />
    </Routes>
  );
};

export default EducationModule;
