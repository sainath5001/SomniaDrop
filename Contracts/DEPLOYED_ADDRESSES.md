# Deployed Contract Addresses

## ⚠️ Deployment Status

The deployment transaction failed. The addresses shown below are the **calculated addresses** that would be used if deployment succeeds, but the contracts are **NOT currently deployed** on Somnia Testnet.

## Calculated Addresses (Not Deployed)

### MockERC20 Token
- **Address**: `0xeB1698BaA4755eFc7034F784Ec5B59B30955c6A3`
- **Name**: Somnia Test Token
- **Symbol**: STT
- **Status**: ❌ Not Deployed (Transaction Failed)

### PlinkooGame Contract
- **Address**: `0xfEb316f4632fd2B9D7C7861c58B89A1Ed74323BF`
- **Status**: ❌ Not Deployed (Transaction Failed)

## Deployment Information

- **Network**: Somnia Testnet
- **RPC URL**: `https://dream-rpc.somnia.network`
- **Chain ID**: 50312
- **Deployer**: `0xB6937d744691065a9C4c50e15667eF1c46D9996b`
- **Failed Transaction**: `0x12f31a2441d444c82c085ec54563d5e13476b1adff436bf1aa52d3ccdb4b6657`

## Issue

The deployment transaction failed with status 0. Possible reasons:
1. Insufficient gas
2. Contract bytecode issue
3. Network/RPC connectivity issue
4. Nonce mismatch

## Next Steps

1. Check your account balance (you have ~4.84 STT tokens)
2. Try deploying again with explicit gas settings
3. Check if the RPC endpoint is stable
4. Verify the contract compiles correctly: `forge build`

## To Retry Deployment

```bash
cd Contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast --slow
```

Or deploy separately:
```bash
# Deploy MockERC20
forge create src/MockERC20.sol:MockERC20 \
  --rpc-url somnia_testnet \
  --private-key $(grep PRIVATE_KEY .env | cut -d '=' -f2) \
  --constructor-args "Somnia Test Token" "STT" \
  --broadcast

# Then deploy PlinkooGame with the token address
forge create src/PlinkooGame.sol:PlinkooGame \
  --rpc-url somnia_testnet \
  --private-key $(grep PRIVATE_KEY .env | cut -d '=' -f2) \
  --constructor-args <TOKEN_ADDRESS> \
  --broadcast
```

---

**Note**: These addresses are deterministic based on deployer address and nonce, so they will be the same when deployment succeeds.





