import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FleetManagement from './FleetManagement';

describe('FleetManagement', () => {
  const mockVehicles = [
    { id: '1', name: 'Truck 1', licensePlate: 'TRUCK-123' },
    { id: '2', name: 'Van 1', licensePlate: 'VAN-456' },
  ];
  const onAddVehicle = vi.fn();
  const onRemoveVehicle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial vehicles and the add vehicle form', () => {
    render(<FleetManagement vehicles={mockVehicles} onAddVehicle={onAddVehicle} onRemoveVehicle={onRemoveVehicle} apiError={null} />);
    expect(screen.getByText('Truck 1')).toBeInTheDocument();
    expect(screen.getByText('Van 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Vehicle Name')).toBeInTheDocument();
    expect(screen.getByLabelText('License Plate')).toBeInTheDocument();
  });

  it('adds a new vehicle to the list', async () => {
    onAddVehicle.mockResolvedValue(undefined);
    render(<FleetManagement vehicles={[]} onAddVehicle={onAddVehicle} onRemoveVehicle={onRemoveVehicle} apiError={null} />);
    fireEvent.change(screen.getByLabelText('Vehicle Name'), { target: { value: 'New Truck' } });
    fireEvent.change(screen.getByLabelText('License Plate'), { target: { value: 'NEW-456' } });
    fireEvent.click(screen.getByText('Add Vehicle'));

    await waitFor(() => {
      expect(onAddVehicle).toHaveBeenCalledWith({ name: 'New Truck', licensePlate: 'NEW-456' });
    });
  });

  it('removes a vehicle from the list', async () => {
    onRemoveVehicle.mockResolvedValue(undefined);
    render(<FleetManagement vehicles={mockVehicles} onAddVehicle={onAddVehicle} onRemoveVehicle={onRemoveVehicle} apiError={null} />);
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(onRemoveVehicle).toHaveBeenCalledWith('1');
    });
  });

  it('shows validation errors for the add vehicle form', async () => {
    render(<FleetManagement vehicles={[]} onAddVehicle={onAddVehicle} onRemoveVehicle={onRemoveVehicle} apiError={null} />);
    fireEvent.click(screen.getByText('Add Vehicle'));

    expect(await screen.findByText('Vehicle name is required')).toBeInTheDocument();
    expect(await screen.findByText('License plate is required')).toBeInTheDocument();
    expect(onAddVehicle).not.toHaveBeenCalled();
  });
});
