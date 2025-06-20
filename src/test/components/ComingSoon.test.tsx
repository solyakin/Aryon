import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComingSoon from '../../components/dashboard/ComingSoon';
import { QueryClientProvider } from '@tanstack/react-query';
import { RecommendationsProvider } from '@/context/recommendations/recommendations-context';
import { queryClient } from '@/lib/query-client';

// Mock dependencies
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
  }
}));

describe('ComingSoon Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const TestComponent = () => {
    return (
        <QueryClientProvider client={queryClient}>
        <RecommendationsProvider>
          <ComingSoon />
        </RecommendationsProvider>
      </QueryClientProvider>
    );
  };

  it.only('renders the component properly', async () => {
    const { findByText, getByRole } = render(<TestComponent />);
    
    expect(await findByText('Coming Soon')).toBeInTheDocument();
    expect(await findByText(/we're working on an exciting new feature/i)).toBeInTheDocument();
    expect(getByRole('textbox', { name: /email for notification/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /notify me/i })).toBeInTheDocument();
  });


  it.only('uses theme-aware styles', () => {
    render(<TestComponent />);
    
    // Check the card has theme-aware styles
    const card = screen.getByText('Coming Soon').parentElement?.querySelector('.bg-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('text-card-foreground');
    
    // Check the heading has theme-aware text color
    const heading = screen.getByText('Coming Soon');
    expect(heading).toHaveClass('text-foreground');
    
    // Check the description has theme-aware muted text color
    const description = screen.getByText(/we're working on an exciting new feature/i);
    expect(description).toHaveClass('text-muted-foreground');
  });
});
