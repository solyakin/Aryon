import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RecommendationCard from '../../components/dashboard/RecommendationCard';
import type { RecommendationDataProps } from '@/types/global';

// Mock RecommendationDetails component
vi.mock('../../components/dashboard/RecommendationDetails', () => ({
  default: vi.fn(({ open, item }) => (
    open ? <div data-testid="mock-drawer">Drawer Content for {item.title}</div> : null
  ))
}));

describe('RecommendationCard', () => {
  const mockItem: RecommendationDataProps = {
    recommendationId: '1',
    title: 'Test Recommendation',
    description: 'Test Description',
    reasons: ['Reason 1', 'Reason 2'],
    impactAssessment: {
      totalViolations: 10,
      mostImpactedScope: {
        name: 'Scope 1',
        type: 'Type 1',
        count: 5
      }
    },
    frameworks: [],
    provider: [],
    score: 3,
    tenantId: 'tenant-1',
    slug: 'test-recommendation',
    totalHistoricalViolations: 5,
    class: 1,
    furtherReading: [],
    affectedResources: []
  };

  it('renders recommendation title', () => {
    render(<RecommendationCard status="active" item={mockItem} />);
    expect(screen.getByText(mockItem.title)).toBeInTheDocument();
  });

  it('renders recommendation description', () => {
    render(<RecommendationCard status="active" item={mockItem} />);
    expect(screen.getByText(mockItem.description)).toBeInTheDocument();
  });

  it('renders all reasons', () => {
    render(<RecommendationCard status='active' item={mockItem} />);
    mockItem.reasons.forEach(reason => {
      expect(screen.getByText(reason)).toBeInTheDocument();
    });
  });

  it('renders impact assessment', () => {
    render(<RecommendationCard status='active' item={mockItem} />);
    expect(screen.getByText('Impact assessment')).toBeInTheDocument();
    expect(screen.getByText(`~ ${mockItem.impactAssessment.totalViolations}/ month`)).toBeInTheDocument();
  });

  it('renders value score', () => {
    render(<RecommendationCard status='active' item={mockItem} />);
    expect(screen.getByText('Value score')).toBeInTheDocument();
    // Check for value score indicators (dots)
    const container = screen.getByText('Value score').parentElement?.nextElementSibling;
    expect(container?.children).toHaveLength(4); // Should have 4 dots
  });

  it('opens recommendation details on click', () => {
    render(<RecommendationCard status='active' item={mockItem} />);

    // Initially, drawer should not be visible
    expect(screen.queryByTestId('mock-drawer')).not.toBeInTheDocument();
    
    // Find and click the clickable area
    const clickableArea = screen.getByText(mockItem.title).parentElement?.parentElement;
    fireEvent.click(clickableArea!);
    
    // After click, drawer should be visible with correct content
    const drawer = screen.getByTestId('mock-drawer');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveTextContent(`Drawer Content for ${mockItem.title}`);
  });
});
