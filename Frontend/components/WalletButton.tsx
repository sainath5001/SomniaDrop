'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
      >
        Connect Wallet
      </button>

      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 pointer-events-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Connect Wallet</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {connectors.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No wallets available</p>
                ) : (
                  connectors.map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => {
                        connect({ connector });
                        setShowModal(false);
                      }}
                      disabled={isPending}
                      className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{connector.name}</span>
                      {isPending && <span className="text-sm text-gray-500">Connecting...</span>}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
