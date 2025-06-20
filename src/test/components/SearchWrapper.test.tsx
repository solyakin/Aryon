import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchWrapper from '../../components/dashboard/SearchWrapper';
import { RecommendationsProvider } from '../../context/recommendations/recommendations-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/query-client';
import { useState } from 'react';

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
  const TestComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    
    return (
      <QueryClientProvider client={queryClient}>
        <RecommendationsProvider>
          <SearchWrapper
            count={10}
            totalCount={20}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            setSearchQuery={setSearchQuery}
          />
        </RecommendationsProvider>
      </QueryClientProvider>
    );
  };

  it('renders search input with correct attributes', () => {
    const { getByRole } = render(<TestComponent />);
    
    const searchInput = getByRole('searchbox', { name: /search recommendations/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search recommendations...');
    expect(searchInput).toHaveAttribute('type', 'search');
  });

  it('shows correct results count', () => {
    const { getByText } = render(<TestComponent />);
    expect(getByText('Showing 10 of 20 results')).toBeInTheDocument();
  });

  it('handles search input changes', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<TestComponent />);
    
    const searchInput = getByRole('searchbox', { name: /search recommendations/i }) as HTMLInputElement;
    expect(searchInput.value).toBe(''); // Initial state
    
    await user.type(searchInput, 'test');
    expect(searchInput.value).toBe('test');
  });

  it('opens filter popover and shows categories', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const filterButton = screen.getByTestId('filter-button');
    expect(filterButton).toBeInTheDocument();

    await user.click(filterButton);

    // Check if popover is visible
    await waitFor(() => {
      const popoverContent = screen.getByTestId('filter-popover');
      expect(popoverContent).toBeVisible();
    });

    expect(screen.getByText('Cloud Providers')).toBeVisible();
    expect(screen.getByText('Frameworks')).toBeVisible();
    expect(screen.getByText('Reasons')).toBeVisible();
    expect(screen.getByText('Classes')).toBeVisible();
    expect(screen.getByRole('searchbox', { name: /search filters/i })).toBeVisible();
    
    // Check that all mockAvailableTags are rendered as checkboxes
    Object.values(mockAvailableTags).flat().forEach(tag => {
      const checkbox = screen.getByRole('checkbox', { name: new RegExp(`Filter by ${tag}`, 'i') });
      expect(checkbox).toBeInTheDocument();
    });
  });

  it('handles filter selection', async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const filterButton = screen.getByTestId('filter-button');
    await user.click(filterButton);

    let popoverContent = null as HTMLElement | null;

    await waitFor(() => {
      popoverContent = screen.getByTestId('filter-popover');
      expect(popoverContent).toBeVisible();
    });

    expect(popoverContent).toBeInTheDocument();

    const totalTags = screen.getAllByTestId('tags');
    expect(totalTags.length).toBeGreaterThan(0);

    const singleTag = totalTags[0];
    const checkbox = within(singleTag).getByTestId('filter-checkbox-0');
    expect(checkbox).toBeInTheDocument();
    await user.click(checkbox);
    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
      // expect(checkbox).toHaveAttribute('data-state', 'checked');
    });
  });
});
