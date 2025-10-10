import LogoutButton from '@/components/LogoutButton';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome to your Dashboard!</h2>
        <p className="mt-2 text-sm text-gray-600">
          This is a placeholder for your personalized content.
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}
