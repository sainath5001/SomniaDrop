# Web2 Migration Guide

This guide explains how to convert the Plinkoo game from Web3 (with smart contracts) to Web2 (using Somnia Data Streams only).

## What Changed

### Removed Dependencies
- ❌ Wagmi (Web3 wallet connection)
- ❌ Viem (for contract interactions)
- ❌ Smart contract ABIs
- ❌ Wallet connection requirements

### What's Still There
- ✅ Somnia Data Streams SDK (for real-time data)
- ✅ Game logic (local implementation)
- ✅ All UI components
- ✅ Game physics and animation

## How to Use Web2 Version

### Option 1: Replace Files (Recommended)

1. **Replace layout**:
   ```bash
   mv app/layout.tsx app/layout-web3.tsx.backup
   mv app/layout-web2.tsx app/layout.tsx
   ```

2. **Replace home page**:
   ```bash
   mv app/page.tsx app/page-web3.tsx.backup
   mv app/page-web2.tsx app/page.tsx
   ```

3. **Replace game page**:
   ```bash
   mv app/game/page.tsx app/game/page-web3.tsx.backup
   mv app/game/page-web2.tsx app/game/page.tsx
   ```

4. **Replace providers**:
   ```bash
   mv lib/providers.tsx lib/providers-web3.tsx.backup
   mv lib/providers-web2.tsx lib/providers.tsx
   ```

5. **Update hooks**:
   ```bash
   mv hooks/usePlinkoo.ts hooks/usePlinkoo-web3.ts.backup
   mv hooks/usePlinkooWeb2.ts hooks/usePlinkoo.ts
   
   mv hooks/useSomniaStreams.ts hooks/useSomniaStreams-web3.ts.backup
   mv hooks/useSomniaStreamsWeb2.ts hooks/useSomniaStreams.ts
   ```

### Option 2: Keep Both Versions

You can keep both Web2 and Web3 versions side by side:
- Web2: `/game` route uses Web2 hooks
- Web3: `/game-web3` route uses Web3 hooks

## Update package.json (Optional)

You can remove Wagmi and Viem if you're only using Web2:

```json
{
  "dependencies": {
    "@somnia-chain/streams": "^0.11.0",
    "@tanstack/react-query": "^5.56.2",
    "next": "^15.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

**Note**: Keep `viem` if you want to publish to Somnia Data Streams (optional feature).

## Features

### Web2 Version
- ✅ No wallet required to play
- ✅ Game data stored in localStorage
- ✅ Same game logic as smart contract
- ✅ Can subscribe to Somnia Data Streams (no wallet needed)
- ✅ Optional: Connect wallet to publish game results

### What You Can Do
1. **Play Games**: Deposit, bet, play, withdraw - all locally
2. **View History**: Game history stored in localStorage
3. **Subscribe to Streams**: See other players' games (if they publish)
4. **Publish Results**: Connect wallet to publish your games to Somnia Data Streams

## Game Logic

The Web2 version implements the same game logic as the smart contract:
- 16 drops (left/right decisions)
- Outcomes: 0-16
- Multipliers:
  - 0/16: 16x
  - 1/15: 9x
  - 2/14: 2x
  - 3/13: 1.4x
  - 4/12: 1.4x
  - 5/11: 1.2x
  - 6/10: 1.1x
  - 7/9: 1x
  - 8: 0.5x

## Data Storage

- **Balance**: Stored in localStorage (`plinkoo_balance`)
- **Game History**: Stored in localStorage (`plinkoo_game_history`)
- **Game Counter**: Stored in localStorage (`plinkoo_game_counter`)

## Somnia Data Streams

### Subscribing (No Wallet Needed)
The Web2 version can subscribe to game results from Somnia Data Streams without a wallet. This allows you to see other players' games in real-time.

### Publishing (Wallet Required)
To publish your game results to Somnia Data Streams, you need to connect a wallet. This is optional - the game works perfectly without it.

## Running the Web2 Version

```bash
cd Frontend
npm install
npm run dev
```

Visit: http://localhost:3000

## Benefits of Web2 Version

1. **No Deployment Needed**: No smart contracts to deploy
2. **No Gas Fees**: No transaction costs
3. **Faster**: Instant game results
4. **Easier Setup**: No wallet connection required
5. **Still Uses Somnia**: Can still leverage Somnia Data Streams for real-time features

## When to Use Web2 vs Web3

### Use Web2 When:
- You want a simple demo/prototype
- You don't need on-chain verification
- You want faster development
- You want to showcase Somnia Data Streams without blockchain complexity

### Use Web3 When:
- You need provable fairness
- You need on-chain verification
- You want decentralized gameplay
- You need token integration

## Need Help?

If you encounter any issues:
1. Check browser console for errors
2. Verify localStorage is enabled
3. Make sure Somnia RPC is accessible for Data Streams
4. Check that `@somnia-chain/streams` is installed



