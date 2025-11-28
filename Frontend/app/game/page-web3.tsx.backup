'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { WalletButton } from '@/components/WalletButton';
import { usePlinkoo } from '@/hooks/usePlinkoo';
import { useSomniaStreams } from '@/hooks/useSomniaStreams';
import { PlinkooCanvas } from '@/components/PlinkooCanvas';
import { GameStats } from '@/components/GameStats';
import { GameControls } from '@/components/GameControls';
import { GameHistory } from '@/components/GameHistory';
import { ContractStatus } from '@/components/ContractStatus';
import { parseEther, formatEther } from 'viem';
import { useReadContract } from 'wagmi';
import { plinkooGameABI } from '@/lib/contracts/plinkooGame';
import { config } from '@/lib/config';

export default function GamePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const {
    playerBalance,
    tokenBalance,
    deposit,
    playGame,
    withdraw,
    claimWinnings,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  } = usePlinkoo();

  const { subscribeToGameResults } = useSomniaStreams();

  const [gameState, setGameState] = useState<{
    pattern: number[];
    outcome: number;
    winnings: bigint;
    multiplier: bigint;
    isPlaying: boolean;
  }>({
    pattern: [],
    outcome: 0,
    winnings: 0n,
    multiplier: 0n,
    isPlaying: false,
  });

  // Read last game result
  const { data: lastGame } = useReadContract({
    address: config.plinkooGameAddress,
    abi: plinkooGameABI,
    functionName: 'getGame',
    args: gameState.outcome > 0 ? [BigInt(gameState.outcome)] : undefined,
    query: {
      enabled: gameState.outcome > 0,
    },
  });

  // Subscribe to real-time game results
  useEffect(() => {
    if (!isConnected || !address) return;

    const subscriptionPromise = subscribeToGameResults(
      (data) => {
        console.log('New game result streamed:', data);
        // Handle real-time game result
        // Update game state with streamed data
      },
      (error) => {
        console.error('Stream error:', error);
      }
    );

    return () => {
      if (subscriptionPromise) {
        subscriptionPromise.then((sub) => {
          if (sub && 'unsubscribe' in sub && typeof sub.unsubscribe === 'function') {
            sub.unsubscribe();
          }
        }).catch(console.error);
      }
    };
  }, [isConnected, address, subscribeToGameResults]);

  // Handle game play
  const handlePlay = async (betAmount: string) => {
    try {
      setGameState((prev) => ({ ...prev, isPlaying: false }));
      
      const txHash = await playGame(betAmount);
      console.log('Transaction sent:', txHash);

      // Wait for transaction confirmation and get result
      // In a real implementation, you'd listen to the GamePlayed event
      // For now, we'll simulate with a delay
      setTimeout(() => {
        // This would come from the event log
        const mockPattern = Array.from({ length: 16 }, () => Math.floor(Math.random() * 2));
        const mockOutcome = mockPattern.reduce((sum, val) => sum + val, 0);
        
        setGameState({
          pattern: mockPattern,
          outcome: mockOutcome,
          winnings: 0n,
          multiplier: 0n,
          isPlaying: true,
        });
      }, 2000);
    } catch (error) {
      console.error('Error playing game:', error);
      alert('Failed to play game. Check console for details.');
    }
  };

  const handleAnimationComplete = (outcome: number) => {
    setGameState((prev) => ({ ...prev, isPlaying: false }));
    // Fetch actual game data
    if (lastGame) {
      setGameState((prev) => ({
        ...prev,
        winnings: lastGame.winnings,
        multiplier: lastGame.multiplier,
      }));
    }
  };

  const handleDeposit = async (amount: string) => {
    try {
      console.log('Starting deposit process...');
      const depositHash = await deposit(amount);
      console.log('Deposit transaction sent:', depositHash);
      
      if (depositHash) {
        // The transaction is now pending
        // The UI will update automatically via the hooks
        alert('Deposit transaction submitted! Waiting for confirmation...');
      }
    } catch (error: any) {
      console.error('Error depositing:', error);
      alert(`Failed to deposit: ${error?.message || 'Unknown error'}. Check console for details.`);
    }
  };

  const handleWithdraw = async (amount: string) => {
    try {
      await withdraw(amount);
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Failed to withdraw.');
    }
  };

  const handleClaim = async () => {
    try {
      await claimWinnings();
    } catch (error) {
      console.error('Error claiming:', error);
      alert('Failed to claim winnings.');
    }
  };

  // Prevent hydration mismatch - show loading during SSR
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
          <WalletButton />
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plinkoo Game
            </h1>
            <p className="text-gray-600">Somnia Data Streams Integration</p>
          </div>
          <div className="flex items-center gap-4">
            <WalletButton />
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Home
            </button>
          </div>
        </div>

        {/* Contract Status */}
        <ContractStatus />

        {/* Transaction Status */}
        {(isPending || isConfirming) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              {isPending ? 'Transaction pending...' : 'Waiting for confirmation...'}
            </p>
            {hash && (
              <p className="text-sm text-yellow-600 mt-1">
                Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
              </p>
            )}
          </div>
        )}

        {isConfirmed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">Transaction confirmed!</p>
          </div>
        )}

        {/* Game Stats */}
        <GameStats
          playerBalance={playerBalance}
          tokenBalance={tokenBalance}
          lastOutcome={gameState.outcome}
          lastWinnings={gameState.winnings}
          lastMultiplier={gameState.multiplier}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Play Plinkoo</h2>
              <PlinkooCanvas
                pattern={gameState.pattern}
                outcome={gameState.outcome}
                onAnimationComplete={handleAnimationComplete}
                isPlaying={gameState.isPlaying}
              />
            </div>
          </div>

          {/* Controls */}
          <div>
            <GameControls
              onPlay={handlePlay}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onClaim={handleClaim}
              playerBalance={playerBalance}
              isPending={isPending || isConfirming}
              isConfirming={isConfirming}
            />
          </div>
        </div>

        {/* Game History */}
        <div className="mt-6">
          <GameHistory />
        </div>
      </div>
    </div>
  );
}

