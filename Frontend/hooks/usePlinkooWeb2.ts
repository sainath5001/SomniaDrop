import { useState, useEffect, useCallback } from 'react';

// Game logic constants (matching smart contract)
const NUM_DROPS = 16;
const MAX_OUTCOME = 16;
const MIN_BET = 1;

// Multipliers in basis points (10000 = 1x)
const getMultiplier = (outcome: number): number => {
  if (outcome === 0 || outcome === 16) return 160000; // 16x
  if (outcome === 1 || outcome === 15) return 90000; // 9x
  if (outcome === 2 || outcome === 14) return 20000; // 2x
  if (outcome === 3 || outcome === 13) return 14000; // 1.4x
  if (outcome === 4 || outcome === 12) return 14000; // 1.4x
  if (outcome === 5 || outcome === 11) return 12000; // 1.2x
  if (outcome === 6 || outcome === 10) return 11000; // 1.1x
  if (outcome === 7 || outcome === 9) return 10000; // 1x
  if (outcome === 8) return 5000; // 0.5x
  return 0;
};

// Generate random pattern (16 drops)
const generatePattern = (): number[] => {
  const pattern: number[] = [];
  for (let i = 0; i < NUM_DROPS; i++) {
    pattern.push(Math.floor(Math.random() * 2));
  }
  return pattern;
};

// Calculate outcome from pattern (count of 1s)
const calculateOutcome = (pattern: number[]): number => {
  return pattern.reduce((sum, val) => sum + val, 0);
};

// Calculate winnings
const calculateWinnings = (betAmount: number, outcome: number): number => {
  const multiplier = getMultiplier(outcome);
  if (multiplier === 0) return 0;
  return Math.floor((betAmount * multiplier) / 10000);
};

// LocalStorage keys
const STORAGE_KEYS = {
  BALANCE: 'plinkoo_balance',
  GAME_HISTORY: 'plinkoo_game_history',
  GAME_COUNTER: 'plinkoo_game_counter',
};

export interface GameData {
  gameId: number;
  player: string;
  betAmount: number;
  outcome: number;
  multiplier: number;
  winnings: number;
  pattern: number[];
  timestamp: number;
  claimed: boolean;
}

export function usePlinkooWeb2() {
  const [playerBalance, setPlayerBalance] = useState<string>('0');
  const [gameHistory, setGameHistory] = useState<GameData[]>([]);
  const [gameCounter, setGameCounter] = useState<number>(0);
  const [isPending, setIsPending] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const balance = localStorage.getItem(STORAGE_KEYS.BALANCE);
    const history = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
    const counter = localStorage.getItem(STORAGE_KEYS.GAME_COUNTER);

    if (balance) setPlayerBalance(balance);
    if (history) {
      try {
        setGameHistory(JSON.parse(history));
      } catch (e) {
        console.error('Failed to parse game history:', e);
      }
    }
    if (counter) setGameCounter(parseInt(counter, 10));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BALANCE, playerBalance);
    localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(gameHistory));
    localStorage.setItem(STORAGE_KEYS.GAME_COUNTER, gameCounter.toString());
  }, [playerBalance, gameHistory, gameCounter]);

  const deposit = useCallback(async (amount: string): Promise<string | null> => {
    setIsPending(true);
    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Invalid amount');
      }

      const currentBalance = parseFloat(playerBalance) || 0;
      const newBalance = currentBalance + amountNum;
      setPlayerBalance(newBalance.toFixed(6));

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
      return 'deposit_success';
    } catch (error: any) {
      console.error('Deposit error:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [playerBalance]);

  const playGame = useCallback(async (betAmount: string): Promise<{
    gameId: number;
    outcome: number;
    multiplier: number;
    winnings: number;
    pattern: number[];
  }> => {
    setIsPending(true);
    try {
      const betAmountNum = parseFloat(betAmount);
      if (isNaN(betAmountNum) || betAmountNum < MIN_BET) {
        throw new Error(`Bet amount must be at least ${MIN_BET}`);
      }

      const currentBalance = parseFloat(playerBalance) || 0;
      if (betAmountNum > currentBalance) {
        throw new Error('Insufficient balance');
      }

      // Deduct bet from balance
      const newBalance = currentBalance - betAmountNum;
      setPlayerBalance(newBalance.toFixed(6));

      // Generate game result
      const pattern = generatePattern();
      const outcome = calculateOutcome(pattern);
      const multiplier = getMultiplier(outcome);
      const winnings = calculateWinnings(betAmountNum, outcome);

      // Increment game counter
      const newGameId = gameCounter + 1;
      setGameCounter(newGameId);

      // Add winnings to balance if won
      if (winnings > 0) {
        const finalBalance = parseFloat(newBalance.toFixed(6)) + winnings;
        setPlayerBalance(finalBalance.toFixed(6));
      }

      // Create game data
      const gameData: GameData = {
        gameId: newGameId,
        player: 'web2_player', // Could use a user ID or session ID
        betAmount: betAmountNum,
        outcome,
        multiplier,
        winnings,
        pattern,
        timestamp: Date.now(),
        claimed: false,
      };

      // Add to history
      setGameHistory((prev) => [gameData, ...prev]);

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        gameId: newGameId,
        outcome,
        multiplier,
        winnings,
        pattern,
      };
    } catch (error: any) {
      console.error('Play game error:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [playerBalance, gameCounter]);

  const withdraw = useCallback(async (amount: string): Promise<string | null> => {
    setIsPending(true);
    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Invalid amount');
      }

      const currentBalance = parseFloat(playerBalance) || 0;
      if (amountNum > currentBalance) {
        throw new Error('Insufficient balance');
      }

      const newBalance = currentBalance - amountNum;
      setPlayerBalance(newBalance.toFixed(6));

      await new Promise((resolve) => setTimeout(resolve, 500));
      return 'withdraw_success';
    } catch (error: any) {
      console.error('Withdraw error:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [playerBalance]);

  const claimWinnings = useCallback(async (): Promise<string | null> => {
    setIsPending(true);
    try {
      // In Web2 version, winnings are already added to balance
      // This function is kept for API compatibility
      await new Promise((resolve) => setTimeout(resolve, 300));
      return 'claim_success';
    } catch (error: any) {
      console.error('Claim error:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  }, []);

  return {
    playerBalance,
    tokenBalance: '0', // Not used in Web2
    gameHistory,
    gameCounter: gameCounter.toString(),
    deposit,
    playGame,
    withdraw,
    claimWinnings,
    isPending,
    isConfirming: false,
    isConfirmed: false,
    error: null,
    hash: null,
  };
}



