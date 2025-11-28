# Simple Deployment Guide

## Option 1: Try Foundry Again (with retry)

The RPC might be temporarily slow. Try:

```bash
cd Contracts

# Try with longer timeout
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://dream-rpc.somnia.network \
  --broadcast \
  --slow \
  --timeout 120
```

## Option 2: Use Remix IDE (Recommended if Foundry fails)

See `DEPLOY_REMIX.md` for detailed instructions.

## Option 3: Deploy Contracts Separately

If the script fails, deploy one at a time:

```bash
cd Contracts

# 1. Deploy MockERC20
PRIVATE_KEY=$(grep PRIVATE_KEY .env | cut -d '=' -f2)
forge create src/MockERC20.sol:MockERC20 \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key "$PRIVATE_KEY" \
  --constructor-args "Somnia Test Token" "STT" \
  --broadcast

# 2. Copy the token address, then deploy PlinkooGame
# Replace <TOKEN_ADDRESS> with the address from step 1
forge create src/PlinkooGame.sol:PlinkooGame \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key "$PRIVATE_KEY" \
  --constructor-args <TOKEN_ADDRESS> \
  --broadcast
```

## What You Need

1. ✅ Private key in `.env` file
2. ✅ STT tokens in wallet (check balance)
3. ✅ Network connection to RPC

## After Deployment

1. **Save the addresses** from deployment output
2. **Update Frontend/.env.local**:
   ```
   NEXT_PUBLIC_PLINKOO_GAME_ADDRESS=<your_game_address>
   NEXT_PUBLIC_TOKEN_ADDRESS=<your_token_address>
   ```
3. **Restart frontend**: `cd Frontend && npm run dev`

---

**Recommendation**: If Foundry keeps timing out, use Remix IDE - it's more reliable for deployment!

