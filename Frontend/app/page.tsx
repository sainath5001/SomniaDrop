'use client';

import { useRouter } from 'next/navigation';

export default function HomeWeb2() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          SomniaDrop Game
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Welcome to Somnia World
        </p>

        <div className="space-y-4">
          <div className="text-center">
            <button
              onClick={() => router.push('/game')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg w-full"
            >
              Start Playing →
            </button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 text-center space-y-2">
            <p>Jump in and play — no crypto setup needed</p>
            <p>Your data, your device, your control</p>
            <p>Connect a wallet only if you want to publish to Somnia Data Streams</p>
          </div>
        </div>
      </div>
    </div>
  );
}

