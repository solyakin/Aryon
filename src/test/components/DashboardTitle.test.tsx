import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardTitle from '../../components/dashboard/DashboardTitle';

describe('DashboardTitle', () => {
  it('renders the title correctly', () => {
    render(
      <DashboardTitle
        title="Security Recommendations"
        subtitle="Test Subtitle"
        link="#"
        actionLabel="Test Action"
      />
    );
    expect(screen.getByText('Security Recommendations')).toBeInTheDocument();
  });

  it('renders the subtitle correctly', () => {
    render(<DashboardTitle 
        title='Security Recommendations' 
        subtitle='Enhance your security posture'
        link='#'
        actionLabel='Learn More'
      />);
    expect(screen.getByText(/Enhance your security posture/i)).toBeInTheDocument();
  });
});
