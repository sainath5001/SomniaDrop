# Deployment Guide - Plinkoo Game

## Quick Deployment to Somnia Testnet

### Prerequisites

1. **Install Foundry** (if not already installed):
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Get Testnet Tokens**:
   - Join Somnia Telegram: https://t.me/+XHq0F0JXMyhmMzM0
   - Request testnet tokens (STT) from faucet

3. **Set Environment Variables** (Choose ONE method):

   **Method 1: Using .env file (RECOMMENDED - More Secure)**
   
   Create a `.env` file in the `Contracts` directory:
   ```bash
   cd Contracts
   # Create .env file
   cat > .env << EOF
   PRIVATE_KEY=your_private_key_here_without_0x
   # Optional: if you have an existing ERC20 token
   TOKEN_ADDRESS=0x...
   EOF
   ```
   
   Or manually create `.env` file with:
   ```
   PRIVATE_KEY=your_private_key_here_without_0x
   TOKEN_ADDRESS=0x...  # Optional
   ```
   
   **Important**: 
   - Never commit `.env` to git (it's already in .gitignore)
   - Don't include `0x` prefix in PRIVATE_KEY
   - Foundry automatically reads `.env` files
   
   **Method 2: Export in Terminal (Less Secure)**
   ```bash
   export PRIVATE_KEY=your_private_key_here
   export TOKEN_ADDRESS=0x...  # Optional
   ```
   
   ⚠️ **Warning**: Using `export` saves the key in terminal history. Use `.env` file instead!

### Deployment Steps

#### Option 1: Using Foundry Script (Recommended)

```bash
cd Contracts

# If using .env file (recommended), just run:
forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast

# If using export method, make sure you've exported PRIVATE_KEY first:
# export PRIVATE_KEY=your_key
# forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast
```

#### Option 2: Using forge create

```bash
# First deploy MockERC20 (if needed)
forge create --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY \
  src/MockERC20.sol:MockERC20 \
  --constructor-args "Somnia Test Token" "STT"

# Then deploy PlinkooGame
forge create --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY \
  src/PlinkooGame.sol:PlinkooGame \
  --constructor-args <TOKEN_ADDRESS>
```

### Post-Deployment

1. **Save Contract Addresses**:
   - PlinkooGame: `0x...`
   - Token (if MockERC20): `0x...`

2. **Fund the Contract**:
   - The contract needs tokens to pay out winnings
   - Transfer tokens to the contract address for the house balance

3. **Verify Contract** (if SomniaScan supports it):
   ```bash
   forge verify-contract <CONTRACT_ADDRESS> \
     src/PlinkooGame.sol:PlinkooGame \
     --chain-id <SOMNIA_CHAIN_ID> \
     --etherscan-api-key $SOMNIA_API_KEY
   ```

### Testing the Deployment

```bash
# Check contract owner
cast call <GAME_ADDRESS> "owner()" --rpc-url https://dream-rpc.somnia.network

# Check token address
cast call <GAME_ADDRESS> "token()" --rpc-url https://dream-rpc.somnia.network

# Check if paused
cast call <GAME_ADDRESS> "paused()" --rpc-url https://dream-rpc.somnia.network
```

### Integration with Frontend

Use these addresses in your frontend:
- **Contract Address**: `<GAME_ADDRESS>`
- **Token Address**: `<TOKEN_ADDRESS>`
- **Network**: Somnia Testnet
- **RPC URL**: `https://dream-rpc.somnia.network`
- **Chain ID**: Check Somnia docs

### Troubleshooting

1. **Insufficient Gas**: Ensure you have enough STT tokens
2. **Transaction Failed**: Check RPC URL and network
3. **Contract Verification**: May not be available yet on SomniaScan

---

For more details, see [README.md](./README.md)

