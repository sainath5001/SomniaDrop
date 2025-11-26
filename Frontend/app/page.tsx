'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WalletButton } from '@/components/WalletButton';

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/game');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Plinkoo Game
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Play on Somnia Network with real-time data streaming
        </p>

        <div className="space-y-4">
          <div className="text-center">
            <WalletButton />
          </div>

          <div className="text-sm text-gray-500 text-center space-y-2">
            <p>• Connect your wallet to start playing</p>
            <p>• Make sure you're on Somnia Testnet</p>
            <p>• Get testnet tokens from the faucet</p>
          </div>
        </div>

        {isConnected && (
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/game')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Go to Game →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


