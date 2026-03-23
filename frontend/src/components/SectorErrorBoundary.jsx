import React from 'react';
import { logComponentError } from '../utils/errorLogger';

/**
 * SectorErrorFallback component displays a user-friendly error message
 * Requirements: 10.1, 10.2
 */
export const SectorErrorFallback = ({ error, sector, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-error mr-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="card-title text-2xl">Something went wrong</h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              We encountered an error while loading the {sector?.name || 'sector'} module.
              This issue has been logged and our team will investigate.
            </p>
            
            {import.meta.env.MODE === 'development' && error && (
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="font-mono text-sm text-error mb-2">
                  {error.toString()}
                </p>
                {error.stack && (
                  <pre className="text-xs overflow-auto max-h-48 text-gray-600">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>

          <div className="card-actions justify-end">
            <button
              className="btn btn-ghost"
              onClick={() => window.location.href = '/'}
            >
              Go to Home
            </button>
            {resetError && (
              <button
                className="btn btn-primary"
                onClick={resetError}
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SectorErrorBoundary component catches errors in sector modules
 * Requirements: 10.1, 10.2
 */
export class SectorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Store error info in state
    this.setState({
      error,
      errorInfo
    });

    // Log error using centralized error logger
    const componentName = this.props.sector?.name 
      ? `${this.props.sector.name} Sector Module` 
      : 'Sector Module';
    
    logComponentError(error, errorInfo, componentName);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SectorErrorFallback
          error={this.state.error}
          sector={this.props.sector}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default SectorErrorBoundary;
