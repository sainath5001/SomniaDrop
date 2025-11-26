'use client';

import { useGameHistory, GameData } from '@/hooks/useGameHistory';
import { formatEther } from 'viem';

export function GameHistory() {
  const { games, isLoading } = useGameHistory();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Game History</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Game History</h3>
        <p className="text-gray-500">No games played yet</p>
      </div>
    );
  }

  const getMultiplier = (multiplierBps: bigint) => {
    const multiplier = Number(multiplierBps) / 10000;
    return multiplier.toFixed(1) + 'x';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Game History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Game ID</th>
              <th className="text-left p-2">Bet</th>
              <th className="text-left p-2">Outcome</th>
              <th className="text-left p-2">Multiplier</th>
              <th className="text-left p-2">Winnings</th>
              <th className="text-left p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {games.map(({ gameId, data }) => (
              <tr key={gameId} className="border-b hover:bg-gray-50">
                <td className="p-2 font-mono text-xs">{gameId.slice(0, 8)}...</td>
                <td className="p-2">{parseFloat(formatEther(data.betAmount)).toFixed(2)} STT</td>
                <td className="p-2 font-bold">{data.outcome}</td>
                <td className="p-2">{getMultiplier(data.multiplier)}</td>
                <td className={`p-2 ${data.winnings > 0n ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                  {parseFloat(formatEther(data.winnings)).toFixed(2)} STT
                </td>
                <td className="p-2 text-xs text-gray-500">
                  {new Date(Number(data.timestamp) * 1000).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


