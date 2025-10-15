import { auth } from '@/lib/firebase/client';

const getAuthHeader = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const getMe = async () => {
  const headers = await getAuthHeader();
  const response = await fetch('/api/users/me', { headers });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
};

export const updateMe = async (profileData: any) => {
    const headers = await getAuthHeader();
    const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers,
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        throw new Error('Failed to update user profile');
    }

    return response.json();
};

export const getFleet = async () => {
    const headers = await getAuthHeader();
    const response = await fetch('/api/fleet', { headers });

    if (!response.ok) {
        throw new Error('Failed to fetch fleet');
    }

    return response.json();
};

export const addVehicle = async (vehicleData: any) => {
    const headers = await getAuthHeader();
    const response = await fetch('/api/fleet', {
        method: 'POST',
        headers,
        body: JSON.stringify(vehicleData),
    });

    if (!response.ok) {
        throw new Error('Failed to add vehicle');
    }

    return response.json();
};

export const removeVehicle = async (vehicleId: string) => {
    const headers = await getAuthHeader();
    const response = await fetch(`/api/fleet/${vehicleId}`, {
        method: 'DELETE',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to remove vehicle');
    }

    return response.json();
};
