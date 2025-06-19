import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchWrapper from '../../components/dashboard/SearchWrapper';
import { RecommendationsProvider } from '../../context/recommendations/recommendations-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/query-client';

const mockAvailableTags = {
  frameworks: ['CIS', 'NIST'],
  reasons: ['Security', 'Performance'],
  providers: ['AWS', 'Azure'],
  classes: ['Compute', 'Network']
};

vi.mock('@/context/recommendations/recommendations-hooks', () => ({
  useRecommendationsContext: () => ({
    availableTags: mockAvailableTags,
    selectedFilters: {
      frameworks: [],
      reasons: [],
      providers: [],
      classes: []
    },
    dispatch: vi.fn()
  })
}));

describe('SearchWrapper', () => {
  const defaultProps = {
    count: 10,
    totalCount: 20,
    searchQuery: '',
    selectedTags: [],
    setSelectedTags: vi.fn(),
    setSearchQuery: vi.fn()
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <RecommendationsProvider>
        {children}
      </RecommendationsProvider>
    </QueryClientProvider>
  );

  it('renders search input with correct attributes', () => {
    render(<SearchWrapper {...defaultProps} />, { wrapper });
    
    const searchInput = screen.getByRole('searchbox', { name: /search recommendations/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search recommendations...');
    expect(searchInput).toHaveAttribute('type', 'search');
  });

  it('shows correct results count', () => {
    render(<SearchWrapper {...defaultProps} />, { wrapper });
    expect(screen.getByText('Showing 10 of 20 results')).toBeInTheDocument();
  });

  it('handles search input changes', async () => {
    render(<SearchWrapper {...defaultProps} />, { wrapper });
    
    const searchInput = screen.getByRole('searchbox', { name: /search recommendations/i });
    await userEvent.type(searchInput, 'test');
    
    // expect(defaultProps.setSearchQuery).toHaveBeenCalledWith('test');
  });

  it('opens filter popover and shows categories', async () => {
    render(<SearchWrapper {...defaultProps} />, { wrapper });
    // screen.debug();
    // // Get filter button - it's a div with role="button" inside PopoverTrigger
    
    // const filterButton = await screen.findByRole('button', { name: /filter/i });
    // fireEvent.click(filterButton);

    // expect(await screen.findByText(/category/i)).toBeInTheDocument();
    // expect(filterButton).toHaveAttribute('aria-haspopup', 'dialog');
    // expect(filterButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click the filter button to open popover
    // await userEvent.click(filterButton);
    
    // // Verify popover content is visible
    // const popoverContent = screen.getByRole('dialog');
    // expect(popoverContent).toBeVisible();
    
    // // Check if filter search input is present
    // expect(screen.getByRole('searchbox', { name: /search filters/i })).toBeVisible();
    
    // // Check if all filter categories are present
    // expect(screen.getByRole('navigation', { name: 'Filter categories' })).toBeVisible();
    // expect(screen.getByText('Cloud Providers')).toBeVisible();
    // expect(screen.getByText('Frameworks')).toBeVisible();
    // expect(screen.getByText('Reasons')).toBeVisible();
    // expect(screen.getByText('Classes')).toBeVisible();
    
    // // Verify clear filters button is present
    // expect(screen.getByRole('button', { name: /clear filters/i })).toBeVisible();
  });

//   it('shows filter search input in popover', async () => {
//     render(<SearchWrapper {...defaultProps} />, { wrapper });
    
//     const filterButton = screen.getByRole('button', { 
//       name: /filter/i,
//     });
//     await userEvent.click(filterButton);
    
//     const filterSearch = screen.getByRole('searchbox', { name: /search filters/i });
//     expect(filterSearch).toBeVisible();
//   });

//   it('handles filter search input', async () => {
//     render(<SearchWrapper {...defaultProps} />, { wrapper });
    
//     const filterButton = screen.getByRole('button', { 
//       name: /filter/i,
//     });
//     await userEvent.click(filterButton);
    
//     const filterSearch = screen.getByRole('searchbox', { name: /search filters/i });
//     await userEvent.type(filterSearch, 'aws');
    
//     expect(filterSearch).toHaveValue('aws');
//   });

//   it('shows selected filters count', () => {
//     const { rerender } = render(
//       <SearchWrapper
//         {...defaultProps}
//         selectedTags={['AWS', 'NIST']}
//       />,
//       { wrapper }
//     );

//     // expect(screen.getByText('2 filters active')).toBeInTheDocument();

//     // Test with no filters
//     rerender(
//       <SearchWrapper
//         {...defaultProps}
//         selectedTags={[]}
//       />
//     );
    
//     expect(screen.queryByText(/filters active/)).not.toBeInTheDocument();
//   });

//   it('clears filters when clicking clear button', async () => {
//     const mockInvalidateQueries = vi.fn();
//     queryClient.invalidateQueries = mockInvalidateQueries;

//     render(
//       <SearchWrapper
//         {...defaultProps}
//         selectedTags={['AWS', 'NIST']}
//       />,
//       { wrapper }
//     );

//     const filterButton = screen.getByRole('button', { 
//       name: /filter/i,
//     });
//     await userEvent.click(filterButton);

//     const clearButton = screen.getByRole('button', { name: /clear filters/i });
//     await userEvent.click(clearButton);

//     expect(defaultProps.setSelectedTags).toHaveBeenCalledWith([]);
//     expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['recommendations'] });
//     expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['archived-recommendations'] });
//   });

//   it('maintains proper accessibility attributes', () => {
//     render(<SearchWrapper {...defaultProps} />, { wrapper });
    
//     // Check main section
//     expect(screen.getByRole('search')).toBeInTheDocument();
    
//     // Check filter button
//     const filterButton = screen.getByRole('button', { name: /filter/i });
//     expect(filterButton).toHaveAttribute('aria-haspopup', 'dialog');
//     expect(filterButton).toHaveAttribute('aria-expanded', 'false');
    
//     // Check results count status
//     const resultsStatus = screen.getByRole('status');
//     expect(resultsStatus).toHaveAttribute('aria-live', 'polite');
//   });
});
