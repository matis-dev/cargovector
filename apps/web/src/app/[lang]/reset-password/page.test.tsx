import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ResetPasswordPage from './page';
import { Auth } from 'firebase/auth';

// Mock Firebase auth and Next.js router
const confirmPasswordReset = vi.fn();
const push = vi.fn();

vi.mock('@/lib/firebase/client', () => ({
  auth: {},
}));
vi.mock('firebase/auth', () => ({
    confirmPasswordReset: (auth: Auth, code: string, pass: string) => confirmPasswordReset(auth, code, pass),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams('oobCode=test-code'),
  useParams: () => ({ lang: 'en' }),
}));

describe('Reset Password Page', () => {
  it('renders the form', () => {
    render(<ResetPasswordPage />);
    expect(screen.getByRole('heading', { name: /reset your password/i })).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('shows an error for short passwords', async () => {
    render(<ResetPasswordPage />);
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('shows an error for non-matching passwords', async () => {
    render(<ResetPasswordPage />);
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });

  it('calls confirmPasswordReset on valid submission', async () => {
    confirmPasswordReset.mockResolvedValue(undefined);
    render(<ResetPasswordPage />);
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'new-password' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'new-password' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(confirmPasswordReset).toHaveBeenCalledWith({}, 'test-code', 'new-password');
      expect(screen.getByText(/password has been reset successfully/i)).toBeInTheDocument();
    });
  });
});
