'use client';

import { usePlinkooWeb2 } from '@/hooks/usePlinkoo';

export function GameHistoryWeb2() {
  const { gameHistory } = usePlinkooWeb2();

  if (gameHistory.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Game History</h3>
        <p className="text-gray-500">No games played yet</p>
      </div>
    );
  }

  const getMultiplier = (multiplierBps: number) => {
    const multiplier = multiplierBps / 10000;
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
            {gameHistory.map((game) => (
              <tr key={game.gameId} className="border-b hover:bg-gray-50">
                <td className="p-2 font-mono text-xs">#{game.gameId}</td>
                <td className="p-2">{game.betAmount.toFixed(2)}</td>
                <td className="p-2 font-bold">{game.outcome}</td>
                <td className="p-2">{getMultiplier(game.multiplier)}</td>
                <td className={`p-2 ${game.winnings > 0 ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                  {game.winnings.toFixed(2)}
                </td>
                <td className="p-2 text-xs text-gray-500">
                  {new Date(game.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

