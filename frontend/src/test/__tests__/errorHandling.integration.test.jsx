import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import SectorRouter from '../../components/SectorRouter';
import SectorLayout from '../../components/shared/SectorLayout';

// Mock sector modules
vi.mock('../../components/sectors/BankingModule', () => ({
  default: () => <div>Banking Module</div>
}));

vi.mock('../../components/sectors/HealthcareModule', () => ({
  default: () => <div>Healthcare Module</div>
}));

vi.mock('../../components/sectors/EducationModule', () => ({
  default: () => <div>Education Module</div>
}));

vi.mock('../../components/sectors/RetailModule', () => ({
  default: () => <div>Retail Module</div>
}));

vi.mock('../../components/sectors/ManufacturingModule', () => ({
  default: () => <div>Manufacturing Module</div>
}));

vi.mock('../../components/sectors/LogisticsModule', () => ({
  default: () => <div>Logistics Module</div>
}));

vi.mock('../../components/sectors/ContentCreationModule', () => ({
  default: () => <div>Content Creation Module</div>
}));

vi.mock('../../pages/SectorSelectionPage', () => ({
  default: () => <div>Sector Selection Page</div>
}));

// Mock child components for SectorLayout
vi.mock('../../components/shared/SectorHeader', () => ({
  default: () => <div>Header</div>
}));

vi.mock('../../components/shared/SectorSidebar', () => ({
  default: () => <div>Sidebar</div>
}));

vi.mock('../../hooks/useSectorTheme', () => ({
  useSectorTheme: () => ({
    changeSector: vi.fn(),
    currentTheme: { id: 'banking', name: 'Banking' }
  })
}));

describe('Error Handling Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SectorRouter Error Handling', () => {
    it('should display error message when sector detection fails', async () => {
      const detectSector = vi.fn().mockRejectedValue(new Error('Network error'));

      const authValue = {
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        sector: null,
        detectSector,
      };

      renderWithProviders(<SectorRouter />, { authValue });

      await waitFor(() => {
        expect(screen.getByText('Failed to detect sector')).toBeInTheDocument();
      });
    });

    it('should display error when API returns 500', async () => {
      const detectSector = vi.fn().mockRejectedValue({
        response: { status: 500, data: { message: 'Internal server error' } }
      });

      const authValue = {
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        sector: null,
        detectSector,
      };

      renderWithProviders(<SectorRouter />, { authValue });

      await waitFor(() => {
        expect(screen.getByText('Failed to detect sector')).toBeInTheDocument();
      });
    });

    it('should handle timeout errors', async () => {
      const detectSector = vi.fn().mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded'
      });

      const authValue = {
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        sector: null,
        detectSector,
      };

      renderWithProviders(<SectorRouter />, { authValue });

      await waitFor(() => {
        expect(screen.getByText('Failed to detect sector')).toBeInTheDocument();
      });
    });

    it('should redirect to login on 401 unauthorized', async () => {
      const authValue = {
        isAuthenticated: false,
        user: null,
        sector: null,
        detectSector: vi.fn(),
      };

      renderWithProviders(<SectorRouter />, { authValue, route: '/banking' });

      await waitFor(() => {
        expect(window.location.pathname).toBe('/login');
      });
    });

    it('should handle missing sector assignment', async () => {
      const detectSector = vi.fn().mockResolvedValue(null);

      const authValue = {
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        sector: null,
        detectSector,
      };

      renderWithProviders(<SectorRouter />, { authValue });

      await waitFor(() => {
        expect(window.location.pathname).toBe('/select-sector');
      });
    });
  });

  describe('SectorLayout Error Handling', () => {
    it('should render gracefully when sector is null', () => {
      renderWithProviders(
        <SectorLayout sector={null}>
          <div>Content</div>
        </SectorLayout>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render gracefully when sector is undefined', () => {
      renderWithProviders(
        <SectorLayout sector={undefined}>
          <div>Content</div>
        </SectorLayout>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle missing sector properties', () => {
      const incompleteSector = { code: 'BANKING' }; // Missing name and routePath

      renderWithProviders(
        <SectorLayout sector={incompleteSector}>
          <div>Content</div>
        </SectorLayout>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Authentication Error Handling', () => {
    it('should handle expired token scenario', async () => {
      const detectSector = vi.fn().mockRejectedValue({
        response: { status: 401, data: { message: 'Token expired' } }
      });

      const authValue = {
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        sector: null,
        detectSector,
      };

      renderWithProviders(<SectorRouter />, { authValue });

      await waitFor(() => {
        expect(screen.getByText('Failed to detect sector')).toBeInTheDocument();
      });
    });

    it('should handle invalid token scenario', async () => {
      const detectSector = vi.fn().mockRejectedValue({
        response: { status: 401, data: { message: 'Invalid token' } }
      });

      const authValue = {
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        sector: null,
        detectSector,
      };

      renderWithProviders(<SectorRouter />, { authValue });

      await waitFor(() => {
        expect(screen.getByText('Failed to detect sector')).toBeInTheDocument();
      });
    });
  });

  describe('Network Error Handling', () => {
    it('should handle network connection errors', async () => {
      const detectSector = vi.fn().mockRejectedValue({
        message: 'Network Error',
        code: 'ERR_NETWORK'
      });

      const authValue = {
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        sector: null,
        detectSector,
      };

      renderWithProviders(<SectorRouter />, { authValue });

      await waitFor(() => {
        expect(screen.getByText('Failed to detect sector')).toBeInTheDocument();
      });
    });

    it('should handle DNS resolution errors', async () => {
      const detectSector = vi.fn().mockRejectedValue({
        message: 'getaddrinfo ENOTFOUND',
        code: 'ENOTFOUND'
      });

      const authValue = {
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        sector: null,
        detectSector,
      };

      renderWithProviders(<SectorRouter />, { authValue });

      await waitFor(() => {
        expect(screen.getByText('Failed to detect sector')).toBeInTheDocument();
      });
    });
  });
});
