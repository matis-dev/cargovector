import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForgotPasswordPage from './page';
import { Auth } from 'firebase/auth';

// Mock Firebase auth
const sendPasswordResetEmail = vi.fn();
vi.mock('@/lib/firebase/client', () => ({
  auth: {},
}));
vi.mock('firebase/auth', () => ({
    sendPasswordResetEmail: (auth: Auth, email: string) => sendPasswordResetEmail(auth, email),
}));

describe('Forgot Password Page', () => {
  it('renders the form', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByRole('heading', { name: /forgot your password/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('shows an error for invalid email', async () => {
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'invalid-email' } });
    fireEvent.blur(screen.getByPlaceholderText(/email address/i));

    await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('calls sendPasswordResetEmail on valid submission', async () => {
    sendPasswordResetEmail.mockResolvedValue(undefined);
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, 'test@example.com');
      expect(screen.getByText(/password reset email sent/i)).toBeInTheDocument();
    });
  });

  it('shows an error if sendPasswordResetEmail fails', async () => {
    sendPasswordResetEmail.mockRejectedValue(new Error('Firebase error'));
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/firebase error/i)).toBeInTheDocument();
    });
  });
});
