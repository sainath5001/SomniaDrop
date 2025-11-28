# Quick Start - Web2 Version

## ✅ Already Done

The project has been switched to Web2 version! You can now run it without smart contracts or wallet connection.

## 🚀 Run the Project

```bash
cd Frontend
npm run dev
```

Then open: **http://localhost:3000**

## 🎮 How to Play

1. **No wallet needed** - Just click "Start Playing"
2. **Deposit** - Add tokens to your game balance (stored locally)
3. **Play** - Set bet amount and click "Play Game"
4. **Withdraw** - Take tokens out of your game balance

## 📝 Features

- ✅ **No Smart Contracts** - Everything runs locally
- ✅ **No Wallet Required** - Play immediately
- ✅ **Local Storage** - Game data saved in browser
- ✅ **Somnia Data Streams** - Optional: Connect wallet to publish results
- ✅ **Same Game Logic** - Identical to smart contract version

## 🔄 Switch Back to Web3

If you want to use the Web3 version again:

```bash
cd Frontend
# Restore from backup
cp .backup-web3/* ./
# Or manually restore from .backup-web3/ directory
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
npm install
```

### TypeScript Errors
The Web2 hooks export `usePlinkooWeb2` and `useSomniaStreamsWeb2` - make sure imports match.

## 📦 What's Different

- **No Wagmi** - Removed wallet connection
- **No Viem** - No contract interactions (but still needed for SDS publishing)
- **Local State** - Uses localStorage instead of blockchain
- **Same UI** - All components work the same

Enjoy playing! 🎉



