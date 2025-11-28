import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { parseEther, formatEther, maxUint256 } from 'viem';
import { plinkooGameABI, erc20ABI } from '@/lib/contracts/plinkooGame';
import { config } from '@/lib/config';
import { useAccount } from 'wagmi';

export function usePlinkoo() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
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

  // Read current allowance
  const { data: allowance } = useReadContract({
    address: config.tokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: address ? [address, config.plinkooGameAddress] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 3000,
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
    if (!address || !publicClient) {
      throw new Error('Wallet not connected');
    }
    
    const amountWei = parseEther(amount);
    
    try {
      // Check current allowance - handle case where contract might not exist
      let currentAllowance = 0n;
      try {
        const result = await publicClient.readContract({
          address: config.tokenAddress,
          abi: erc20ABI,
          functionName: 'allowance',
          args: [address, config.plinkooGameAddress],
        });
        // Handle case where result might be undefined or empty
        currentAllowance = result || 0n;
        console.log('Current allowance:', currentAllowance.toString());
      } catch (error: any) {
        console.warn('Could not read allowance, assuming 0:', error?.message);
        // If we can't read allowance (contract not deployed, etc.), assume it's 0 and proceed with approval
        currentAllowance = 0n;
      }

      // If allowance is insufficient, approve first
      if (currentAllowance < amountWei) {
        console.log('Approving tokens...', { currentAllowance: currentAllowance.toString(), needed: amountWei.toString() });
        
        // Approve with maxUint256 to avoid needing to approve again
        const approveHash = await writeContract({
          address: config.tokenAddress,
          abi: erc20ABI,
          functionName: 'approve',
          args: [config.plinkooGameAddress, maxUint256],
        });
        
        if (!approveHash) {
          throw new Error('Approval transaction failed - no hash returned');
        }

        console.log('Approval transaction sent:', approveHash);
        
        // Wait for approval to be confirmed
        console.log('Waiting for approval confirmation...');
        const approveReceipt = await publicClient.waitForTransactionReceipt({ 
          hash: approveHash,
          timeout: 60_000, // 60 seconds timeout
        });
        
        if (approveReceipt.status === 'reverted') {
          throw new Error('Approval transaction reverted');
        }
        
        console.log('Approval confirmed!', approveReceipt);
      }

      // Now deposit
      console.log('Depositing tokens...', amountWei.toString());
      const depositHash = await writeContract({
        address: config.plinkooGameAddress,
        abi: plinkooGameABI,
        functionName: 'deposit',
        args: [amountWei],
      });
      
      if (!depositHash) {
        throw new Error('Deposit transaction failed - no hash returned');
      }
      
      console.log('Deposit transaction sent:', depositHash);
      
      // Wait for deposit confirmation
      const depositReceipt = await publicClient.waitForTransactionReceipt({ 
        hash: depositHash,
        timeout: 60_000,
      });
      
      if (depositReceipt.status === 'reverted') {
        throw new Error('Deposit transaction reverted');
      }
      
      console.log('Deposit confirmed!', depositReceipt);
      return depositHash;
    } catch (error: any) {
      console.error('Deposit error:', error);
      throw new Error(`Deposit failed: ${error?.message || 'Unknown error'}`);
    }
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
    allowance: allowance ? formatEther(allowance) : '0',
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
