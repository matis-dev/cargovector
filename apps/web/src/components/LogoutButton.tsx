'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
    >
      Logout
    </button>
  );
}