# Official Somnia Deployment Method

This follows the official deployment guide from Somnia Network.

## Quick Deploy

Run the automated script:

```bash
cd Contracts
./deploy_official.sh
```

## Manual Deployment (Official Method)

### Step 1: Deploy MockERC20 Token

```bash
cd Contracts

# Get private key from .env
PRIVATE_KEY=$(grep PRIVATE_KEY .env | cut -d '=' -f2)

# Deploy MockERC20
forge create \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key "$PRIVATE_KEY" \
  src/MockERC20.sol:MockERC20 \
  --constructor-args "Somnia Test Token" "STT"
```

**Save the deployed address** from the output (look for "Deployed to: 0x...")

### Step 2: Deploy PlinkooGame

```bash
# Replace <TOKEN_ADDRESS> with the address from Step 1
forge create \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key "$PRIVATE_KEY" \
  src/PlinkooGame.sol:PlinkooGame \
  --constructor-args <TOKEN_ADDRESS>
```

**Save the deployed address** from the output.

## Expected Output

You should see something like:

```
[⠊] Compiling...
No files changed, compilation skipped
Deployer: 0xb6e4fa6ff2873480590c68D9Aa991e5BB14Dbf03
Deployed to: 0x46639fB6Ce28FceC29993Fc0201Cd5B6fb1b7b16
Transaction hash: 0xb3f8fe0443acae4efdb6d642bbadbb66797ae1dcde2c864d5c00a56302fb9a34
```

## After Deployment

1. **Copy the addresses** from the deployment output
2. **Update Frontend configuration**:

   Create or update `Frontend/.env.local`:
   ```env
   NEXT_PUBLIC_PLINKOO_GAME_ADDRESS=<your_game_address>
   NEXT_PUBLIC_TOKEN_ADDRESS=<your_token_address>
   NEXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network
   NEXT_PUBLIC_CHAIN_ID=50312
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

   Or update `Frontend/lib/config.ts` with the addresses.

## Troubleshooting

### RPC Connection Timeout

If you see "operation timed out" errors:
- The Somnia RPC endpoint may be temporarily unavailable
- Wait a few minutes and try again
- Check your internet connection
- Verify the RPC URL is correct: `https://dream-rpc.somnia.network`

### Insufficient Balance

Make sure you have STT tokens in your wallet:
- Join Somnia Telegram: https://t.me/+XHq0F0JXMyhmMzM0
- Request STT tokens from the faucet
- Check balance: `cast balance <YOUR_ADDRESS> --rpc-url https://dream-rpc.somnia.network`

### Private Key Issues

- Make sure `.env` file exists in the `Contracts` directory
- Format: `PRIVATE_KEY=your_key_without_0x_prefix`
- Never commit `.env` to git (it's in .gitignore)

## Reference

- Official Somnia Docs: https://somnia.network
- Get STT Tokens: Join Telegram https://t.me/+XHq0F0JXMyhmMzM0



