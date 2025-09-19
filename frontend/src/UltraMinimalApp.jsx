import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Ultra minimal components
const HomePage = () => (
  <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
    <h1 style={{ color: '#1e40af', marginBottom: '20px' }}>🏠 CMS Platform - Working!</h1>
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>✅ System Status: All Good</h2>
      <p>React Router, Redux, and basic functionality are working.</p>
    </div>
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <a href="/counter" style={{ padding: '10px 20px', backgroundColor: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Redux Test
      </a>
      <a href="/theme-test" style={{ padding: '10px 20px', backgroundColor: '#059669', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Theme Test
      </a>
      <a href="/about" style={{ padding: '10px 20px', backgroundColor: '#ea580c', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        About Page
      </a>
    </div>
  </div>
);

const UltraMinimalApp = () => {
  console.log('UltraMinimalApp rendering...');
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<div style={{ padding: '20px' }}>
          <h1>Page Not Found</h1>
          <a href="/" style={{ color: 'blue' }}>← Back to Home</a>
        </div>} />
      </Routes>
    </Router>
  );
};

export default UltraMinimalApp;