import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a verification link to your email address. Please click the link to complete your registration.
          </p>
        </div>
        <div className="mt-5">
            <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Go back to homepage
            </Link>
        </div>
      </div>
    </div>
  );
}
