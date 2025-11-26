# Deployment Status

## Current Status: ⚠️ RPC Connection Issues

The deployment script ran successfully in simulation mode and calculated the contract addresses, but broadcasting failed due to RPC connection/TLS issues.

## Calculated Contract Addresses

These addresses are **deterministic** and will be the same when deployment succeeds:

### MockERC20 Token
- **Address**: `0xa1F4D43749ABEdb6a835aF9184CD0A9c194d4C8a`
- **Name**: Somnia Test Token
- **Symbol**: STT
- **Status**: ❓ Unknown (RPC connection failed during broadcast)

### PlinkooGame Contract
- **Address**: `0x14A1eFd6C4C737075C89EEB46Aa4f6144A4AF6f2`
- **Status**: ❓ Unknown (RPC connection failed during broadcast)

## Error Details

```
Error: could not instantiate forked environment with provider dream-rpc.somnia.network
- failed to get latest block number
- error sending request for url (https://dream-rpc.somnia.network/)
- connection error
- peer closed connection without sending TLS close_notify
```

## Next Steps

1. **Check if contracts are already deployed:**
   ```bash
   cast code 0xa1F4D43749ABEdb6a835aF9184CD0A9c194d4C8a --rpc-url https://dream-rpc.somnia.network
   cast code 0x14A1eFd6C4C737075C89EEB46Aa4f6144A4AF6f2 --rpc-url https://dream-rpc.somnia.network
   ```

2. **Retry deployment when RPC is stable:**
   ```bash
   cd Contracts
   export $(grep PRIVATE_KEY .env | xargs)
   forge script script/Deploy.s.sol:DeployScript --rpc-url https://dream-rpc.somnia.network --broadcast --slow
   ```

3. **Alternative: Use Remix IDE or Hardhat** if Foundry continues to have RPC issues

## Network Information

- **Network**: Somnia Testnet
- **RPC URL**: `https://dream-rpc.somnia.network`
- **Chain ID**: 50312
- **Deployer**: `0xB6937d744691065a9C4c50e15667eF1c46D9996b`

---

**Note**: The addresses are calculated based on deployer address and nonce, so they will remain the same when deployment succeeds.


