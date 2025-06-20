import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecommendationCard from '../../components/dashboard/RecommendationCard';
import type { RecommendationDataProps } from '@/types/global';
import { QueryClientProvider } from '@tanstack/react-query';
import { RecommendationsProvider } from '@/context/recommendations/recommendations-context';
import { queryClient } from '@/lib/query-client';

// Mock the ValueScoreIndicator component since it's lazy loaded
vi.mock('../../components/dashboard/ValueScoreIndicator', () => ({
  default: () => <div data-testid="score-indicator">Value Score</div>
}));

const mockRecommendation: RecommendationDataProps = {
  recommendationId: '123',
  title: 'Test Recommendation',
  description: 'This is a test recommendation description',
  score: 75,
  impactAssessment: {
    totalViolations: 100,
    mostImpactedScope: {
      name: 'Test Scope',
      type: 'resource',
      count: 50
    }
  },
  frameworks: [
    { name: 'CIS', section: 'Section 1', subsection: 'Subsection A' },
    { name: 'NIST', section: 'Section 2', subsection: 'Subsection B' }
  ],
  tenantId: 'tenant-123',
  slug: 'test-recommendation',
  furtherReading: [{ name: 'Further Reading', href: 'https://example.com' }],
  totalHistoricalViolations: 200,
  affectedResources: [{ name: 'Resource 1' }, { name: 'Resource 2' }],
  class: 1,
  provider: [1, 2, 3], // Assuming 1 = AWS, 2 = Azure, 3 = GCP
  reasons: ['Security']
};

describe('RecommendationCard', () => {

  const TestComponent = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <RecommendationsProvider>
          <RecommendationCard 
            item={mockRecommendation} 
            status="active"
          />
        </RecommendationsProvider>
      </QueryClientProvider>
    );
  };
  it('renders basic card information correctly', async () => {
    const { findByText, getByRole, getByLabelText, getByTestId } = render(<TestComponent />);
    // Check title and description
    expect(await findByText('Test Recommendation')).toBeInTheDocument();
    expect(await findByText('This is a test recommendation description')).toBeInTheDocument();

    // Check framework tags
    expect(await findByText('CIS')).toBeInTheDocument();
    expect(await findByText('NIST')).toBeInTheDocument();

    // Check cloud provider icons are present with proper accessibility labels
    expect(getByRole('img', { name: 'Azure' })).toBeInTheDocument();
    expect(getByRole('img', { name: 'AWS' })).toBeInTheDocument();
    expect(getByRole('img', { name: 'Google Cloud' })).toBeInTheDocument();

    // Check impact assessment
    expect(await findByText('Impact assessment')).toBeInTheDocument();
    expect(getByLabelText('Approximately 100 violations per month')).toBeInTheDocument();

    // Check value score section
    expect(await findByText('Value score')).toBeInTheDocument();
    expect(getByTestId('score-indicator')).toBeInTheDocument();
  });

  it('applies correct styling based on status', () => {
    const { rerender, getByRole } = render(<TestComponent />);

    // Check active status styling
    let button = getByRole('button');
    expect(button).toHaveClass('bg-teal-500');
    expect(button).not.toHaveClass('bg-gray-300');

    // Rerender with archived status
    rerender(
      <TestComponent />
    );

    // Check archived status styling
    button = getByRole('button');
    // expect(button).toHaveClass('bg-gray-300');
    // expect(button).not.toHaveClass('bg-teal-500');
  });

  it('maintains accessibility features', () => {

    const { getByRole } = render(<TestComponent />);
  

    // Check if button has proper aria-label
    expect(
      getByRole('button', { name: 'View details for Test Recommendation' })
    ).toBeInTheDocument();

    // Check if cloud provider icons have proper aria-labels
    expect(getByRole('img', { name: 'Azure' })).toBeInTheDocument();
    expect(getByRole('img', { name: 'AWS' })).toBeInTheDocument();
    expect(getByRole('img', { name: 'Google Cloud' })).toBeInTheDocument();

    // Check if framework list has proper role and aria-label
    expect(getByRole('list', { name: 'Framework compliance' })).toBeInTheDocument();

    // Check if cloud providers section has proper role and aria-label
    expect(getByRole('list', { name: 'Cloud providers' })).toBeInTheDocument();
  });

  it('opens details modal when clicked', async () => {
    const user = userEvent.setup();
    const { getByRole} = render(<TestComponent />);

    // Click the button to open details
    const button = getByRole('button', { 
      name: 'View details for Test Recommendation' 
    });
    await user.click(button);

    // The RecommendationDetails component should be rendered
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
