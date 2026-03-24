import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /login if user is not authenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, user: null, loading: false });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/protected" element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Login Page')).toBeTruthy();
  });

  it('renders content if authenticated and no specific roles are required', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { id: 1, role: 'USER' }, loading: false });

    const { getByText, queryByText } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Protected Content')).toBeTruthy();
  });

  it('renders content if user role is in requiredRoles array', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { id: 1, role: 'MANAGER' }, loading: false });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/admin-dashboard']}>
        <Routes>
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <div>Admin Dashboard</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Admin Dashboard')).toBeTruthy();
  });

  it('redirects to /unauthorized if user role is NOT in requiredRoles array', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { id: 1, role: 'USER' }, loading: false });

    const { getByText, queryByText } = render(
      <MemoryRouter initialEntries={['/admin-dashboard']}>
        <Routes>
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
              <div>Admin Dashboard</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Unauthorized Access')).toBeTruthy();
    expect(queryByText('Admin Dashboard')).toBeNull();
  });
});
