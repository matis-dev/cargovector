import Link from 'next/link';

export default function VerificationSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Email Verified!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your email address has been successfully verified. You can now log in to your account.
          </p>
        </div>
        <div className="mt-5">
            <Link href="/login" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Go to Login
            </Link>
        </div>
      </div>
    </div>
  );
}
