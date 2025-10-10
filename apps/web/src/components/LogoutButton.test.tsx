import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LogoutButton from '@/components/LogoutButton';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/client'; // Import auth from client
import { signOut } from 'firebase/auth'; // Import from firebase/auth

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render a logout button', () => {
    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should call signOut and redirect to homepage on click', async () => {
    (signOut as vi.Mock).mockResolvedValueOnce(undefined);

    render(<LogoutButton />);
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth);
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should log error if signOut fails', async () => {
    const errorMessage = 'Logout failed';
    (signOut as vi.Mock).mockRejectedValueOnce(new Error(errorMessage));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<LogoutButton />);
    const logoutButton = screen.getByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith(auth);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging out:', expect.any(Error));
      expect(mockPush).not.toHaveBeenCalled(); // Should not redirect on error
    });

    consoleErrorSpy.mockRestore();
  });
});
