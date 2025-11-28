# Deploy Contracts to Somnia Testnet

## Quick Deployment Steps

### 1. Verify Your Setup

Make sure you have:
- ✅ Private key in `.env` file
- ✅ STT tokens in your wallet (for gas fees)
- ✅ Foundry installed

### 2. Check Your Balance

```bash
cd Contracts
cast balance 0xB6937d744691065a9C4c50e15667eF1c46D9996b --rpc-url https://dream-rpc.somnia.network
```

You need at least 0.1 STT for deployment.

### 3. Deploy Contracts

Run the deployment script:

```bash
cd Contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast --slow
```

Or with explicit RPC URL:

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://dream-rpc.somnia.network \
  --broadcast \
  --slow
```

### 4. Save Contract Addresses

After successful deployment, you'll see:
- MockERC20 Token Address
- PlinkooGame Address

**IMPORTANT**: Copy these addresses and update your `.env.local` in the Frontend folder!

### 5. Update Frontend

After deployment, update `Frontend/.env.local`:

```env
NEXT_PUBLIC_PLINKOO_GAME_ADDRESS=<deployed_game_address>
NEXT_PUBLIC_TOKEN_ADDRESS=<deployed_token_address>
```

---

## Troubleshooting

### If deployment fails:

1. **Insufficient Balance**: Get more STT tokens from faucet
2. **RPC Error**: Try again, network might be busy
3. **Transaction Failed**: Check transaction hash on explorer

### Get Testnet Tokens

Join Somnia Telegram: https://t.me/+XHq0F0JXMyhmMzM0
Request STT tokens from the faucet.

