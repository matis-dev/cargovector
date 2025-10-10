import Link from 'next/link';

export default function VerificationFailurePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-red-600">Verification Failed</h2>
          <p className="mt-2 text-sm text-gray-600">
            The email verification link is invalid or has expired. Please try registering again or contact support.
          </p>
        </div>
        <div className="mt-5">
            <Link href="/register" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Go back to registration
            </Link>
        </div>
      </div>
    </div>
  );
}
