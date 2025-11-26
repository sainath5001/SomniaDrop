import { useReadContract } from 'wagmi';
import { plinkooGameABI } from '@/lib/contracts/plinkooGame';
import { config } from '@/lib/config';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';

export interface GameData {
  player: `0x${string}`;
  betAmount: bigint;
  outcome: number;
  multiplier: bigint;
  winnings: bigint;
  pattern: bigint[];
  timestamp: bigint;
  claimed: boolean;
}

export function useGameHistory() {
  const { address } = useAccount();

  const { data, isLoading, error } = useReadContract({
    address: config.plinkooGameAddress,
    abi: plinkooGameABI,
    functionName: 'getGameHistory',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  const games: Array<{
    gameId: string;
    data: GameData;
  }> = data
    ? data[0].map((gameId, index) => ({
        gameId: gameId.toString(),
        data: {
          ...data[1][index],
          betAmount: data[1][index].betAmount,
          winnings: data[1][index].winnings,
          multiplier: data[1][index].multiplier,
          pattern: [...data[1][index].pattern], // Convert readonly to mutable
        },
      }))
    : [];

  return {
    games: games.reverse(), // Most recent first
    isLoading,
    error,
  };
}


