'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePlinkooWeb2 } from '@/hooks/usePlinkoo';
import { useSomniaStreamsWeb2 } from '@/hooks/useSomniaStreams';
import { PlinkooCanvas } from '@/components/PlinkooCanvas';
import { Plinkoo3D } from '@/components/Plinkoo3D';
import { AnimatedBackground } from '@/components/AnimatedBackground';
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
    // Only subscribe if SDK is available
    if (!subscribeToGameResults) return;
    
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
      if (subscription && typeof subscription === 'object' && 'unsubscribe' in subscription) {
        (subscription as any).unsubscribe();
      }
    };
  }, [subscribeToGameResults]);

  // Handle game play
  const handlePlay = async (betAmount: string) => {
    try {
      // Reset game state first
      setGameState({
        pattern: [],
        outcome: 0,
        winnings: 0,
        multiplier: 0,
        isPlaying: false,
      });
      
      const result = await playGame(betAmount);
      
      console.log('Game result:', result);

      // Small delay to ensure canvas is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Update game state to trigger animation
      setGameState({
        pattern: result.pattern,
        outcome: result.outcome,
        winnings: result.winnings,
        multiplier: result.multiplier,
        isPlaying: true,
      });

      // Optionally publish to Somnia Data Streams (if wallet available)
      // Only publish if wallet is connected (will use wallet address)
      if (hasWallet && publishGameResult) {
        try {
          // Get wallet address if available
          const accounts = await window.ethereum?.request({ method: 'eth_accounts' });
          const playerAddress = accounts && accounts.length > 0 
            ? accounts[0] 
            : '0x0000000000000000000000000000000000000000'; // Zero address as fallback
          
          // Only publish if we have a valid address (not zero address)
          if (playerAddress !== '0x0000000000000000000000000000000000000000') {
            await publishGameResult({
              gameId: result.gameId.toString(),
              player: playerAddress,
              betAmount: betAmount,
              outcome: result.outcome,
              multiplier: result.multiplier.toString(),
              winnings: result.winnings.toString(),
              pattern: result.pattern, // Array of numbers [0,1,0,...]
              timestamp: Math.floor(Date.now() / 1000),
            });
          }
        } catch (error) {
          console.warn('Failed to publish to Somnia Data Streams (game still works):', error);
          // Game still works without publishing - don't show error to user
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 relative overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              SomniaDrop Game
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Welcome to Somnia World</p>
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
        </motion.div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-blue-800 dark:text-blue-200">
            🎮 Play instantly — no wallet required.
            <br />
            Connect your wallet anytime to broadcast your game results live to Somnia Data Streams.
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Play SomniaDrop</h2>
              <Plinkoo3D
                pattern={gameState.pattern}
                outcome={gameState.outcome}
                onAnimationComplete={handleAnimationComplete}
                isPlaying={gameState.isPlaying && gameState.pattern.length > 0}
              />
            </motion.div>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GameControls
              onPlay={handlePlay}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onClaim={handleClaim}
              playerBalance={playerBalance}
              isPending={isPending}
              isConfirming={false}
            />
          </motion.div>
        </div>

        {/* Game History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <GameHistoryWeb2 />
        </motion.div>
      </div>
    </div>
  );
}

