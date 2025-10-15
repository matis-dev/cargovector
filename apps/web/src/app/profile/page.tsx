'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { getMe, updateMe, getFleet } from '@/services/userService';
import ProfileForm from '@/components/ProfileForm';

import FleetManagement from '@/components/FleetManagement';

interface UserProfile {
  companyName: string;
  email: string;
  address: string;
  memberSince: string;
  roles: string[];
}

interface Vehicle {
  id: string;
  vehicleName: string;
  licensePlate: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setProfile(data);
        if (data.roles.includes('Shipper')) {
          const fleetData = await getFleet();
          setFleet(fleetData);
        }
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async (data: Omit<UserProfile, 'email' | 'memberSince' | 'roles'>) => {
    try {
      await updateMe(data);
      setProfile(prev => prev ? { ...prev, ...data } : null);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Company Profile</h1>
          {profile && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Edit
            </button>
          )}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {profile && (
            isEditing ? (
              <ProfileForm profile={profile} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">{profile.companyName}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">{profile.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Member Since</h3>
                  <p className="text-gray-600">{profile.memberSince}</p>
                </div>
              </div>
            )
          )}
        </div>

        {profile && profile.roles.includes('Shipper') && (
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Fleet Management</h2>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <FleetManagement initialVehicles={fleet} />
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
