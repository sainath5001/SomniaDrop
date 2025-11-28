'use client';

import { useRouter } from 'next/navigation';

export default function HomeWeb2() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Plinkoo Game (Web2)
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Play Plinkoo with Somnia Data Streams - No Wallet Required!
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

          <div className="text-sm text-gray-500 text-center space-y-2">
            <p>✓ No wallet connection needed</p>
            <p>✓ Game data stored locally</p>
            <p>✓ Optional: Connect wallet to publish to Somnia Data Streams</p>
          </div>
        </div>
      </div>
    </div>
  );
}



