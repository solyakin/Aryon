import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecommendationDetails from '../../components/dashboard/RecommendationDetails';

describe('RecommendationDetails', () => {
  const mockProps = {
    open: true,
    status: 'active', // Add a mock status value
    setOpen: vi.fn(),
    fetchRecommendations: vi.fn(),
    item: {
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
      }
  };

  it('renders when open is true', () => {
    render(<RecommendationDetails {...mockProps} />);
    expect(screen.getByText(mockProps.item.title)).toBeInTheDocument();
  });

  it('displays value score correctly', () => {
    render(<RecommendationDetails {...mockProps} />);
    expect(screen.getByText(/value score/i)).toBeInTheDocument();
  });

  it('shows environment information', () => {
    render(<RecommendationDetails {...mockProps} />);
    expect(screen.getByText(/azure environment/i)).toBeInTheDocument();
  });

  it('displays reasons for recommendation', () => {
    render(<RecommendationDetails {...mockProps} />);
    mockProps.item.reasons.forEach(reason => {
      expect(screen.getByText(reason)).toBeInTheDocument();
    });
  });
});
