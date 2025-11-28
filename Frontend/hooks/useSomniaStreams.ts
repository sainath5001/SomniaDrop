import { useEffect, useState } from 'react';
import { SDK, SchemaEncoder } from '@somnia-chain/streams';
import { createPublicClient, http } from 'viem';

// Schema for game results
const gameResultSchema = `uint256 gameId, address player, uint256 betAmount, uint8 outcome, uint256 multiplier, uint256 winnings, uint256[] pattern, uint256 timestamp`;

// Create a public client for Somnia (no wallet needed for subscribing)
const createSomniaPublicClient = () => {
  return createPublicClient({
    transport: http('https://dream-rpc.somnia.network'),
  });
};

export function useSomniaStreamsWeb2() {
  const [sdk, setSdk] = useState<SDK | null>(null);
  const [schemaId, setSchemaId] = useState<`0x${string}` | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    // Check if wallet is available (optional - only needed for publishing)
    if (typeof window !== 'undefined' && window.ethereum) {
      setHasWallet(true);
    }

    // Initialize SDK with public client only (for subscribing)
    // Use timeout to prevent hanging if RPC is unavailable
    const initializeSDK = async () => {
      try {
        const publicClient = createSomniaPublicClient();
        
        const sdkInstance = new SDK({
          public: publicClient,
          // Wallet is optional - only needed for publishing
          wallet: undefined,
        });

        // Add timeout for schema computation (5 seconds)
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('SDK initialization timeout')), 5000)
        );

        try {
          const computedSchemaId = await Promise.race([
            sdkInstance.streams.computeSchemaId(gameResultSchema),
            timeoutPromise
          ]) as `0x${string}`;
        
        setSdk(sdkInstance);
          setSchemaId(computedSchemaId);
        } catch (timeoutError) {
          // If timeout, still set SDK but without schemaId - app can work without it
          console.warn('SDK schema computation timed out, continuing without it');
          setSdk(sdkInstance);
          setSchemaId(null);
        }
      } catch (error) {
        console.warn('Somnia SDK initialization failed (this is okay - game will work without it):', error);
        // Don't block the app if SDK fails - it's optional
        setSdk(null);
        setSchemaId(null);
      }
    };

    initializeSDK();
  }, []);

  const subscribeToGameResults = (
    onGameResult: (data: any) => void,
    onError?: (error: Error) => void
  ) => {
    if (!sdk) {
      console.warn('SDK not initialized');
      return null;
    }

    try {
      // Subscribe to game results from data streams
      // This works without a wallet - just reads from the stream
      const subscription = sdk.streams.subscribe({
        eventContractSources: [],
        topicOverrides: [],
        ethCalls: [],
        onlyPushChanges: true,
        onData: (data) => {
          try {
            onGameResult(data);
          } catch (error) {
            console.error('Error processing game result:', error);
            onError?.(error as Error);
          }
        },
        onError: (error) => {
          console.error('Subscription error:', error);
          onError?.(error);
        },
      });

      setIsSubscribed(true);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      onError?.(error as Error);
      return null;
    }
  };

  const publishGameResult = async (gameData: {
    gameId: string;
    player: string;
    betAmount: string;
    outcome: number;
    multiplier: string;
    winnings: string;
    pattern: number[];
    timestamp: number;
  }) => {
    if (!sdk || !schemaId) {
      throw new Error('SDK not initialized');
    }

    if (!hasWallet) {
      console.warn('Wallet not available - cannot publish to Somnia Data Streams');
      console.log('Game result (not published):', gameData);
      return null;
    }

    try {
      // Get wallet client (requires user to connect wallet)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No wallet connected');
      }

      // Create wallet client
      const { createWalletClient, custom } = await import('viem');
      const walletClient = createWalletClient({
        transport: custom(window.ethereum),
      });

      // Reinitialize SDK with wallet for publishing
      const sdkWithWallet = new SDK({
        public: createSomniaPublicClient(),
        wallet: walletClient,
      });

      // Validate address format
      const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(gameData.player);
      if (!isValidAddress) {
        throw new Error(`Invalid address format: ${gameData.player}. Must be a valid Ethereum address.`);
      }

      const encoder = new SchemaEncoder(gameResultSchema);
      
      // Convert pattern array to array of strings (required format for uint256[])
      const patternArray = gameData.pattern.map(p => p.toString());
      
      const encodedData = encoder.encodeData([
        { name: 'gameId', value: gameData.gameId, type: 'uint256' },
        { name: 'player', value: gameData.player, type: 'address' },
        { name: 'betAmount', value: gameData.betAmount, type: 'uint256' },
        { name: 'outcome', value: gameData.outcome.toString(), type: 'uint8' },
        { name: 'multiplier', value: gameData.multiplier, type: 'uint256' },
        { name: 'winnings', value: gameData.winnings, type: 'uint256' },
        { name: 'pattern', value: patternArray, type: 'uint256[]' },
        { name: 'timestamp', value: gameData.timestamp.toString(), type: 'uint256' },
      ]);

      const dataId = '0x' + gameData.gameId.padStart(64, '0');
      
      const txHash = await sdkWithWallet.streams.set([
        {
          id: dataId as `0x${string}`,
          schemaId: schemaId,
          data: encodedData,
        },
      ]);

      return txHash;
    } catch (error: any) {
      console.error('Failed to publish game result:', error);
      // Don't throw - game can still work without publishing
      return null;
    }
  };

  return {
    sdk,
    schemaId,
    isSubscribed,
    hasWallet,
    subscribeToGameResults,
    publishGameResult,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

