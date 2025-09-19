import React from 'react';
import ReactDOM from 'react-dom/client';
import { SafeThemeProvider } from './context/SafeThemeContext.jsx';
import { Provider } from 'react-redux';
import store from './app/store.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SimpleNavbar from './components/SimpleNavbar.jsx';
import SafeLandingPage from './pages/SafeLandingPage.jsx';
import './global.css';

// Working App with SimpleNavbar (no auth required)
const WorkingApp = () => {
  return (
    <Router>
      <SimpleNavbar />
      <Routes>
        <Route path="/" element={<SafeLandingPage />} />
        <Route path="*" element={<div style={{ padding: '20px' }}>
          <h1>Page Not Found</h1>
          <a href="/" style={{ color: 'blue' }}>← Back to Home</a>
        </div>} />
      </Routes>
    </Router>
  );
};

console.log('Starting working CMS Platform...');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <SafeThemeProvider>
                <WorkingApp />
            </SafeThemeProvider>
        </Provider>
    </React.StrictMode>
);