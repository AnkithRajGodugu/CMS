import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import SectorLayout from '../SectorLayout';

// Mock the child components
vi.mock('../SectorHeader', () => ({
  default: ({ sector, onToggleSidebar }) => (
    <div data-testid="sector-header">
      <span>{sector?.name} Header</span>
      <button onClick={onToggleSidebar}>Toggle</button>
    </div>
  )
}));

vi.mock('../SectorSidebar', () => ({
  default: ({ sector, collapsed }) => (
    <div data-testid="sector-sidebar" data-collapsed={collapsed}>
      {sector?.name} Sidebar
    </div>
  )
}));

// Mock the useSectorTheme hook
vi.mock('../../../hooks/useSectorTheme', () => ({
  useSectorTheme: () => ({
    changeSector: vi.fn(),
    currentTheme: { id: 'banking', name: 'Banking' }
  })
}));

describe('SectorLayout', () => {
  const mockSector = {
    code: 'BANKING',
    name: 'Banking & Finance',
    routePath: '/banking'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render header, sidebar, and main content', () => {
    renderWithProviders(
      <SectorLayout sector={mockSector}>
        <div>Test Content</div>
      </SectorLayout>
    );

    expect(screen.getByTestId('sector-header')).toBeInTheDocument();
    expect(screen.getByTestId('sector-sidebar')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should display sector name in header', () => {
    renderWithProviders(
      <SectorLayout sector={mockSector}>
        <div>Content</div>
      </SectorLayout>
    );

    expect(screen.getByText('Banking & Finance Header')).toBeInTheDocument();
  });

  it('should apply correct data-theme attribute', () => {
    const { container } = renderWithProviders(
      <SectorLayout sector={mockSector}>
        <div>Content</div>
      </SectorLayout>
    );

    const mainDiv = container.querySelector('[data-theme]');
    expect(mainDiv).toHaveAttribute('data-theme', 'banking');
  });

  it('should have proper accessibility attributes', () => {
    const { container } = renderWithProviders(
      <SectorLayout sector={mockSector}>
        <div>Content</div>
      </SectorLayout>
    );

    const mainElement = container.querySelector('[role="main"]');
    expect(mainElement).toHaveAttribute('aria-label', 'Banking & Finance Layout');

    const contentRegion = container.querySelector('[role="region"]');
    expect(contentRegion).toHaveAttribute('aria-label', 'Main content');
  });

  it('should render children inside main content area', () => {
    renderWithProviders(
      <SectorLayout sector={mockSector}>
        <div data-testid="child-content">Child Component</div>
      </SectorLayout>
    );

    const childContent = screen.getByTestId('child-content');
    expect(childContent).toBeInTheDocument();
    expect(childContent).toHaveTextContent('Child Component');
  });
});
