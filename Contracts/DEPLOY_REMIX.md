# Deploy Using Remix IDE (Alternative Method)

Since Foundry is having RPC timeout issues, you can deploy using Remix IDE which is more reliable.

## Steps to Deploy via Remix IDE

### 1. Open Remix IDE
Go to: https://remix.ethereum.org

### 2. Create Files in Remix

#### File 1: MockERC20.sol
Copy the content from `Contracts/src/MockERC20.sol`

#### File 2: PlinkooGame.sol
Copy the content from `Contracts/src/PlinkooGame.sol`

**Important**: You'll need to install OpenZeppelin contracts in Remix:
- Go to "File Explorer" → "contracts" folder
- Right-click → "New File" → Name it `IERC20.sol`
- Copy the IERC20 interface from OpenZeppelin
- Or use Remix's import: `import "@openzeppelin/contracts/token/ERC20/IERC20.sol";`

### 3. Compile Contracts

1. Go to "Solidity Compiler" tab
2. Select compiler version: `0.8.28`
3. Click "Compile MockERC20.sol"
4. Click "Compile PlinkooGame.sol"

### 4. Deploy Contracts

1. Go to "Deploy & Run Transactions" tab
2. Select "Injected Provider - MetaMask" (or your wallet)
3. Make sure you're on **Somnia Testnet** (Chain ID: 50312)
4. Add custom network if needed:
   - Network Name: Somnia Testnet
   - RPC URL: https://dream-rpc.somnia.network
   - Chain ID: 50312
   - Currency Symbol: STT

#### Deploy MockERC20:
1. Select "MockERC20" contract
2. Constructor parameters:
   - `_name`: "Somnia Test Token"
   - `_symbol`: "STT"
3. Click "Deploy"
4. **Copy the deployed address!**

#### Deploy PlinkooGame:
1. Select "PlinkooGame" contract
2. Constructor parameter:
   - `_token`: (paste the MockERC20 address from above)
3. Click "Deploy"
4. **Copy the deployed address!**

### 5. Update Frontend

Update `Frontend/.env.local`:
```env
NEXT_PUBLIC_PLINKOO_GAME_ADDRESS=<PlinkooGame_address_from_Remix>
NEXT_PUBLIC_TOKEN_ADDRESS=<MockERC20_address_from_Remix>
```

### 6. Verify Contracts (Optional)

If SomniaScan supports verification:
- Go to SomniaScan
- Find your contract
- Verify using the source code

---

## Quick Remix Setup

1. **Install OpenZeppelin in Remix**:
   - Use GitHub import: `github.com/OpenZeppelin/openzeppelin-contracts`
   - Or copy the interfaces you need

2. **Network Setup**:
   - Add Somnia Testnet to MetaMask:
     - Chain ID: 50312
     - RPC: https://dream-rpc.somnia.network
     - Symbol: STT

3. **Get Testnet Tokens**:
   - Join Telegram: https://t.me/+XHq0F0JXMyhmMzM0
   - Request STT tokens

---

This method is more reliable when Foundry has RPC issues!

