# Alternative Deployment Methods

The RPC endpoint is timing out. Here are alternative ways to deploy:

## Option 1: Use Remix IDE (Easiest - Recommended)

1. **Go to Remix IDE**: https://remix.ethereum.org

2. **Connect to Somnia Testnet**:
   - Click on "Deploy & Run" tab
   - Select "Injected Provider - MetaMask" as environment
   - Make sure MetaMask is connected to Somnia Testnet

3. **Add Somnia Testnet to MetaMask** (if not already):
   - Network Name: Somnia Testnet
   - RPC URL: https://dream-rpc.somnia.network
   - Chain ID: 50312
   - Currency Symbol: STT

4. **Deploy Contracts**:
   - Copy `src/MockERC20.sol` content to Remix
   - Compile the contract
   - Deploy with constructor args: `["Somnia Test Token", "STT"]`
   - Copy the deployed address
   
   - Copy `src/PlinkooGame.sol` content to Remix
   - Compile the contract
   - Deploy with constructor arg: `[<TOKEN_ADDRESS>]` (the MockERC20 address)
   - Copy the deployed address

5. **Update Frontend**:
   - Update `Frontend/.env.local` with the deployed addresses

## Option 2: Try Different RPC Endpoint

Update `foundry.toml`:

```toml
[rpc_endpoints]
somnia_testnet = "https://rpc-testnet.somnia.network"
```

Then deploy:
```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast --slow
```

## Option 3: Use Hardhat (If you have it installed)

Create a Hardhat config and deploy using Hardhat.

## Option 4: Wait and Retry

The RPC might be temporarily overloaded. Try again in a few minutes.

---

## Recommended: Use Remix IDE

Remix IDE is the easiest option and doesn't require RPC connectivity from your local machine.

