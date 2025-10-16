'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addVehicle, removeVehicle } from '@/services/userService';

const vehicleSchema = z.object({
  name: z.string().min(1, 'Vehicle name is required'),
  licensePlate: z.string().min(1, 'License plate is required'),
});

type VehicleFormInputs = z.infer<typeof vehicleSchema>;

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
}

interface FleetManagementProps {
  initialVehicles: Vehicle[];
}

export default function FleetManagement({ initialVehicles = [] }: FleetManagementProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VehicleFormInputs>({
    resolver: zodResolver(vehicleSchema),
  });

  const handleAddVehicle = async (data: VehicleFormInputs) => {
    setApiError(null);
    const newVehicle = { ...data, id: `temp-${Date.now()}` }; // Create a temporary ID
    setVehicles(prev => [...prev, newVehicle]);
    reset();

    try {
      const addedVehicle = await addVehicle(data);
      setVehicles(prev => prev.map(v => v.id === newVehicle.id ? addedVehicle : v)); // Replace temp vehicle with real one
    } catch {
      setApiError('Failed to add vehicle. Please try again.');
      setVehicles(prev => prev.filter(v => v.id !== newVehicle.id)); // Rollback on error
    }
  };

  const handleRemoveVehicle = async (id: string) => {
    setApiError(null);
    try {
      await removeVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch {
      setApiError('Failed to remove vehicle. Please try again.');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Your Fleet</h3>
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
      <div className="space-y-4">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">{vehicle.name}</p>
              <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>
            </div>
            <button onClick={() => handleRemoveVehicle(vehicle.id)} className="text-red-500 hover:text-red-700">
              Remove
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(handleAddVehicle)} className="mt-6 space-y-4">
        <h4 className="font-semibold">Add New Vehicle</h4>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Vehicle Name</label>
          <input id="name" {...register('name')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">License Plate</label>
          <input id="licensePlate" {...register('licensePlate')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          {errors.licensePlate && <p className="mt-1 text-sm text-red-500">{errors.licensePlate.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          {isSubmitting ? 'Adding...' : 'Add Vehicle'}
        </button>
      </form>
    </div>
  );
}
