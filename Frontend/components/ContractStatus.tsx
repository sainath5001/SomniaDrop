'use client';

import { useReadContract } from 'wagmi';
import { config } from '@/lib/config';
import { erc20ABI, plinkooGameABI } from '@/lib/contracts/plinkooGame';

export function ContractStatus() {
  // Check if token contract exists
  const { data: tokenCode } = useReadContract({
    address: config.tokenAddress,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: ['0x0000000000000000000000000000000000000000'],
    query: {
      retry: false,
    },
  });

  // Check if game contract exists
  const { data: gameCounter } = useReadContract({
    address: config.plinkooGameAddress,
    abi: plinkooGameABI,
    functionName: 'gameCounter',
    query: {
      retry: false,
    },
  });

  const tokenExists = tokenCode !== undefined;
  const gameExists = gameCounter !== undefined;

  if (!tokenExists || !gameExists) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ Contract Deployment Status</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>Token Contract: {tokenExists ? '✅ Deployed' : '❌ Not Found'}</li>
          <li>Game Contract: {gameExists ? '✅ Deployed' : '❌ Not Found'}</li>
        </ul>
        <p className="text-xs text-yellow-600 mt-2">
          If contracts are not deployed, please deploy them first. See Contracts/README.md for instructions.
        </p>
        <div className="mt-2 text-xs font-mono">
          <p>Token: {config.tokenAddress}</p>
          <p>Game: {config.plinkooGameAddress}</p>
        </div>
      </div>
    );
  }

  return null;
}

