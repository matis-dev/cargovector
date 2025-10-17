import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  const onLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render email and password fields', () => {
    render(<LoginForm onLogin={onLogin} error={null} />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should display an error message for invalid email', async () => {
    const { container } = render(<LoginForm onLogin={onLogin} error={null} />);
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.submit(container.querySelector('form')!)

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('should display an error message for short password', async () => {
    render(<LoginForm onLogin={onLogin} error={null} />);
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } });
    fireEvent.click(screen.getByText('Sign in'));

    expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('should call onLogin with form data on valid submission', async () => {
    render(<LoginForm onLogin={onLogin} error={null} />);
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' }, expect.anything());
    });
  });

  it('should display an error message from props', () => {
    render(<LoginForm onLogin={onLogin} error="Invalid credentials" />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});