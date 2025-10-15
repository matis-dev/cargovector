import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProfileForm from './ProfileForm';

describe('ProfileForm', () => {
  const mockProfile = {
    companyName: 'Test Co',
    address: '123 Test St',
  };
  const onSave = vi.fn();
  const onCancel = vi.fn();

  it('renders with initial values', () => {
    render(<ProfileForm profile={mockProfile} onSave={onSave} onCancel={onCancel} />);
    expect(screen.getByLabelText('Company Name')).toHaveValue('Test Co');
    expect(screen.getByLabelText('Address')).toHaveValue('123 Test St');
  });

  it('calls onSave with form data on valid submission', async () => {
    render(<ProfileForm profile={mockProfile} onSave={onSave} onCancel={onCancel} />);
    fireEvent.change(screen.getByLabelText('Company Name'), { target: { value: 'New Name' } });
    fireEvent.click(screen.getByText('Save'));

    await screen.findByText('Save'); // wait for submission

    expect(onSave).toHaveBeenCalledWith({ companyName: 'New Name', address: '123 Test St' });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ProfileForm profile={mockProfile} onSave={onSave} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows validation errors for empty fields', async () => {
    render(<ProfileForm profile={{ companyName: '', address: '' }} onSave={onSave} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Company name is required')).toBeInTheDocument();
    expect(await screen.findByText('Address is required')).toBeInTheDocument();
  });
});
