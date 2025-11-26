# Plinkoo Game Frontend

A Next.js 15+ Web3 dApp for playing Plinkoo on Somnia Network with real-time data streaming via Somnia Data Streams SDK.

## Features

- 🎮 Canvas-based Plinkoo game with physics simulation
- 🔗 Wallet connection via RainbowKit
- 💰 Token deposit/withdraw functionality
- 📊 Real-time game statistics
- 📜 Game history tracking
- 🌊 Somnia Data Streams integration for real-time updates
- ⚡ React Query for efficient data fetching

## Tech Stack

- **Next.js 15+** with App Router
- **TypeScript**
- **Viem** for Web3 interactions
- **Wagmi** + **RainbowKit** for wallet connection
- **Somnia Data Streams SDK** for real-time data
- **React Query** for data management
- **Tailwind CSS** for styling

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_PLINKOO_GAME_ADDRESS=0x14A1eFd6C4C737075C89EEB46Aa4f6144A4AF6f2
NEXT_PUBLIC_TOKEN_ADDRESS=0xa1F4D43749ABEdb6a835aF9184CD0A9c194d4C8a
NEXT_PUBLIC_CHAIN_ID=50312
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── game/              # Game page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── PlinkooCanvas.tsx  # Game canvas component
│   ├── GameStats.tsx      # Statistics display
│   ├── GameControls.tsx   # Game controls
│   └── GameHistory.tsx    # History table
├── hooks/                 # Custom React hooks
│   ├── usePlinkoo.ts      # Game contract interactions
│   ├── useGameHistory.ts  # Game history fetching
│   └── useSomniaStreams.ts # Data Streams integration
├── game/                  # Game logic
│   └── BallManager.ts     # Physics engine
├── lib/                   # Utilities and config
│   ├── chain.ts           # Somnia chain config
│   ├── config.ts          # App configuration
│   ├── providers.tsx      # Wagmi/RainbowKit providers
│   └── contracts/         # Contract ABIs
└── package.json
```

## Usage

### Connect Wallet

1. Click "Connect Wallet" on the home page
2. Select your wallet (MetaMask, WalletConnect, etc.)
3. Switch to Somnia Testnet if prompted

### Play Game

1. **Deposit Tokens**: Deposit STT tokens to your game balance
2. **Set Bet Amount**: Enter the amount you want to bet
3. **Play**: Click "Play Game" and confirm the transaction
4. **Watch**: The ball will drop through the Plinkoo board
5. **Results**: See your outcome and winnings

### Real-Time Updates

The app uses Somnia Data Streams SDK to:
- Stream game results in real-time
- Update statistics automatically
- Show live game history

## Smart Contract Integration

The frontend interacts with the `PlinkooGame` contract:

- `playGame(uint256 betAmount)` - Play a game
- `deposit(uint256 amount)` - Deposit tokens
- `withdraw(uint256 amount)` - Withdraw tokens
- `getPlayerBalance(address)` - Get player balance
- `getGameHistory(address)` - Get game history

## Somnia Data Streams

The app subscribes to `GamePlayed` events and streams them in real-time using the Somnia Data Streams SDK. This allows for:

- Instant UI updates when games are played
- Real-time leaderboards
- Live statistics

## Development

### Type Checking

```bash
npm run type-check
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Troubleshooting

### Wallet Connection Issues

- Make sure you're on Somnia Testnet
- Check that your wallet is unlocked
- Try disconnecting and reconnecting

### Transaction Failures

- Ensure you have enough STT tokens
- Check that you've approved the token contract
- Verify you have sufficient game balance

### RPC Errors

- Check your RPC URL in `.env.local`
- Try using a different RPC endpoint
- Check network connectivity

## License

MIT


