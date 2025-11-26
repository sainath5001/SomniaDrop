'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import { somniaTestnet } from './chain';
import { config as appConfig } from './config';
import { useState, useEffect } from 'react';

// Create Wagmi config - only on client side
function createWagmiConfig() {
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
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [wagmiConfig, setWagmiConfig] = useState<ReturnType<typeof createWagmiConfig> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only create config on client side
    if (typeof window !== 'undefined') {
      setWagmiConfig(createWagmiConfig());
    }
  }, []);

  // Show loading state during SSR
  if (!mounted || !wagmiConfig) {
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
