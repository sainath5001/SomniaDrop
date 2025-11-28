# SomniaDrop Game - Frontend

A modern Web2/Web3 hybrid game frontend built with Next.js 15, featuring Somnia Data Streams integration for real-time game data broadcasting.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Code Workflow](#code-workflow)
- [Somnia Data Streams Integration](#somnia-data-streams-integration)
- [Dark Mode](#dark-mode)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

## 🎮 Overview

SomniaDrop is a Plinkoo-style game that can run in two modes:
- **Web2 Mode** (Default): No wallet required, data stored locally
- **Web3 Mode**: Full blockchain integration with smart contracts

The game uses **Somnia Data Streams** to broadcast game results in real-time, enabling live statistics and multiplayer features.

## ✨ Features

- 🎯 **Web2 & Web3 Support**: Play with or without wallet connection
- 🌊 **Somnia Data Streams**: Real-time game result broadcasting
- 💾 **Local Storage**: Game data persists in browser
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🎨 **Modern UI**: Beautiful gradient design with Tailwind CSS
- ⚡ **Real-time Physics**: Canvas-based ball animation
- 📊 **Game Statistics**: Track wins, losses, and history
- 🔄 **Auto-save**: Game state automatically saved

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Browser (Client)                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐      ┌──────────────────┐   │
│  │   Next.js    │      │  Somnia Data     │   │
│  │   Frontend   │◄────►│  Streams SDK    │   │
│  └──────────────┘      └──────────────────┘   │
│         │                        │             │
│         │                        │             │
│         ▼                        ▼             │
│  ┌──────────────┐      ┌──────────────────┐   │
│  │  Local       │      │  Somnia Network  │   │
│  │  Storage     │      │  (RPC Endpoint)  │   │
│  └──────────────┘      └──────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Data Flow

1. **User Plays Game** → Game logic runs locally
2. **Result Generated** → Stored in localStorage
3. **Optional Broadcast** → If wallet connected, publish to Somnia Data Streams
4. **Real-time Updates** → Subscribe to other players' games

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + localStorage
- **Data Streams**: @somnia-chain/streams SDK
- **Web3** (Optional): Viem, Wagmi
- **UI Components**: Custom React components

## 📁 Project Structure

```
Frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   ├── game/
│   │   └── page.tsx             # Game page
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── DarkModeToggle.tsx       # Dark mode toggle button
│   ├── PlinkooCanvas.tsx        # Game canvas component
│   ├── GameStats.tsx            # Statistics display
│   ├── GameControls.tsx         # Deposit/Withdraw/Play controls
│   ├── GameHistoryWeb2.tsx      # Game history table
│   └── WalletButton.tsx         # Wallet connection (Web3)
│
├── hooks/                        # Custom React hooks
│   ├── usePlinkoo.ts            # Main game logic hook (Web2)
│   ├── useSomniaStreams.ts      # Somnia Data Streams integration
│   └── useGameHistory.ts        # Game history management
│
├── game/                         # Game logic
│   └── BallManager.ts           # Physics engine for ball animation
│
├── lib/                          # Utilities and config
│   ├── config.ts                # App configuration
│   ├── providers.tsx             # React Query + Providers
│   ├── chain.ts                 # Somnia chain configuration
│   └── contracts/                # Contract ABIs (Web3)
│
└── package.json                  # Dependencies
```

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- Modern browser with localStorage support

### Installation

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit: **http://localhost:3000**

### Build for Production

```bash
npm run build
npm start
```

## 🔄 Code Workflow

### 1. Application Initialization

```
app/layout.tsx
  └─> ProvidersWeb2 (QueryClientProvider)
      └─> DarkModeToggle (Theme toggle)
      └─> Page Content
```

### 2. Home Page Flow

```
app/page.tsx
  └─> User clicks "Start Playing"
      └─> Router.push('/game')
          └─> Game Page Loads
```

### 3. Game Page Flow

```
app/game/page.tsx
  ├─> usePlinkooWeb2() hook
  │   ├─> Loads balance from localStorage
  │   ├─> Loads game history
  │   └─> Provides: deposit, playGame, withdraw, claimWinnings
  │
  ├─> useSomniaStreamsWeb2() hook
  │   ├─> Initializes Somnia SDK
  │   ├─> Subscribes to game results (optional)
  │   └─> Provides: publishGameResult
  │
  └─> User Interactions:
      ├─> Deposit → Updates localStorage balance
      ├─> Play Game → Generates result → Updates state → Animates ball
      ├─> Withdraw → Updates localStorage balance
      └─> (Optional) Publish to Somnia Data Streams
```

### 4. Game Logic Flow

```
User clicks "Play Game"
  │
  ├─> handlePlay() called
  │   │
  │   ├─> playGame(betAmount) from usePlinkooWeb2
  │   │   │
  │   │   ├─> Validates bet amount
  │   │   ├─> Deducts from balance (localStorage)
  │   │   ├─> Generates random pattern (16 drops)
  │   │   ├─> Calculates outcome (0-16)
  │   │   ├─> Calculates multiplier & winnings
  │   │   ├─> Updates balance with winnings
  │   │   └─> Saves to game history
  │   │
  │   ├─> Updates gameState with result
  │   │   └─> Triggers PlinkooCanvas animation
  │   │
  │   └─> (If wallet connected) publishGameResult()
  │       └─> Encodes data → Publishes to Somnia Data Streams
```

### 5. Ball Animation Flow

```
PlinkooCanvas component
  │
  ├─> Receives pattern and outcome
  │
  ├─> BallManager.startGame()
  │   │
  │   ├─> Creates ball at top center
  │   ├─> Applies pattern-based direction
  │   ├─> Physics simulation:
  │   │   ├─> Gravity (vy += 0.5)
  │   │   ├─> Collision detection
  │   │   ├─> Bounce physics
  │   │   └─> Pattern direction changes
  │   │
  │   └─> Animation loop (requestAnimationFrame)
  │       └─> Ball reaches bottom → onComplete callback
```

## 🌊 Somnia Data Streams Integration

### How It Works

Somnia Data Streams allows real-time broadcasting of game data to the Somnia network without requiring full blockchain transactions.

### Schema Definition

```typescript
const gameResultSchema = `uint256 gameId, address player, uint256 betAmount, 
                          uint8 outcome, uint256 multiplier, uint256 winnings, 
                          uint256[] pattern, uint256 timestamp`;
```

### Publishing Game Results

```typescript
// In useSomniaStreams.ts
const publishGameResult = async (gameData) => {
  // 1. Validate wallet connection
  if (!hasWallet) return null;
  
  // 2. Get wallet address
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  
  // 3. Encode data with SchemaEncoder
  const encoder = new SchemaEncoder(gameResultSchema);
  const encodedData = encoder.encodeData([
    { name: 'gameId', value: gameData.gameId, type: 'uint256' },
    { name: 'player', value: accounts[0], type: 'address' },
    // ... other fields
  ]);
  
  // 4. Publish to Somnia Data Streams
  const txHash = await sdk.streams.set([{
    id: dataId,
    schemaId: schemaId,
    data: encodedData,
  }]);
  
  return txHash;
};
```

### Subscribing to Game Results

```typescript
// Subscribe to other players' games
const subscription = sdk.streams.subscribe({
  eventContractSources: [],
  topicOverrides: [],
  onlyPushChanges: true,
  onData: (data) => {
    // Handle incoming game results
    console.log('New game result:', data);
  },
});
```

### Integration Points

1. **SDK Initialization**: `hooks/useSomniaStreams.ts`
   - Creates public client for Somnia RPC
   - Computes schema ID
   - Handles wallet connection (optional)

2. **Publishing**: `app/game/page.tsx` → `handlePlay()`
   - After game completes
   - Only if wallet connected
   - Non-blocking (game works without it)

3. **Subscribing**: `app/game/page.tsx` → `useEffect`
   - Listens for other players' games
   - Updates UI in real-time

## 🌙 Dark Mode

Dark mode is implemented using Tailwind's `dark:` classes and localStorage persistence.

### Implementation

```typescript
// components/DarkModeToggle.tsx
- Toggles `dark` class on `<html>` element
- Persists preference in localStorage
- Respects system preference on first load
```

### Usage

The toggle button is fixed in the top-right corner. Click to switch between light and dark themes.

## ⚙️ Environment Variables

Create `.env.local` file (optional for Web2 mode):

```env
# Somnia Network Configuration
NEXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_CHAIN_ID=50312

# Contract Addresses (Web3 mode only)
NEXT_PUBLIC_PLINKOO_GAME_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_ADDRESS=0x...

# WalletConnect (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

**Note**: Web2 mode works without any environment variables!

## 🎯 Usage

### Playing a Game

1. **Deposit**: Add tokens to your game balance
2. **Set Bet**: Enter bet amount
3. **Play**: Click "Play Game"
4. **Watch**: Ball animates through obstacles
5. **Result**: See outcome, multiplier, and winnings

### Game Rules

- **16 Drops**: Each game has 16 left/right decisions
- **Outcomes**: 0-16 (number of right turns)
- **Multipliers**:
  - 0/16: 16x
  - 1/15: 9x
  - 2/14: 2x
  - 3/13: 1.4x
  - 4/12: 1.4x
  - 5/11: 1.2x
  - 6/10: 1.1x
  - 7/9: 1x
  - 8: 0.5x

### Data Storage

- **Balance**: `localStorage.plinkoo_balance`
- **Game History**: `localStorage.plinkoo_game_history`
- **Game Counter**: `localStorage.plinkoo_game_counter`
- **Dark Mode**: `localStorage.darkMode`

## 🔧 Troubleshooting

### Game Not Loading

- Clear browser cache and localStorage
- Check browser console for errors
- Ensure Node.js version is 18+

### Ball Not Animating

- Check that `pattern` array has 16 elements
- Verify `isPlaying` state is `true`
- Check browser console for errors

### Somnia SDK Errors

- SDK errors are non-fatal (game still works)
- Check RPC endpoint connectivity
- Wallet connection is optional

### Dark Mode Not Working

- Ensure Tailwind config has `darkMode: 'class'`
- Check that `dark` class is added to `<html>`
- Clear localStorage and refresh

