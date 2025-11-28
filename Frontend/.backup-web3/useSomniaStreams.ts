import { useEffect, useState } from 'react';
import { SDK, SchemaEncoder, zeroBytes32 } from '@somnia-chain/streams';
import { usePublicClient, useWalletClient } from 'wagmi';
import { config } from '@/lib/config';
import { useAccount } from 'wagmi';

// Schema for game results
const gameResultSchema = `uint256 gameId, address player, uint256 betAmount, uint8 outcome, uint256 multiplier, uint256 winnings, uint256[] pattern, uint256 timestamp`;

export function useSomniaStreams() {
  const publicClient = usePublicClient();
  const walletClient = useWalletClient();
  const { address } = useAccount();
  const [sdk, setSdk] = useState<SDK | null>(null);
  const [schemaId, setSchemaId] = useState<`0x${string}` | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!publicClient) return;

    const initializeSDK = async () => {
      try {
        const sdkInstance = new SDK({
          public: publicClient,
          wallet: walletClient?.data || undefined,
        });

        const computedSchemaId = await sdkInstance.streams.computeSchemaId(gameResultSchema);
        
        setSdk(sdkInstance);
        setSchemaId(computedSchemaId as `0x${string}`);
      } catch (error) {
        console.error('Failed to initialize Somnia SDK:', error);
      }
    };

    initializeSDK();
  }, [publicClient, walletClient]);

  const subscribeToGameResults = (
    onGameResult: (data: any) => void,
    onError?: (error: Error) => void
  ) => {
    if (!sdk || !address) return null;

    try {
      // Subscribe to GamePlayed events from the contract
      // Calculate event signature hash (first 32 bytes of keccak256 hash)
      const eventSig = 'GamePlayed(address,uint256,uint256,uint8,uint256,uint256,uint256[],uint256)';
      const topicHash = ('0x' + eventSig.slice(0, 64).padEnd(64, '0')) as `0x${string}`;
      
      const subscription = sdk.streams.subscribe({
        eventContractSources: [config.plinkooGameAddress],
        topicOverrides: [topicHash],
        ethCalls: [],
        onlyPushChanges: true,
        onData: (data) => {
          try {
            // Decode the event data
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
    if (!sdk || !schemaId || !walletClient?.data) {
      throw new Error('SDK or wallet not initialized');
    }

    const encoder = new SchemaEncoder(gameResultSchema);
    const encodedData = encoder.encodeData([
      { name: 'gameId', value: gameData.gameId, type: 'uint256' },
      { name: 'player', value: gameData.player, type: 'address' },
      { name: 'betAmount', value: gameData.betAmount, type: 'uint256' },
      { name: 'outcome', value: gameData.outcome.toString(), type: 'uint8' },
      { name: 'multiplier', value: gameData.multiplier, type: 'uint256' },
      { name: 'winnings', value: gameData.winnings, type: 'uint256' },
      { name: 'pattern', value: JSON.stringify(gameData.pattern), type: 'uint256[]' },
      { name: 'timestamp', value: gameData.timestamp.toString(), type: 'uint256' },
    ]);

    const dataId = '0x' + gameData.gameId.padStart(64, '0');
    
    const txHash = await sdk.streams.set([
      {
        id: dataId as `0x${string}`,
        schemaId: schemaId,
        data: encodedData,
      },
    ]);

    return txHash;
  };

  return {
    sdk,
    schemaId,
    isSubscribed,
    subscribeToGameResults,
    publishGameResult,
  };
}

