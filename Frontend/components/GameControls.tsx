'use client';

import { useState } from 'react';

interface GameControlsProps {
  onPlay: (betAmount: string) => void;
  onDeposit: (amount: string) => void;
  onWithdraw: (amount: string) => void;
  onClaim: () => void;
  playerBalance: string;
  isPending: boolean;
  isConfirming: boolean;
}

export function GameControls({
  onPlay,
  onDeposit,
  onWithdraw,
  onClaim,
  playerBalance,
  isPending,
  isConfirming,
}: GameControlsProps) {
  const [betAmount, setBetAmount] = useState('1');
  const [depositAmount, setDepositAmount] = useState('10');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const isLoading = isPending || isConfirming;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h3 className="text-xl font-bold mb-4">Game Controls</h3>

      {/* Play Game */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Bet Amount (STT)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            min="1"
            step="0.1"
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isLoading}
          />
          <button
            onClick={() => onPlay(betAmount)}
            disabled={isLoading || parseFloat(playerBalance) < parseFloat(betAmount)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Play Game'}
          </button>
        </div>
        <p className="text-xs text-gray-500">Balance: {parseFloat(playerBalance).toFixed(2)} STT</p>
      </div>

      <div className="border-t pt-4 space-y-4">
        {/* Deposit */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Deposit (STT)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="0.1"
              step="0.1"
              className="flex-1 px-4 py-2 border rounded-lg"
              disabled={isLoading}
            />
            <button
              onClick={() => onDeposit(depositAmount)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Deposit
            </button>
          </div>
        </div>

        {/* Withdraw */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Withdraw (STT)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              min="0.1"
              step="0.1"
              max={playerBalance}
              placeholder={playerBalance}
              className="flex-1 px-4 py-2 border rounded-lg"
              disabled={isLoading}
            />
            <button
              onClick={() => {
                onWithdraw(withdrawAmount || playerBalance);
                setWithdrawAmount('');
              }}
              disabled={isLoading || parseFloat(playerBalance) === 0}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Claim Winnings */}
        <button
          onClick={onClaim}
          disabled={isLoading || parseFloat(playerBalance) === 0}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          Claim All Winnings
        </button>
      </div>
    </div>
  );
}


