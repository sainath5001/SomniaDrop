'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import { somniaTestnet } from './chain';
import { config as appConfig } from './config';
import { useMemo, useState, useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create Wagmi config only on client side, memoized
  const wagmiConfig = useMemo(() => {
    if (typeof window === 'undefined') {
      // Return minimal config for SSR
      return createConfig({
        chains: [somniaTestnet],
        connectors: [],
        transports: {
          [somniaTestnet.id]: http(appConfig.rpcUrl),
        },
        ssr: false,
      });
    }

    return createConfig({
      chains: [somniaTestnet],
      connectors: [
        injected(),
        metaMask(),
        walletConnect({
          projectId: appConfig.walletConnectProjectId || '00000000000000000000000000000000',
          showQrModal: true,
        }),
      ],
      transports: {
        [somniaTestnet.id]: http(appConfig.rpcUrl),
      },
      ssr: false,
    });
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
