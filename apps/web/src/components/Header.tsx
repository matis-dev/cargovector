'use client';

import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/client';
import LogoutButton from './LogoutButton';
import { useParams } from 'next/navigation';

export default function Header() {
  const [user] = useAuthState(auth);
  const params = useParams();
  const lang = params.lang;

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href={`/${lang}/dashboard`} className="text-xl font-semibold text-gray-700">
            CargoVector
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href={`/${lang}/dashboard`} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
            Dashboard
          </Link>
          <Link href={`/${lang}/profile`} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
            Profile
          </Link>
          {user && <LogoutButton />}
        </div>
      </nav>
    </header>
  );
}
