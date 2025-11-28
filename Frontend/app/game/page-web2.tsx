'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlinkooWeb2 } from '@/hooks/usePlinkooWeb2';
import { useSomniaStreamsWeb2 } from '@/hooks/useSomniaStreamsWeb2';
import { PlinkooCanvas } from '@/components/PlinkooCanvas';
import { GameStats } from '@/components/GameStats';
import { GameControls } from '@/components/GameControls';
import { GameHistoryWeb2 } from '@/components/GameHistoryWeb2';

export default function GamePageWeb2() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    playerBalance,
    gameHistory,
    deposit,
    playGame,
    withdraw,
    claimWinnings,
    isPending,
  } = usePlinkooWeb2();

  const { subscribeToGameResults, publishGameResult, hasWallet } = useSomniaStreamsWeb2();

  const [gameState, setGameState] = useState<{
    pattern: number[];
    outcome: number;
    winnings: number;
    multiplier: number;
    isPlaying: boolean;
  }>({
    pattern: [],
    outcome: 0,
    winnings: 0,
    multiplier: 0,
    isPlaying: false,
  });

  // Subscribe to real-time game results from other players (optional)
  useEffect(() => {
    const subscription = subscribeToGameResults(
      (data) => {
        console.log('New game result streamed from another player:', data);
        // Update UI with streamed data if needed
      },
      (error) => {
        console.error('Stream error:', error);
      }
    );

    return () => {
      if (subscription && 'unsubscribe' in subscription) {
        subscription.unsubscribe();
      }
    };
  }, [subscribeToGameResults]);

  // Handle game play
  const handlePlay = async (betAmount: string) => {
    try {
      setGameState((prev) => ({ ...prev, isPlaying: false }));
      
      const result = await playGame(betAmount);
      
      console.log('Game result:', result);

      // Update game state
      setGameState({
        pattern: result.pattern,
        outcome: result.outcome,
        winnings: result.winnings,
        multiplier: result.multiplier,
        isPlaying: true,
      });

      // Optionally publish to Somnia Data Streams (if wallet available)
      if (hasWallet) {
        try {
          await publishGameResult({
            gameId: result.gameId.toString(),
            player: 'web2_player', // Could use a user ID
            betAmount: betAmount,
            outcome: result.outcome,
            multiplier: result.multiplier.toString(),
            winnings: result.winnings.toString(),
            pattern: result.pattern,
            timestamp: Math.floor(Date.now() / 1000),
          });
        } catch (error) {
          console.warn('Failed to publish to Somnia Data Streams:', error);
          // Game still works without publishing
        }
      }
    } catch (error: any) {
      console.error('Error playing game:', error);
      alert(`Failed to play game: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleAnimationComplete = (outcome: number) => {
    setGameState((prev) => ({ ...prev, isPlaying: false }));
  };

  const handleDeposit = async (amount: string) => {
    try {
      await deposit(amount);
      alert('Deposit successful!');
    } catch (error: any) {
      console.error('Error depositing:', error);
      alert(`Failed to deposit: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleWithdraw = async (amount: string) => {
    try {
      await withdraw(amount);
      alert('Withdrawal successful!');
    } catch (error: any) {
      console.error('Error withdrawing:', error);
      alert(`Failed to withdraw: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleClaim = async () => {
    try {
      await claimWinnings();
      alert('Winnings claimed!');
    } catch (error: any) {
      console.error('Error claiming:', error);
      alert(`Failed to claim winnings: ${error?.message || 'Unknown error'}`);
    }
  };

  // Prevent hydration mismatch
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plinkoo Game (Web2)
            </h1>
            <p className="text-gray-600">Somnia Data Streams Integration - No Wallet Required!</p>
            {hasWallet && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Wallet detected - Game results will be published to Somnia Data Streams
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Home
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            🎮 This is a Web2 version - no wallet connection required! Game data is stored locally.
            {hasWallet && ' Connect your wallet to publish game results to Somnia Data Streams.'}
          </p>
        </div>

        {/* Transaction Status */}
        {isPending && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">Processing...</p>
          </div>
        )}

        {/* Game Stats */}
        <GameStats
          playerBalance={playerBalance}
          tokenBalance="0"
          lastOutcome={gameState.outcome}
          lastWinnings={BigInt(Math.floor(gameState.winnings))}
          lastMultiplier={BigInt(gameState.multiplier)}
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
              isPending={isPending}
              isConfirming={false}
            />
          </div>
        </div>

        {/* Game History */}
        <div className="mt-6">
          <GameHistoryWeb2 />
        </div>
      </div>
    </div>
  );
}

