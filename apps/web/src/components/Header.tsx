'use client';

import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-xl font-semibold text-gray-700">
            CargoVector
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
            Dashboard
          </Link>
          <Link href="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
            Profile
          </Link>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}
