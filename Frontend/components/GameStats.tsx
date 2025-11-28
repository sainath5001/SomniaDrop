'use client';

import { formatEther } from 'viem';

interface GameStatsProps {
  playerBalance: string;
  tokenBalance: string;
  lastOutcome?: number;
  lastWinnings?: bigint;
  lastMultiplier?: bigint;
}

export function GameStats({
  playerBalance,
  tokenBalance,
  lastOutcome,
  lastWinnings,
  lastMultiplier,
}: GameStatsProps) {
  const multiplier = lastMultiplier ? Number(lastMultiplier) / 10000 : 0;
  const winnings = lastWinnings ? formatEther(lastWinnings) : '0';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Game Balance</p>
        <p className="text-2xl font-bold">{parseFloat(playerBalance).toFixed(2)} STT</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-600">Wallet Balance</p>
        <p className="text-2xl font-bold">{parseFloat(tokenBalance).toFixed(2)} STT</p>
      </div>
      {lastOutcome !== undefined && (
        <>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Last Outcome</p>
            <p className="text-2xl font-bold">{lastOutcome}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Last Winnings</p>
            <p className="text-2xl font-bold text-green-600">
              {parseFloat(winnings).toFixed(2)} STT
            </p>
            {multiplier > 0 && (
              <p className="text-xs text-gray-500">{multiplier.toFixed(1)}x Multiplier</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}





