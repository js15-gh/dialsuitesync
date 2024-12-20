import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ApiStatus from '../ApiStatus';

describe('ApiStatus', () => {
  it('shows loading state when status is not provided', () => {
    render(<ApiStatus />);
    expect(screen.getByText('Loading API status...')).toBeInTheDocument();
  });

  it('displays both API statuses when provided', () => {
    const mockStatus = {
      dialpad: {
        id: 1,
        service: 'dialpad',
        status: 'healthy',
        lastCheck: new Date(),
        errorMessage: null
      },
      netsuite: {
        id: 2,
        service: 'netsuite',
        status: 'degraded',
        lastCheck: new Date(),
        errorMessage: 'API rate limit exceeded'
      }
    };

    render(<ApiStatus status={mockStatus} />);
    
    expect(screen.getByText('Dialpad API')).toBeInTheDocument();
    expect(screen.getByText('NetSuite API')).toBeInTheDocument();
    expect(screen.getByText('(healthy)')).toBeInTheDocument();
    expect(screen.getByText('(degraded)')).toBeInTheDocument();
  });

  it('shows down status when API service is unavailable', () => {
    const mockStatus = {
      dialpad: {
        id: 1,
        service: 'dialpad',
        status: 'down',
        lastCheck: new Date(),
        errorMessage: 'Service unavailable'
      },
      netsuite: {
        id: 2,
        service: 'netsuite',
        status: 'down',
        lastCheck: new Date(),
        errorMessage: 'Service unavailable'
      }
    };

    render(<ApiStatus status={mockStatus} />);
    
    const downStatuses = screen.getAllByText('(down)');
    expect(downStatuses).toHaveLength(2);
  });
});
