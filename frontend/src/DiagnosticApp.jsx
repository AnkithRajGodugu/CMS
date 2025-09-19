import React from 'react';

// Minimal diagnostic component to test what's working
const DiagnosticApp = () => {
  console.log('DiagnosticApp rendering...');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'blue', marginBottom: '20px' }}>🔍 Diagnostic Mode</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>System Check</h2>
        <ul>
          <li>✅ React is rendering</li>
          <li>✅ JavaScript is working</li>
          <li>✅ Styles are applying</li>
        </ul>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Test Links</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/simple" style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Simple Landing
          </a>
          <a href="/counter" style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Redux Counter
          </a>
          <a href="/theme-test" style={{ padding: '10px 20px', backgroundColor: 'purple', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
            Theme Test
          </a>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>Debug Info</h2>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
      </div>
    </div>
  );
};

export default DiagnosticApp;