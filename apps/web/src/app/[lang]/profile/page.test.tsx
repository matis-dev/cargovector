import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProfilePage from './page';
import * as userService from '@/services/userService';

vi.mock('@/services/userService', () => ({
  getMe: vi.fn(),
  getFleet: vi.fn(() => Promise.resolve([])),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ lang: 'en' }),
}));

describe('Profile Page', () => {
  it('renders loading state and then displays profile information', async () => {
    const mockProfile = {
      companyName: 'Test Co',
      email: 'test@test.com',
      address: '123 Test St',
      memberSince: '2024-01-01',
      roles: [],
    };
    vi.mocked(userService.getMe).mockResolvedValue(mockProfile);

    render(<ProfilePage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Co')).toBeInTheDocument();
      expect(screen.getByText('test@test.com')).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
    });
  });

  it('renders an error message if fetching fails', async () => {
    vi.mocked(userService.getMe).mockRejectedValue(new Error('Failed to fetch'));

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load profile. Please try again later.')).toBeInTheDocument();
    });
  });

  it('shows fleet management for shippers', async () => {
    const mockProfile = {
      companyName: 'Test Co',
      email: 'test@test.com',
      address: '123 Test St',
      memberSince: '2024-01-01',
      roles: ['Shipper'],
    };
    vi.mocked(userService.getMe).mockResolvedValue(mockProfile);

    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText('Fleet Management')).toBeInTheDocument();
    });
  });
});
