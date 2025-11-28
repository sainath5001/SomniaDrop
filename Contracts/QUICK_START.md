# Quick Start - Deploy in 3 Steps

## Method 1: .env File (Easiest - No source needed)

```bash
cd Contracts

# Step 1: Create .env file
touch .env

# Step 2: Edit .env and paste your private key (without 0x):
# PRIVATE_KEY=your_private_key_here

# Step 3: Run deploy script (Foundry reads .env automatically)
forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast
```

**What to paste in .env:**
```
PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

**No `source` command needed!** Foundry automatically reads `.env` files.

---

## Method 2: Using source (If you prefer)

```bash
cd Contracts

# Step 1: Create .env file
touch .env

# Step 2: Edit .env and paste (with export):
# export PRIVATE_KEY=your_private_key_here

# Step 3: Source the file
source .env

# Step 4: Run deploy script
forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast
```

**What to paste in .env (for source method):**
```
export PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

---

## Quick Copy-Paste Commands

### Method 1 (Recommended):
```bash
cd Contracts && touch .env && echo "PRIVATE_KEY=your_key_here" > .env && forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast
```

### Method 2 (With source):
```bash
cd Contracts && touch .env && echo "export PRIVATE_KEY=your_key_here" > .env && source .env && forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast
```

---

## Important Notes

- ✅ `.env` is already in `.gitignore` (safe to use)
- ✅ No `0x` prefix needed in private key
- ✅ Method 1 doesn't require `source` - Foundry reads it automatically
- ✅ Method 2 requires `export` keyword if using `source`

---

## Which Method to Use?

**Use Method 1** (without source) - it's simpler and Foundry handles it automatically!





