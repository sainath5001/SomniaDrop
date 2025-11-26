// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PlinkooGame
 * @dev A Plinkoo game contract where players bet tokens and receive payouts based on outcomes
 * @notice This contract implements a Plinkoo game with 16 drops resulting in outcomes 0-16
 *         with different multipliers for each outcome slot
 */
contract PlinkooGame is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ Constants ============

    /// @dev Number of drops in the Plinkoo game
    uint8 public constant NUM_DROPS = 16;

    /// @dev Maximum outcome value (NUM_DROPS)
    uint8 public constant MAX_OUTCOME = 16;

    /// @dev Minimum bet amount (1e18 = 1 token)
    uint256 public constant MIN_BET = 1e18;

    /// @dev House edge percentage (2% = 200 basis points)
    uint256 public constant HOUSE_EDGE_BPS = 200;

    // ============ State Variables ============

    /// @dev The ERC20 token used for betting
    IERC20 public immutable token;

    /// @dev Game counter
    uint256 public gameCounter;

    /// @dev Mapping from game ID to game data
    mapping(uint256 => GameData) public games;

    /// @dev Mapping from player address to array of game IDs
    mapping(address => uint256[]) public playerGames;

    /// @dev Mapping from player address to their balance in the contract
    mapping(address => uint256) public playerBalances;

    /// @dev Total amount of tokens in the contract
    uint256 public totalContractBalance;

    /// @dev Paused state
    bool public paused;

    // ============ Structs ============

    struct GameData {
        address player;
        uint256 betAmount;
        uint8 outcome;
        uint256 multiplier; // Multiplier in basis points (10000 = 1x)
        uint256 winnings;
        uint256[] pattern; // Array of 0s (left) and 1s (right) for the 16 drops
        uint256 timestamp;
        bool claimed;
    }

    // ============ Events ============
    // Events are optimized for Somnia Data Streams integration
    // These events will be indexed and streamed in real-time

    event GamePlayed(
        address indexed player,
        uint256 indexed gameId,
        uint256 betAmount,
        uint8 outcome,
        uint256 multiplier,
        uint256 winnings,
        uint256[] pattern,
        uint256 timestamp
    );

    event BetPlaced(address indexed player, uint256 indexed gameId, uint256 amount);

    event WinningsClaimed(address indexed player, uint256 amount);

    event Deposit(address indexed player, uint256 amount);

    event Withdrawal(address indexed player, uint256 amount);

    event Paused(address account);

    event Unpaused(address account);

    // ============ Modifiers ============

    modifier whenNotPaused() {
        require(!paused, "PlinkooGame: contract is paused");
        _;
    }

    // ============ Constructor ============

    /**
     * @dev Constructor sets the token address
     * @param _token Address of the ERC20 token to use for betting
     */
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "PlinkooGame: invalid token address");
        token = IERC20(_token);
    }

    // ============ Public Functions ============

    /**
     * @dev Main game function - plays a Plinkoo game
     * @param betAmount Amount of tokens to bet
     * @return gameId The ID of the game played
     * @return outcome The outcome slot (0-16)
     * @return multiplier The multiplier applied (in basis points)
     * @return pattern The array of left/right decisions (0=left, 1=right)
     * @return winnings The amount won (0 if lost)
     */
    function playGame(uint256 betAmount)
        external
        nonReentrant
        whenNotPaused
        returns (uint256 gameId, uint8 outcome, uint256 multiplier, uint256[] memory pattern, uint256 winnings)
    {
        require(betAmount >= MIN_BET, "PlinkooGame: bet amount too low");
        require(betAmount <= playerBalances[msg.sender], "PlinkooGame: insufficient balance");

        // Deduct bet from player balance
        playerBalances[msg.sender] -= betAmount;
        totalContractBalance -= betAmount;

        // Increment game counter
        gameCounter++;
        gameId = gameCounter;

        // Generate random pattern and calculate outcome
        pattern = generatePattern();
        outcome = calculateOutcome(pattern);

        // Get multiplier for this outcome
        multiplier = getMultiplier(outcome);

        // Calculate winnings
        winnings = calculateWinnings(betAmount, outcome);

        // If player wins, add to their balance
        if (winnings > 0) {
            playerBalances[msg.sender] += winnings;
            totalContractBalance += winnings;
        }

        // Store game data
        games[gameId] = GameData({
            player: msg.sender,
            betAmount: betAmount,
            outcome: outcome,
            multiplier: multiplier,
            winnings: winnings,
            pattern: pattern,
            timestamp: block.timestamp,
            claimed: false
        });

        // Add to player's game history
        playerGames[msg.sender].push(gameId);

        emit BetPlaced(msg.sender, gameId, betAmount);
        emit GamePlayed(msg.sender, gameId, betAmount, outcome, multiplier, winnings, pattern, block.timestamp);

        return (gameId, outcome, multiplier, pattern, winnings);
    }

    /**
     * @dev Deposit tokens into the contract to play games
     * @param amount Amount of tokens to deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "PlinkooGame: amount must be greater than 0");

        token.safeTransferFrom(msg.sender, address(this), amount);
        playerBalances[msg.sender] += amount;
        totalContractBalance += amount;

        emit Deposit(msg.sender, amount);
    }

    /**
     * @dev Withdraw tokens from the contract
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "PlinkooGame: amount must be greater than 0");
        require(amount <= playerBalances[msg.sender], "PlinkooGame: insufficient balance");

        playerBalances[msg.sender] -= amount;
        totalContractBalance -= amount;

        token.safeTransfer(msg.sender, amount);

        emit Withdrawal(msg.sender, amount);
    }

    /**
     * @dev Claim winnings (if any) - this is a convenience function
     * @notice Withdraws all available balance
     */
    function claimWinnings() external nonReentrant {
        uint256 balance = playerBalances[msg.sender];
        require(balance > 0, "PlinkooGame: no winnings to claim");

        playerBalances[msg.sender] = 0;
        totalContractBalance -= balance;

        token.safeTransfer(msg.sender, balance);

        emit WinningsClaimed(msg.sender, balance);
    }

    // ============ View Functions ============

    /**
     * @dev Calculate winnings for a given bet amount and outcome
     * @param betAmount The amount bet
     * @param outcome The outcome slot (0-16)
     * @return winnings The amount won (0 if lost)
     */
    function calculateWinnings(uint256 betAmount, uint8 outcome) public pure returns (uint256) {
        require(outcome <= MAX_OUTCOME, "PlinkooGame: invalid outcome");

        uint256 multiplier = getMultiplier(outcome);

        // Calculate winnings: betAmount * multiplier / 10000
        // If multiplier is 0, player loses
        if (multiplier == 0) {
            return 0;
        }

        return (betAmount * multiplier) / 10000;
    }

    /**
     * @dev Get multiplier for a given outcome
     * @param outcome The outcome slot (0-16)
     * @return multiplier The multiplier in basis points (10000 = 1x)
     */
    function getMultiplier(uint8 outcome) public pure returns (uint256) {
        require(outcome <= MAX_OUTCOME, "PlinkooGame: invalid outcome");

        // Multipliers in basis points (10000 = 1x)
        if (outcome == 0 || outcome == 16) {
            return 160000; // 16x
        } else if (outcome == 1 || outcome == 15) {
            return 90000; // 9x
        } else if (outcome == 2 || outcome == 14) {
            return 20000; // 2x
        } else if (outcome == 3 || outcome == 13) {
            return 14000; // 1.4x
        } else if (outcome == 4 || outcome == 12) {
            return 14000; // 1.4x
        } else if (outcome == 5 || outcome == 11) {
            return 12000; // 1.2x
        } else if (outcome == 6 || outcome == 10) {
            return 11000; // 1.1x
        } else if (outcome == 7 || outcome == 9) {
            return 10000; // 1x
        } else if (outcome == 8) {
            return 5000; // 0.5x
        }

        return 0;
    }

    /**
     * @dev Get game history for a player
     * @param player Address of the player
     * @return gameIds Array of game IDs played by the player
     * @return gameData Array of game data structs
     */
    function getGameHistory(address player)
        external
        view
        returns (uint256[] memory gameIds, GameData[] memory gameData)
    {
        gameIds = playerGames[player];
        gameData = new GameData[](gameIds.length);

        for (uint256 i = 0; i < gameIds.length; i++) {
            gameData[i] = games[gameIds[i]];
        }

        return (gameIds, gameData);
    }

    /**
     * @dev Get player balance
     * @param player Address of the player
     * @return balance The player's balance in the contract
     */
    function getPlayerBalance(address player) external view returns (uint256) {
        return playerBalances[player];
    }

    /**
     * @dev Get game data by ID
     * @param gameId The game ID
     * @return game The game data struct
     */
    function getGame(uint256 gameId) external view returns (GameData memory) {
        return games[gameId];
    }

    /**
     * @dev Get recent games (useful for Data Streams integration)
     * @param limit Maximum number of recent games to return
     * @return gameIds Array of recent game IDs
     * @return gameData Array of recent game data structs
     */
    function getRecentGames(uint256 limit)
        external
        view
        returns (uint256[] memory gameIds, GameData[] memory gameData)
    {
        require(limit > 0, "PlinkooGame: limit must be greater than 0");

        uint256 totalGames = gameCounter;
        uint256 count = limit < totalGames ? limit : totalGames;

        gameIds = new uint256[](count);
        gameData = new GameData[](count);

        uint256 startId = totalGames > count ? totalGames - count + 1 : 1;

        for (uint256 i = 0; i < count; i++) {
            uint256 gameId = startId + i;
            gameIds[i] = gameId;
            gameData[i] = games[gameId];
        }

        return (gameIds, gameData);
    }

    /**
     * @dev Get total statistics (useful for Data Streams dashboard)
     * @return gamesCount Total number of games played
     * @return contractBalance Total tokens in contract
     * @return playersCount Number of unique players
     */
    function getStatistics()
        external
        view
        returns (uint256 gamesCount, uint256 contractBalance, uint256 playersCount)
    {
        // Note: playersCount would require additional tracking for accurate count
        // This is a simplified version
        return (gameCounter, totalContractBalance, 0);
    }

    // ============ Internal Functions ============

    /**
     * @dev Generate a random pattern of 16 left/right decisions
     * @return pattern Array of 0s (left) and 1s (right)
     * @notice Uses block-based randomness with multiple entropy sources.
     *         For production/mainnet, this should be upgraded to Chainlink VRF v2
     *         for verifiable randomness. The contract structure supports easy VRF integration.
     *
     *         VRF Upgrade Path:
     *         1. Import Chainlink VRF contracts
     *         2. Add VRF request/fulfillment logic
     *         3. Store pending game requests
     *         4. Fulfill randomness in callback and execute game
     */
    function generatePattern() internal view returns (uint256[] memory) {
        uint256[] memory pattern = new uint256[](NUM_DROPS);

        // Use a combination of block properties for randomness
        // Multiple entropy sources: timestamp, prevrandao (post-merge randomness),
        // block number, sender, and game counter
        // This provides reasonable randomness for testnet/hackathon purposes
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    block.number,
                    msg.sender,
                    gameCounter,
                    blockhash(block.number - 1)
                )
            )
        );

        for (uint8 i = 0; i < NUM_DROPS; i++) {
            // Generate random 0 or 1 for each drop
            pattern[i] = seed % 2;
            // Use a new seed for next iteration to ensure independence
            seed = uint256(keccak256(abi.encodePacked(seed, i, block.prevrandao)));
        }

        return pattern;
    }

    /**
     * @dev Calculate outcome from pattern (count number of rights)
     * @param pattern Array of 0s (left) and 1s (right)
     * @return outcome The final slot (0-16)
     */
    function calculateOutcome(uint256[] memory pattern) internal pure returns (uint8) {
        uint8 outcome = 0;

        for (uint8 i = 0; i < pattern.length; i++) {
            if (pattern[i] == 1) {
                outcome++;
            }
        }

        return outcome;
    }

    // ============ Owner Functions ============

    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    /**
     * @dev Emergency withdraw - owner can withdraw contract balance
     * @notice This should only be used in emergency situations
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "PlinkooGame: no balance to withdraw");

        token.safeTransfer(owner(), balance);
    }
}
