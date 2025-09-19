import React from 'react';

class SimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error('Error caught:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
            <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#dc2626' }}>
              Something went wrong
            </h1>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              An error occurred while loading the application.
            </p>
            <button 
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#1e40af', 
                color: 'white', 
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
            <div style={{ marginTop: '20px' }}>
              <a 
                href="/simple" 
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#059669', 
                  color: 'white', 
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                Try Simple Version
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SimpleErrorBoundary;