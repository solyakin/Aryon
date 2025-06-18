import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchWrapper from '../../components/dashboard/SearchWrapper';

describe('SearchWrapper', () => {
  const defaultProps = {
    searchQuery: '',
    setSearchQuery: vi.fn(),
    count: 10,
    totalCount: 20,
    selectedTags: [],
    setSelectedTags: vi.fn()
  };

  it('renders search input correctly', () => {
    render(<SearchWrapper {...defaultProps} />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('shows correct count information', () => {
    render(<SearchWrapper {...defaultProps} />);
    expect(screen.getByText('Showing 1-10 of 20 results')).toBeInTheDocument();
  });

  it('calls setSearchQuery when input value changes', async () => {
    const user = userEvent.setup();
    render(<SearchWrapper {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'test');
    
    expect(defaultProps.setSearchQuery).toHaveBeenCalledTimes(4); // Once for each character
  });

  it('renders filter button', () => {
    render(<SearchWrapper {...defaultProps} />);
    expect(screen.getByText(/filter/i)).toBeInTheDocument();
  });
});
