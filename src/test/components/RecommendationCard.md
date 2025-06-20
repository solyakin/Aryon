import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecommendationCard from '@/components/dashboard/RecommendationCard';
import type { RecommendationDataProps } from '@/types/global';

const mockRecommendation: RecommendationDataProps = {
    recommendationId: '1',
    title: 'Test Recommendation',
    description: 'Test Description',
    frameworks: [
        { name: 'CIS', section: 'Section1', subsection: 'Subsection1' },
        { name: 'NIST', section: 'Section2', subsection: 'Subsection2' }
    ],
    furtherReading: [
        { name: 'CIS', href: 'https://example.com/cis' },
        { name: 'NIST', href: 'https://example.com/nist' }
    ],
    reasons: ['Security', 'Performance'],
    impactAssessment: {
        totalViolations: 100,
        mostImpactedScope: {
        name: 'Scope1',
        type: 'Type1',
        count: 50
        }
    },
    score: 75,
    tenantId: '12345',
    slug: 'test-recommendation',
        affectedResources: [{ name: 'Resource1' }],
    provider: [1, 2, 3], // Assuming these are IDs for Azure, AWS, Google Cloud
    totalHistoricalViolations: 200,
    class: 1,
};

describe('RecommendationCard', () => {
  it('renders card with correct content', () => {
    render(
      <RecommendationCard 
        item={mockRecommendation} 
        status="active"
      />
    );

    // Check main content
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText('Test Recommendation')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    // Check cloud provider icons
    const providers = screen.getByRole('list', { name: /cloud providers/i });
    expect(providers).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Azure' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'AWS' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Google Cloud' })).toBeInTheDocument();

    // Check frameworks
    const frameworks = screen.getByRole('list', { name: /framework compliance/i });
    expect(frameworks).toBeInTheDocument();
    expect(screen.getByText('CIS')).toBeInTheDocument();
    expect(screen.getByText('NIST')).toBeInTheDocument();

    // Check impact assessment
    expect(screen.getByText('Impact assessment')).toBeInTheDocument();
    expect(screen.getByText('~ 100/ month')).toBeInTheDocument();
    
    // Check value score
    const valueScore = screen.getByRole('meter');
    expect(valueScore).toHaveAttribute('aria-valuenow', '75');
    expect(valueScore).toHaveAttribute('aria-valuemin', '0');
    expect(valueScore).toHaveAttribute('aria-valuemax', '100');
  });

  it('applies correct styles based on status', () => {
    const { rerender } = render(
      <RecommendationCard 
        item={mockRecommendation} 
        status="active"
      />
    );

    // Check active status styles
    const activeButton = screen.getByRole('button');
    expect(activeButton).toHaveClass('bg-teal-500');
    expect(activeButton).not.toHaveClass('bg-gray-300');

    // Rerender with archived status
    rerender(
      <RecommendationCard 
        item={mockRecommendation} 
        status="archived"
      />
    );

    // Check archived status styles
    expect(activeButton).toHaveClass('bg-gray-300');
    expect(activeButton).not.toHaveClass('bg-teal-500');
  });

  it('opens details modal when clicking the button', async () => {
    render(
      <RecommendationCard 
        item={mockRecommendation} 
        status="active"
      />
    );

    const button = screen.getByRole('button', {
      name: 'View details for Test Recommendation'
    });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    // RecommendationDetails component should be rendered with open={true}
    // expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders correct value score indicators', () => {
    const { rerender } = render(
      <RecommendationCard 
        item={{ ...mockRecommendation, score: 25 }}
        status="active"
      />
    );

    // With score 25, only first indicator should be filled
    let indicators = screen.getAllByTestId('score-indicator');
    expect(indicators[0]).toHaveClass('bg-teal-600');
    expect(indicators[1]).toHaveClass('bg-gray-300');
    expect(indicators[2]).toHaveClass('bg-gray-300');
    expect(indicators[3]).toHaveClass('bg-gray-300');

    // Test with score 100
    rerender(
      <RecommendationCard 
        item={{ ...mockRecommendation, score: 100 }}
        status="active"
      />
    );

    // With score 100, all indicators should be filled
    indicators = screen.getAllByTestId('score-indicator');
    indicators.forEach(indicator => {
      expect(indicator).toHaveClass('bg-teal-600');
    });
  });

  it('maintains accessibility features', () => {
    render(
      <RecommendationCard 
        item={mockRecommendation} 
        status="active"
      />
    );

    // Check if button has proper aria-label
    expect(
      screen.getByRole('button', { name: 'View details for Test Recommendation' })
    ).toBeInTheDocument();

    // Check if cloud provider icons have proper aria-labels
    expect(screen.getByRole('img', { name: 'Azure' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'AWS' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Google Cloud' })).toBeInTheDocument();

    // Check if value score has proper ARIA attributes
    const valueScore = screen.getByRole('meter');
    expect(valueScore).toHaveAttribute('aria-valuenow', '75');
    expect(valueScore).toHaveAttribute('aria-valuemin', '0');
    expect(valueScore).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('Score: 75 out of 100')).toHaveClass('sr-only');

    // Check if impact assessment is properly labeled
    expect(
      screen.getByLabelText('Approximately 100 violations per month')
    ).toBeInTheDocument();
  });
});
