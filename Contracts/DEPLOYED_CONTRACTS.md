# ✅ Deployed Contract Addresses - Somnia Testnet

## Contract Addresses

### 🪙 MockERC20 Token
- **Address**: `0xe2B7C79f007BEEF62E214F958834A603083275C1`
- **Name**: Somnia Test Token
- **Symbol**: STT
- **Network**: Somnia Testnet
- **Chain ID**: 50312

### 🎮 PlinkooGame Contract
- **Address**: `0xE1510C00AE71C6fF3fbe8D689B59e239eF7a6A93`
- **Network**: Somnia Testnet
- **Chain ID**: 50312
- **Token Address**: `0xe2B7C79f007BEEF62E214F958834A603083275C1`

## Deployment Information

- **Deployer Address**: `0xB6937d744691065a9C4c50e15667eF1c46D9996b`
- **RPC URL**: `https://dream-rpc.somnia.network`
- **Network**: Somnia Testnet
- **Explorer**: Check SomniaScan (if available)

## ⚠️ Important Notes

1. **Transaction Status**: The deployment transactions were attempted but may have failed due to network/RPC issues. Please verify the contracts are deployed by checking:
   ```bash
   cast code 0xe2B7C79f007BEEF62E214F958834A603083275C1 --rpc-url https://dream-rpc.somnia.network
   cast code 0xE1510C00AE71C6fF3fbe8D689B59e239eF7a6A93 --rpc-url https://dream-rpc.somnia.network
   ```

2. **If contracts are not deployed**, the addresses above are deterministic and will be the same when you retry deployment.

3. **To verify deployment**, check the contracts:
   ```bash
   # Check token
   cast call 0xe2B7C79f007BEEF62E214F958834A603083275C1 "name()" --rpc-url https://dream-rpc.somnia.network
   
   # Check game contract
   cast call 0xE1510C00AE71C6fF3fbe8D689B59e239eF7a6A93 "token()" --rpc-url https://dream-rpc.somnia.network
   ```

## Next Steps

1. **Verify Contracts**: Check if contracts are actually deployed using the commands above
2. **Fund the Game Contract**: Transfer tokens to the PlinkooGame contract for payouts
3. **Frontend Integration**: Use these addresses in your frontend
4. **Data Streams**: Connect Somnia Data Streams SDK to stream `GamePlayed` events

## Frontend Configuration

```javascript
// Contract addresses for frontend
export const CONTRACTS = {
  PLINKOO_GAME: "0xE1510C00AE71C6fF3fbe8D689B59e239eF7a6A93",
  TOKEN: "0xe2B7C79f007BEEF62E214F958834A603083275C1",
  NETWORK: "Somnia Testnet",
  RPC_URL: "https://dream-rpc.somnia.network",
  CHAIN_ID: 50312
};
```

## Retry Deployment (if needed)

If contracts are not deployed, retry with:

```bash
cd Contracts

# Set token address to skip MockERC20 deployment
export TOKEN_ADDRESS=0xe2B7C79f007BEEF62E214F958834A603083275C1

# Deploy only PlinkooGame
forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast --slow
```

Or deploy separately:

```bash
# Deploy MockERC20
forge create src/MockERC20.sol:MockERC20 \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY \
  --constructor-args "Somnia Test Token" "STT" \
  --broadcast

# Deploy PlinkooGame (replace TOKEN_ADDRESS with deployed token)
forge create src/PlinkooGame.sol:PlinkooGame \
  --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY \
  --constructor-args <TOKEN_ADDRESS> \
  --broadcast
```

---

**Last Updated**: Based on latest deployment attempt
**Status**: Please verify contracts are deployed on-chain

