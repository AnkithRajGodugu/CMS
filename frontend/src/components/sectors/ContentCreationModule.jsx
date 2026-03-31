import React from 'react';
import { Routes, Route } from 'react-router-dom';

const ContentCreationDashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Content Creation Dashboard</h1>
    <p>Welcome to the Content Creation sector.</p>
  </div>
);

const ContentCreationModule = () => {
  return (
    <Routes>
      <Route path="/" element={<ContentCreationDashboard />} />
      <Route path="/dashboard" element={<ContentCreationDashboard />} />
    </Routes>
  );
};

export default ContentCreationModule;
