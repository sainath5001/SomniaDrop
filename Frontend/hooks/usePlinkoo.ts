import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { plinkooGameABI, erc20ABI } from '@/lib/contracts/plinkooGame';
import { config } from '@/lib/config';
import { useAccount } from 'wagmi';

export function usePlinkoo() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Read player balance
  const { data: playerBalance } = useReadContract({
    address: config.plinkooGameAddress,
    abi: plinkooGameABI,
    functionName: 'getPlayerBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Read token balance
  const { data: tokenBalance } = useReadContract({
    address: config.tokenAddress,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  // Read game counter
  const { data: gameCounter } = useReadContract({
    address: config.plinkooGameAddress,
    abi: plinkooGameABI,
    functionName: 'gameCounter',
    query: {
      refetchInterval: 3000,
    },
  });

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const deposit = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    // First approve token
    await writeContract({
      address: config.tokenAddress,
      abi: erc20ABI,
      functionName: 'approve',
      args: [config.plinkooGameAddress, parseEther(amount)],
    });

    // Then deposit
    await writeContract({
      address: config.plinkooGameAddress,
      abi: plinkooGameABI,
      functionName: 'deposit',
      args: [parseEther(amount)],
    });
  };

  const playGame = async (betAmount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: config.plinkooGameAddress,
      abi: plinkooGameABI,
      functionName: 'playGame',
      args: [parseEther(betAmount)],
    });
  };

  const withdraw = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: config.plinkooGameAddress,
      abi: plinkooGameABI,
      functionName: 'withdraw',
      args: [parseEther(amount)],
    });
  };

  const claimWinnings = async () => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: config.plinkooGameAddress,
      abi: plinkooGameABI,
      functionName: 'claimWinnings',
    });
  };

  return {
    playerBalance: playerBalance ? formatEther(playerBalance) : '0',
    tokenBalance: tokenBalance ? formatEther(tokenBalance) : '0',
    gameCounter: gameCounter?.toString() || '0',
    deposit,
    playGame,
    withdraw,
    claimWinnings,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}


