import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LogoutButton from './LogoutButton';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

vi.mock('firebase/auth', () => ({
  signOut: vi.fn(() => Promise.resolve()),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

describe('LogoutButton', () => {
  it('should render a logout button', () => {
    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('should call signOut and redirect on click', async () => {
    const push = vi.fn();
    (useRouter as vi.Mock).mockReturnValue({ push });

    render(<LogoutButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith('/');
    });
  });
});