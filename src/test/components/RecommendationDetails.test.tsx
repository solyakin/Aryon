import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RecommendationDataProps } from '@/types/global';
import RecommendationDetails from '@/components/dashboard/RecommendationDetails';

// Mock dependencies
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn()
  })
}));

vi.mock('@/context/user/user-hooks', () => ({
  useUserAuthContext: () => ({
    token: 'mock-token'
  })
}));

vi.mock('@/lib/httpsRequest', () => ({
  default: vi.fn(() => ({
    post: vi.fn()
  }))
}));

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

describe('RecommendationDetails', () => {
  const defaultProps = {
    open: true,
    setOpen: vi.fn(),
    item: mockRecommendation,
    status: 'active'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders drawer with recommendation details when open', () => {
    render(<RecommendationDetails {...defaultProps} />);

    // Check header content
    expect(screen.getByText('Test Recommendation')).toBeInTheDocument();
    expect(screen.getByText('Value score')).toBeInTheDocument();
    expect(screen.getByText('(75 / 100)')).toBeInTheDocument();

    // Check description
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    const providers = screen.getByRole('list', { name: /cloud providers/i });
    expect(providers).toBeInTheDocument();

    // Check compliance frameworks
     const frameworks = screen.getByRole('list', { name: /framework compliance/i });
    expect(frameworks).toBeInTheDocument();
    expect(screen.getByText('CIS')).toBeInTheDocument();
    expect(screen.getByText('NIST')).toBeInTheDocument();

    // Check affected resources
    const resourcesList = screen.getByRole('list', { name: /affected resources/i });
    expect(resourcesList).toBeInTheDocument();
    expect(screen.getByText('Resource 1')).toBeInTheDocument();
    expect(screen.getByText('Resource 2')).toBeInTheDocument();

    // Check impact assessment
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Compute')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();

    // Check further reading links
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://docs1.com');
    expect(links[1]).toHaveAttribute('href', 'https://docs2.com');
  });

//   it('handles archiving recommendation successfully', async () => {
//     const mockPost = vi.fn().mockResolvedValue({ status: true });
//     (httpRequest as jest.Mock).mockImplementation(() => ({
//       post: mockPost
//     }));

//     render(<RecommendationDetails {...defaultProps} />);

//     const archiveButton = screen.getByRole('button', { name: /archive recommendation/i });
//     await userEvent.click(archiveButton);

//     expect(mockPost).toHaveBeenCalledWith('/recommendations/123/archive');
//     expect(toast.success).toHaveBeenCalledWith('Recommendation archived successfully!', expect.any(Object));
//     expect(defaultProps.setOpen).toHaveBeenCalledWith(false);
//   });

//   it('handles unarchiving recommendation successfully', async () => {
//     const mockPost = vi.fn().mockResolvedValue({ status: true });
//     (httpRequest as jest.Mock).mockImplementation(() => ({
//       post: mockPost
//     }));

//     render(<RecommendationDetails {...defaultProps} status="archived" />);

//     const unarchiveButton = screen.getByRole('button', { name: /unarchive recommendation/i });
//     await userEvent.click(unarchiveButton);

//     expect(mockPost).toHaveBeenCalledWith('/recommendations/123/unarchive');
//     expect(toast.success).toHaveBeenCalledWith('Recommendation archived successfully!', expect.any(Object));
//     expect(defaultProps.setOpen).toHaveBeenCalledWith(false);
//   });

//   it('handles archive/unarchive error states', async () => {
//     const mockError = new Error('API Error');
//     const mockPost = vi.fn().mockRejectedValue(mockError);
//     (httpRequest as jest.Mock).mockImplementation(() => ({
//       post: mockPost
//     }));

//     render(<RecommendationDetails {...defaultProps} />);

//     const archiveButton = screen.getByRole('button', { name: /archive recommendation/i });
//     await userEvent.click(archiveButton);

//     expect(toast.error).toHaveBeenCalled();
//     expect(defaultProps.setOpen).not.toHaveBeenCalled();
//   });

//   it('closes drawer when clicking close button', async () => {
//     render(<RecommendationDetails {...defaultProps} />);

//     const closeButton = screen.getByRole('button', { name: /close details/i });
//     await userEvent.click(closeButton);

//     expect(defaultProps.setOpen).toHaveBeenCalledWith(false);
//   });

//   it('maintains proper accessibility attributes', () => {
//     render(<RecommendationDetails {...defaultProps} />);

//     // Check dialog role and aria-labelledby
//     const dialog = screen.getByRole('dialog');
//     expect(dialog).toHaveAttribute('aria-modal', 'true');
//     expect(dialog).toHaveAttribute('aria-labelledby', 'recommendation-title');

//     // Check value score meter
//     const valueScore = screen.getByRole('meter', { name: /value score/i });
//     expect(valueScore).toHaveAttribute('aria-valuenow', '75');
//     expect(valueScore).toHaveAttribute('aria-valuemin', '0');
//     expect(valueScore).toHaveAttribute('aria-valuemax', '100');

//     // Check lists
//     expect(screen.getByRole('list', { name: /affected resources/i })).toBeInTheDocument();
//     expect(screen.getByRole('list', { name: /compliance frameworks/i })).toBeInTheDocument();

//     // Check external links
//     const links = screen.getAllByRole('link');
//     links.forEach(link => {
//       expect(link).toHaveAttribute('rel', 'noopener noreferrer');
//       expect(link).toHaveAttribute('target', '_blank');
//     });
//   });

//   it('renders correct status based on title', () => {
//     const { rerender } = render(<RecommendationDetails {...defaultProps} />);
    
//     // AWS environment
//     expect(screen.getByText('AWS Environment')).toBeInTheDocument();

//     // Test Azure environment
//     rerender(
//       <RecommendationDetails 
//         {...defaultProps} 
//         item={{ ...mockRecommendation, title: 'Test Azure Recommendation' }}
//       />
//     );
//     expect(screen.getByText('Azure Environment')).toBeInTheDocument();

//     // Test without specific environment
//     rerender(
//       <RecommendationDetails 
//         {...defaultProps} 
//         item={{ ...mockRecommendation, title: 'Generic Recommendation' }}
//       />
//     );
//     expect(screen.queryByText(/Environment/)).not.toBeInTheDocument();
//   });
});
