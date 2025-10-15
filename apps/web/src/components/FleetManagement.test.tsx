import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FleetManagement from './FleetManagement';

vi.mock('@/services/userService', () => ({
  addVehicle: vi.fn(data => Promise.resolve({ ...data, id: 'new-id' })),
  removeVehicle: vi.fn(() => Promise.resolve()),
  getFleet: vi.fn(() => Promise.resolve([])),
}));

describe('FleetManagement', () => {
  const mockVehicles = [
    { id: '1', name: 'Truck 1', licensePlate: 'TRUCK-123' },
    { id: '2', name: 'Van 1', licensePlate: 'VAN-456' },
  ];

  it('renders initial vehicles and the add vehicle form', () => {
    render(<FleetManagement initialVehicles={mockVehicles} />);
    expect(screen.getByText('Truck 1')).toBeInTheDocument();
    expect(screen.getByText('Van 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Vehicle Name')).toBeInTheDocument();
    expect(screen.getByLabelText('License Plate')).toBeInTheDocument();
  });

  it('adds a new vehicle to the list', async () => {
    render(<FleetManagement initialVehicles={[]} />);
    fireEvent.change(screen.getByLabelText('Vehicle Name'), { target: { value: 'New Truck' } });
    fireEvent.change(screen.getByLabelText('License Plate'), { target: { value: 'NEW-456' } });
    fireEvent.click(screen.getByText('Add Vehicle'));

    await waitFor(() => {
      expect(screen.getByText('New Truck')).toBeInTheDocument();
      expect(screen.getByText('NEW-456')).toBeInTheDocument();
    });
  });

  it('removes a vehicle from the list', async () => {
    render(<FleetManagement initialVehicles={mockVehicles} />);
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Truck 1')).not.toBeInTheDocument();
    });
  });

  it('shows validation errors for the add vehicle form', async () => {
    render(<FleetManagement initialVehicles={[]} />);
    fireEvent.click(screen.getByText('Add Vehicle'));

    expect(await screen.findByText('Vehicle name is required')).toBeInTheDocument();
    expect(await screen.findByText('License plate is required')).toBeInTheDocument();
  });
});
