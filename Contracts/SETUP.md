# Quick Setup Guide

## Setting Up Environment Variables

You have **two options** for setting your `PRIVATE_KEY`. We **strongly recommend using a `.env` file** for security.

### ✅ Option 1: Using .env File (RECOMMENDED)

**Why use .env?**
- ✅ More secure (not in terminal history)
- ✅ Easy to manage multiple keys
- ✅ Already in .gitignore (won't be committed)
- ✅ Foundry reads it automatically

**Steps:**

1. Navigate to Contracts directory:
   ```bash
   cd Contracts
   ```

2. Create a `.env` file:
   ```bash
   nano .env
   # or
   vim .env
   # or use any text editor
   ```

3. Add your private key (without `0x` prefix):
   ```
   PRIVATE_KEY=your_private_key_here_without_0x
   TOKEN_ADDRESS=0x...  # Optional: only if you have existing token
   ```

4. Save the file (Ctrl+X, then Y, then Enter for nano)

5. Deploy:
   ```bash
   forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast
   ```

**Example .env file:**
```
PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
TOKEN_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb  # Optional
```

### ⚠️ Option 2: Export in Terminal (Less Secure)

**Why NOT recommended:**
- ❌ Private key saved in terminal history
- ❌ Visible in process list
- ❌ Easy to accidentally expose

**Steps:**

1. Export the variable:
   ```bash
   export PRIVATE_KEY=your_private_key_here
   ```

2. Deploy:
   ```bash
   cd Contracts
   forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast
   ```

**Note:** The variable only lasts for the current terminal session.

---

## Getting Your Private Key from MetaMask

1. Open MetaMask
2. Click the three dots (⋮) next to your account
3. Select "Account Details"
4. Click "Show Private Key"
5. Enter your password
6. Copy the private key (without `0x` prefix)

**⚠️ SECURITY WARNING:**
- Never share your private key
- Never commit it to git
- Never paste it in public places
- Use a dedicated wallet for testing

---

## Quick Start Commands

```bash
# Navigate to Contracts
cd Contracts

# Create .env file (recommended)
echo "PRIVATE_KEY=your_key_here" > .env

# Deploy
forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast
```

---

## Troubleshooting

**Error: "PRIVATE_KEY not found"**
- Make sure `.env` file exists in `Contracts/` directory
- Check that PRIVATE_KEY is on a single line
- Remove any quotes around the key
- Make sure there's no `0x` prefix

**Error: "Invalid private key"**
- Private key should be 64 hex characters (without 0x)
- Check for extra spaces or newlines
- Make sure you copied the full key

**Error: "Insufficient funds"**
- Get testnet tokens from Somnia faucet
- Join Telegram: https://t.me/+XHq0F0JXMyhmMzM0

---

For full deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)





