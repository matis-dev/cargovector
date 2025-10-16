import Header from '@/components/Header';

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-extrabold text-gray-900">Welcome to your Dashboard!</h2>
            <p className="mt-2 text-sm text-gray-600">
              This is a placeholder for your personalized content.
            </p>
        </div>
      </main>
    </div>
  );
}
