import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import SectorRouter from '../SectorRouter';

// Mock the sector modules
vi.mock('../sectors/BankingModule', () => ({
  default: () => <div>Banking Module</div>
}));

vi.mock('../sectors/HealthcareModule', () => ({
  default: () => <div>Healthcare Module</div>
}));

vi.mock('../sectors/EducationModule', () => ({
  default: () => <div>Education Module</div>
}));

vi.mock('../sectors/RetailModule', () => ({
  default: () => <div>Retail Module</div>
}));

vi.mock('../sectors/ManufacturingModule', () => ({
  default: () => <div>Manufacturing Module</div>
}));

vi.mock('../sectors/LogisticsModule', () => ({
  default: () => <div>Logistics Module</div>
}));

vi.mock('../sectors/ContentCreationModule', () => ({
  default: () => <div>Content Creation Module</div>
}));

vi.mock('../../pages/SectorSelectionPage', () => ({
  default: () => <div>Sector Selection Page</div>
}));

describe('SectorRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to login when not authenticated', async () => {
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

  it('should redirect to sector selection when no sector assigned', async () => {
    const authValue = {
      isAuthenticated: true,
      user: { id: 1, username: 'testuser' },
      sector: null,
      detectSector: vi.fn().mockResolvedValue(null),
    };

    renderWithProviders(<SectorRouter />, { authValue, route: '/banking' });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/select-sector');
    });
  });

  it('should render banking module when sector is banking', async () => {
    const authValue = {
      isAuthenticated: true,
      user: { id: 1, username: 'testuser' },
      sector: { code: 'BANKING', routePath: '/banking' },
      detectSector: vi.fn(),
    };

    renderWithProviders(<SectorRouter />, { authValue, route: '/banking' });

    await waitFor(() => {
      expect(screen.getByText('Banking Module')).toBeInTheDocument();
    });
  });

  it('should call detectSector when sector is not loaded', async () => {
    const detectSector = vi.fn().mockResolvedValue({
      code: 'HEALTHCARE',
      routePath: '/healthcare'
    });

    const authValue = {
      isAuthenticated: true,
      user: { id: 1, username: 'testuser' },
      sector: null,
      detectSector,
    };

    renderWithProviders(<SectorRouter />, { authValue, route: '/healthcare' });

    await waitFor(() => {
      expect(detectSector).toHaveBeenCalled();
    });
  });

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
});
