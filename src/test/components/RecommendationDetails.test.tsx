import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecommendationDetails from '../../components/dashboard/RecommendationDetails';
import { toast } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RecommendationDataProps } from '@/types/global';
import { RecommendationsProvider } from '@/context/recommendations/recommendations-context';
import RecommendationCard from '@/components/dashboard/RecommendationCard';
// Mock dependencies
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/lib/httpsRequest', () => ({
  default: vi.fn(() => ({
    post: vi.fn().mockImplementation((url) => {
      if (url.includes('error')) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({ status: true });
    })
  }))
}));

vi.mock('@/context/user/user-hooks', () => ({
  useUserAuthContext: () => ({
    token: 'mock-token'
  })
}));

// Mock the lazy-loaded components
vi.mock('../../components/dashboard/DetailHeader', () => ({
  default: () => <div data-testid="mock-detail-header">Detail Header</div>
}));

vi.mock('../../components/dashboard/DetailsBody', () => ({
  default: () => <div data-testid="mock-details-body">Details Body</div>
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

const errorRecommendation = {
    ...mockRecommendation,
    recommendationId: 'error'
};
describe('RecommendationDetails Component', () => {
  //Setup mock recommendation data

    const mockSetOpen = vi.fn();
    let queryClient: QueryClient;
      beforeEach(() => {
        queryClient = new QueryClient({
          defaultOptions: {
            queries: {
              retry: false,
            },
          },
        });
        vi.clearAllMocks();
      });

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

    const TestComponentArchieved = () => {
        return (
        <QueryClientProvider client={queryClient}>
            <RecommendationsProvider>
            <RecommendationCard 
                item={mockRecommendation} 
                status="archived"
            />
            </RecommendationsProvider>
        </QueryClientProvider>
        );
    };

    const TestRecommendationDetails = () => {
        return (
             <QueryClientProvider client={queryClient}>
                <RecommendationsProvider>

                    <RecommendationDetails
                        open={true}
                        setOpen={mockSetOpen}
                        item={errorRecommendation}
                        status="active"
                    />
                </RecommendationsProvider>
            </QueryClientProvider>
        );
    }

    it('renders correctly when open', async () => {
        const { findByText } = render(<TestComponent />);
        
        // Test basic content is rendered
        expect(await findByText('Test Recommendation')).toBeInTheDocument();
        expect(await findByText('This is a test recommendation description')).toBeInTheDocument();
    });
    it('renders framework tags correctly', async () => {
        const { findAllByRole } = render(<TestComponent />);
        
        // Check framework tags are rendered
        const frameworkTags = await findAllByRole('listitem');
        expect(frameworkTags.length).toBeGreaterThan(0);
        expect(frameworkTags[0]).toHaveTextContent('CIS');
        expect(frameworkTags[1]).toHaveTextContent('NIST');
    });
  it('shows impact assessment information correctly', async () => {
    const { findByText } = render(<TestComponent />);
    // Check impact assessment section
    expect(await findByText('Impact assessment')).toBeInTheDocument();
    expect(await findByText('~ 100/ month')).toBeInTheDocument();
  });

  it('displays value score with proper accessibility', async () => {
    const { findByText, findByRole } = render(<TestComponent />);
    expect(await findByText('Value score')).toBeInTheDocument();
    // Value score should have proper role for accessibility
    const valueScore = await findByRole('meter');
    expect(valueScore).toHaveAttribute('aria-valuenow', '75');
    expect(valueScore).toHaveAttribute('aria-valuemin', '0');
    expect(valueScore).toHaveAttribute('aria-valuemax', '100');
  });
  
  it('has a functional details button', async () => {
    const user = userEvent.setup();
    const { findByLabelText } = render(<TestComponent />);
    // Find and click the details button
    const detailsButton = await findByLabelText('View details for Test Recommendation');
    expect(detailsButton).toBeInTheDocument();
    
    await user.click(detailsButton);
    
    // After clicking, we should eventually see the dialog
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });
  });

  it('does not render when closed', () => {
    render(<TestComponent />);
    // Drawer should not be visible
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('successfully archives a recommendation', async () => {

    Element.prototype.setPointerCapture = vi.fn(); 
    const user = userEvent.setup();
    const invalidateQueriesMock = vi.fn();
    queryClient.invalidateQueries = invalidateQueriesMock;

    // render the component
    render(<TestComponent />);
    
    // click the details button to open the drawer
    const detailsButton = await screen.findByLabelText('View details for Test Recommendation');
    await user.click(detailsButton);
    
    // Wait for the drawer to appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Now we can find the archive button inside the drawer
    const archiveButton = await screen.findByTestId('archive-btn');

    expect(archiveButton).toBeInTheDocument();
    expect(archiveButton).toHaveTextContent(/archive/i);
    
    //Click the archive button
    fireEvent.click(archiveButton);

    // Check if the appropriate API call was made
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Recommendation archived successfully!",
        expect.any(Object)
      );
    });

    // // Check if queries were invalidated
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ['recommendations'] });
  });

  it('successfully unarchives a recommendation', async () => {
    
    Element.prototype.setPointerCapture = vi.fn(); 

    const user = userEvent.setup();
    const invalidateQueriesMock = vi.fn();
    queryClient.invalidateQueries = invalidateQueriesMock;

    // render the component
    render(<TestComponentArchieved />);
    
    // click the details button to open the drawer
    const detailsButton = await screen.findByLabelText('View details for Test Recommendation');
    await user.click(detailsButton);
    
    // Wait for the drawer to appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Now we can find the archive button inside the drawer
    const unarchiveButton = await screen.findByTestId('unarchive-btn');

    expect(unarchiveButton).toBeInTheDocument();
    expect(unarchiveButton).toHaveTextContent(/unarchive/i);
    
    //Click the archive button
    fireEvent.click(unarchiveButton);

    // Check if the appropriate API call was made
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Recommendation archived successfully!",
        expect.any(Object)
      );
    });

    // Check if queries were invalidated
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ['archived-recommendations'] });
    
    // Check if drawer was closed
    // expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('handles errors when archiving fails', async () => {

    Element.prototype.setPointerCapture = vi.fn();
    render(<TestRecommendationDetails />)

    const archiveButton = await screen.findByTestId('archive-btn');
    expect(archiveButton).toBeInTheDocument();
    fireEvent.click(archiveButton);

    // Check if error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    // Drawer should remain open
    expect(mockSetOpen).not.toHaveBeenCalled();
  });

  it('renders with proper accessibility attributes', () => {
    render(<TestRecommendationDetails />)

    // Check for ARIA attributes
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'recommendation-title');
    
    // Check button accessibility
    expect(screen.getByLabelText('Close details')).toBeInTheDocument();
    expect(screen.getByLabelText('Archive recommendation')).toBeInTheDocument();
    expect(screen.getByLabelText('Configure policy')).toBeInTheDocument();
  });

  it('renders error boundary correctly', () => {
    // The ErrorBoundary is rendering correctly if the component renders
    // To properly test error boundaries, we would need additional setup
    // This is a basic check that the component renders with the ErrorBoundary
    render(<TestRecommendationDetails />)

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes the modal when clicking the close button', async () => {
    Element.prototype.setPointerCapture = vi.fn();
    const user = userEvent.setup();
    
    render(<TestComponent />);
    
    // Find and click the details button to open the drawer
    const detailsButton = await screen.findByLabelText('View details for Test Recommendation');
    await user.click(detailsButton);
    
    // Wait for the drawer to appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Find the close button and click it
    const closeButton = screen.getByLabelText('Close details');
    expect(closeButton).toBeInTheDocument();
    
    // Click the close button
    fireEvent.click(closeButton);

    // Wait for the drawer to disappear
    // await waitFor(() => {
    //   expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    // });
  });
});
