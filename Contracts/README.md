# Plinkoo Game Smart Contract

A production-ready Plinkoo game smart contract built with Foundry for the Somnia Data Streams Hackathon. This contract implements a fully on-chain Plinkoo game with 16 drops, multiple outcome slots, and dynamic multipliers.

## 🎮 Game Mechanics

- **16 Drops**: Each game consists of 16 random left/right decisions
- **Outcomes**: 0-16 (based on number of right turns)
- **Multipliers**:
  - 0/16: 16x
  - 1/15: 9x
  - 2/14: 2x
  - 3/13: 1.4x
  - 4/12: 1.4x
  - 5/11: 1.2x
  - 6/10: 1.1x
  - 7/9: 1x
  - 8: 0.5x

## 🏗️ Architecture

### Contract Features

- **ERC20 Token Integration**: Accepts any ERC20 token for betting
- **Secure**: Uses OpenZeppelin's ReentrancyGuard and SafeERC20
- **Pausable**: Owner can pause/unpause the contract
- **Game History**: Tracks all games per player
- **Balance Management**: Players deposit/withdraw tokens
- **Events**: Optimized for Somnia Data Streams integration

### Key Functions

- `playGame(uint256 betAmount)`: Play a game with specified bet amount
- `deposit(uint256 amount)`: Deposit tokens to play
- `withdraw(uint256 amount)`: Withdraw tokens from contract
- `claimWinnings()`: Claim all available winnings
- `getGameHistory(address player)`: Get player's game history
- `getPlayerBalance(address player)`: Get player's balance
- `getRecentGames(uint256 limit)`: Get recent games (for Data Streams)
- `getStatistics()`: Get contract statistics

## 📋 Requirements

- Foundry (forge, cast, anvil)
- Solidity 0.8.28+
- OpenZeppelin Contracts

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Run tests with gas report
forge test --gas-report
```

### Deployment

1. Set environment variables:
```bash
export PRIVATE_KEY=your_private_key
export TOKEN_ADDRESS=0x...  # Optional: existing ERC20 token address
```

2. Deploy to Somnia Testnet:
```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast
```

3. Or deploy using direct RPC URL:
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://dream-rpc.somnia.network \
  --broadcast \
  --verify
```

### Using forge create (Alternative)

```bash
forge create --rpc-url https://dream-rpc.somnia.network \
  --private-key $PRIVATE_KEY \
  src/PlinkooGame.sol:PlinkooGame \
  --constructor-args <TOKEN_ADDRESS>
```

## 🧪 Testing

Comprehensive test suite included:

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test testPlayGame

# Run with coverage
forge coverage
```

### Test Coverage

- ✅ Deposit/Withdraw functionality
- ✅ Game play mechanics
- ✅ Multiplier calculations
- ✅ Game history tracking
- ✅ Pause/Unpause functionality
- ✅ Edge cases and fuzz testing
- ✅ Reentrancy protection
- ✅ Access control

## 📡 Somnia Data Streams Integration

This contract is optimized for Somnia Data Streams SDK integration. Key events that can be streamed:

### Events for Data Streams

1. **GamePlayed**: Emitted on every game
   - `player`: Address of player
   - `gameId`: Unique game identifier
   - `betAmount`: Amount bet
   - `outcome`: Outcome slot (0-16)
   - `multiplier`: Multiplier applied
   - `winnings`: Amount won
   - `pattern`: Array of 16 left/right decisions
   - `timestamp`: Block timestamp

2. **BetPlaced**: Emitted when bet is placed
   - `player`: Address of player
   - `gameId`: Game identifier
   - `amount`: Bet amount

3. **Deposit/Withdrawal**: Track player balance changes
4. **WinningsClaimed**: Track when players claim winnings

### Example Data Streams Integration

```typescript
import { SDK } from "@somnia-chain/streams";

const sdk = new SDK({
  public: getPublicClient(),
  wallet: getWalletClient(),
});

// Listen to GamePlayed events
const gameSchema = `address player, uint256 gameId, uint256 betAmount, uint8 outcome, uint256 multiplier, uint256 winnings, uint256[] pattern, uint256 timestamp`;

// Stream game data in real-time
const stream = await sdk.streams.subscribe({
  schemaId: gameSchemaId,
  filter: { contractAddress: gameContractAddress }
});
```

## 🔒 Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **SafeERC20**: Safe token transfers
- **Access Control**: Owner-only functions for critical operations
- **Input Validation**: All inputs are validated
- **Pausable**: Emergency pause functionality

## 🎲 Randomness

Currently uses block-based randomness (acceptable for testnet/hackathon):
- `block.timestamp`
- `block.prevrandao` (post-merge randomness)
- `block.number`
- `msg.sender`
- `gameCounter`
- `blockhash(block.number - 1)`

### VRF Upgrade Path

For production/mainnet, upgrade to Chainlink VRF v2:

1. Import Chainlink VRF contracts
2. Add VRF coordinator and subscription
3. Request randomness before game execution
4. Fulfill randomness in callback
5. Execute game with verified random number

The contract structure supports easy VRF integration without major refactoring.

## 📊 Contract Statistics

Use `getStatistics()` to get:
- Total games played
- Total contract balance
- Player count (requires additional tracking)

## 🔧 Configuration

### foundry.toml

```toml
[rpc_endpoints]
somnia_testnet = "https://dream-rpc.somnia.network"

[etherscan]
somnia_testnet = { key = "${SOMNIA_API_KEY}", url = "https://dream-rpc.somnia.network" }
```

## 📝 Contract Addresses

After deployment, save these addresses:

- **PlinkooGame**: `0x...`
- **Token**: `0x...` (if MockERC20 deployed)

## 🐛 Troubleshooting

### Common Issues

1. **Insufficient balance**: Ensure player has deposited tokens
2. **Bet too low**: Minimum bet is 1 token (1e18)
3. **Contract paused**: Owner may have paused the contract
4. **Insufficient gas**: Ensure enough gas for transaction

## 📚 Documentation

- [Somnia Network Docs](https://docs.somnia.network)
- [Somnia Data Streams](https://docs.somnia.network/somnia-data-streams)
- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

## 🤝 Contributing

This is a hackathon project. For improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🎯 Hackathon Submission

This contract is part of the Somnia Data Streams Mini Hackathon submission.

### Submission Checklist

- ✅ Public GitHub Repo with README
- ✅ Working Smart Contract on Somnia Testnet
- ✅ Somnia Data Streams SDK Integration (Frontend)
- ✅ Demo Video (3-5 min)

### Integration Points

1. **Smart Contract**: This repository
2. **Frontend**: See Frontend directory
3. **Data Streams**: Real-time game data streaming
4. **Demo**: Video walkthrough

---

Built with ❤️ for the Somnia Data Streams Hackathon
