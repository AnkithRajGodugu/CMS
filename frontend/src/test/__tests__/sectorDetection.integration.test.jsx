import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import SectorRouter from '../../components/SectorRouter';
import api from '../../services/api';

// Mock API
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
  }
}));

// Mock sector modules
vi.mock('../../components/sectors/BankingModule', () => ({
  default: () => <div>Banking Dashboard</div>
}));

vi.mock('../../components/sectors/HealthcareModule', () => ({
  default: () => <div>Healthcare Dashboard</div>
}));

vi.mock('../../components/sectors/EducationModule', () => ({
  default: () => <div>Education Dashboard</div>
}));

vi.mock('../../components/sectors/RetailModule', () => ({
  default: () => <div>Retail Dashboard</div>
}));

vi.mock('../../components/sectors/ManufacturingModule', () => ({
  default: () => <div>Manufacturing Dashboard</div>
}));

vi.mock('../../components/sectors/LogisticsModule', () => ({
  default: () => <div>Logistics Dashboard</div>
}));

vi.mock('../../components/sectors/ContentCreationModule', () => ({
  default: () => <div>Content Creation Dashboard</div>
}));

vi.mock('../../pages/SectorSelectionPage', () => ({
  default: () => <div>Select Your Sector</div>
}));

describe('Sector Detection Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect banking sector and redirect to banking dashboard', async () => {
    const detectSector = vi.fn().mockResolvedValue({
      code: 'BANKING',
      name: 'Banking & Finance',
      routePath: '/banking'
    });

    const authValue = {
      isAuthenticated: true,
      user: { id: 1, username: 'bankuser' },
      sector: null,
      detectSector,
    };

    renderWithProviders(<SectorRouter />, { authValue, route: '/' });

    await waitFor(() => {
      expect(detectSector).toHaveBeenCalled();
    });
  });

  it('should detect healthcare sector and redirect to healthcare dashboard', async () => {
    const detectSector = vi.fn().mockResolvedValue({
      code: 'HEALTHCARE',
      name: 'Healthcare',
      routePath: '/healthcare'
    });

    const authValue = {
      isAuthenticated: true,
      user: { id: 2, username: 'healthuser' },
      sector: null,
      detectSector,
    };

    renderWithProviders(<SectorRouter />, { authValue, route: '/' });

    await waitFor(() => {
      expect(detectSector).toHaveBeenCalled();
    });
  });

  it('should show sector selection when user has no assigned sector', async () => {
    const detectSector = vi.fn().mockResolvedValue(null);

    const authValue = {
      isAuthenticated: true,
      user: { id: 3, username: 'newuser' },
      sector: null,
      detectSector,
    };

    renderWithProviders(<SectorRouter />, { authValue, route: '/' });

    await waitFor(() => {
      expect(detectSector).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/select-sector');
    });
  });

  it('should use cached sector data when available', async () => {
    const detectSector = vi.fn();

    const authValue = {
      isAuthenticated: true,
      user: { id: 1, username: 'bankuser' },
      sector: {
        code: 'BANKING',
        name: 'Banking & Finance',
        routePath: '/banking'
      },
      detectSector,
    };

    renderWithProviders(<SectorRouter />, { authValue, route: '/banking' });

    await waitFor(() => {
      expect(screen.getByText('Banking Dashboard')).toBeInTheDocument();
    });

    // Should not call detectSector when sector is already loaded
    expect(detectSector).not.toHaveBeenCalled();
  });

  it('should handle sector detection API failure gracefully', async () => {
    const detectSector = vi.fn().mockRejectedValue(new Error('API Error'));

    const authValue = {
      isAuthenticated: true,
      user: { id: 1, username: 'testuser' },
      sector: null,
      detectSector,
    };

    renderWithProviders(<SectorRouter />, { authValue, route: '/' });

    await waitFor(() => {
      expect(screen.getByText('Failed to detect sector')).toBeInTheDocument();
    });
  });

  it('should redirect unauthenticated users to login', async () => {
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

  it('should support multiple sector types', async () => {
    const sectors = [
      { code: 'BANKING', routePath: '/banking' },
      { code: 'HEALTHCARE', routePath: '/healthcare' },
      { code: 'EDUCATION', routePath: '/education' },
      { code: 'RETAIL', routePath: '/retail' },
      { code: 'MANUFACTURING', routePath: '/manufacturing' },
    ];

    for (const sector of sectors) {
      const detectSector = vi.fn().mockResolvedValue(sector);

      const authValue = {
        isAuthenticated: true,
        user: { id: 1, username: 'testuser' },
        sector,
        detectSector,
      };

      const { unmount } = renderWithProviders(
        <SectorRouter />, 
        { authValue, route: sector.routePath }
      );

      await waitFor(() => {
        expect(screen.getByText(new RegExp(sector.code.split('_').join(' '), 'i'))).toBeInTheDocument();
      });

      unmount();
    }
  });
});
