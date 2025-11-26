export const config = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://dream-rpc.somnia.network',
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 50312,
  plinkooGameAddress: process.env.NEXT_PUBLIC_PLINKOO_GAME_ADDRESS as `0x${string}` || '0x14A1eFd6C4C737075C89EEB46Aa4f6144A4AF6f2',
  tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}` || '0xa1F4D43749ABEdb6a835aF9184CD0A9c194d4C8a',
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
} as const;


