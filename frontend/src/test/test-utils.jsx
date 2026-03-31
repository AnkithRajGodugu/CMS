import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/auth';

// Mock auth context provider
export const MockAuthProvider = ({ children, value }) => {
  const defaultValue = {
    user: null,
    sector: null,
    login: () => {},
    logout: () => {},
    detectSector: async () => null,
    isAuthenticated: false,
  };

  return (
    <AuthContext.Provider value={{ ...defaultValue, ...value }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom render function with providers
export const renderWithProviders = (ui, options = {}) => {
  const {
    authValue = {},
    route = '/',
    ...renderOptions
  } = options;

  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <MockAuthProvider value={authValue}>
        {children}
      </MockAuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { renderWithProviders as render };
