# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` file:

```bash
NEXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network
NEXT_PUBLIC_PLINKOO_GAME_ADDRESS=0x14A1eFd6C4C737075C89EEB46Aa4f6144A4AF6f2
NEXT_PUBLIC_TOKEN_ADDRESS=0xa1F4D43749ABEdb6a835aF9184CD0A9c194d4C8a
NEXT_PUBLIC_CHAIN_ID=50312
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

**Get WalletConnect Project ID:**
1. Go to https://cloud.walletconnect.com
2. Create a new project (or use existing)
3. Copy the Project ID
4. Paste it in `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 📝 Next Steps

1. **Deploy Contracts** (if not already deployed)
   - See `../Contracts/README.md` for deployment instructions
   - Update contract addresses in `.env.local` after deployment

2. **Get Testnet Tokens**
   - Join Somnia Telegram: https://t.me/+XHq0F0JXMyhmMzM0
   - Request STT tokens from faucet

3. **Connect Wallet**
   - Click "Connect Wallet" on homepage
   - Select your wallet (MetaMask recommended)
   - Switch to Somnia Testnet

4. **Play Game**
   - Deposit tokens to game balance
   - Set bet amount
   - Click "Play Game"
   - Watch the ball drop!

## 🎮 Features

- ✅ Wallet connection (RainbowKit)
- ✅ Token deposit/withdraw
- ✅ Play Plinkoo game
- ✅ Real-time game statistics
- ✅ Game history
- ✅ Somnia Data Streams integration
- ✅ Canvas-based physics simulation

## 🐛 Troubleshooting

### "WalletConnect Project ID" Error
- Make sure you've set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local`
- Get a free Project ID from https://cloud.walletconnect.com

### "Contract not found" Error
- Verify contract addresses in `.env.local`
- Make sure contracts are deployed to Somnia Testnet
- Check RPC URL is correct

### Transaction Failures
- Ensure you have STT tokens in your wallet
- Check that you've approved the token contract
- Verify you have enough game balance

### RPC Connection Issues
- Check your internet connection
- Try a different RPC endpoint
- Wait a few minutes and retry

## 📚 Documentation

- [Full README](./README.md)
- [Somnia Data Streams Docs](https://docs.somnia.network/somnia-data-streams)
- [Viem Documentation](https://viem.sh)
- [Wagmi Documentation](https://wagmi.sh)

---

Happy Gaming! 🎉





