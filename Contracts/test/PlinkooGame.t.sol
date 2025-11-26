// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {PlinkooGame} from "../src/PlinkooGame.sol";
import {MockERC20} from "../src/MockERC20.sol";

contract PlinkooGameTest is Test {
    PlinkooGame public game;
    MockERC20 public token;
    
    address public owner = address(1);
    address public player1 = address(2);
    address public player2 = address(3);
    
    uint256 public constant INITIAL_BALANCE = 1000 * 1e18;
    
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
    
    function setUp() public {
        // Deploy token
        token = new MockERC20("Test Token", "TEST");
        
        // Deploy game contract
        vm.prank(owner);
        game = new PlinkooGame(address(token));
        
        // Mint tokens to players
        token.mint(player1, INITIAL_BALANCE);
        token.mint(player2, INITIAL_BALANCE);
        
        // Approve game contract
        vm.prank(player1);
        token.approve(address(game), type(uint256).max);
        
        vm.prank(player2);
        token.approve(address(game), type(uint256).max);
    }
    
    // ============ Deposit Tests ============
    
    function testDeposit() public {
        uint256 depositAmount = 100 * 1e18;
        
        vm.prank(player1);
        game.deposit(depositAmount);
        
        assertEq(game.getPlayerBalance(player1), depositAmount);
        assertEq(token.balanceOf(address(game)), depositAmount);
    }
    
    function testDepositMultiple() public {
        uint256 deposit1 = 50 * 1e18;
        uint256 deposit2 = 75 * 1e18;
        
        vm.startPrank(player1);
        game.deposit(deposit1);
        game.deposit(deposit2);
        vm.stopPrank();
        
        assertEq(game.getPlayerBalance(player1), deposit1 + deposit2);
    }
    
    function testDepositRevertsWhenPaused() public {
        vm.prank(owner);
        game.pause();
        
        vm.prank(player1);
        vm.expectRevert("PlinkooGame: contract is paused");
        game.deposit(100 * 1e18);
    }
    
    // ============ Withdraw Tests ============
    
    function testWithdraw() public {
        uint256 depositAmount = 100 * 1e18;
        uint256 withdrawAmount = 50 * 1e18;
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        game.withdraw(withdrawAmount);
        vm.stopPrank();
        
        assertEq(game.getPlayerBalance(player1), depositAmount - withdrawAmount);
        assertEq(token.balanceOf(player1), INITIAL_BALANCE - depositAmount + withdrawAmount);
    }
    
    function testWithdrawRevertsInsufficientBalance() public {
        uint256 depositAmount = 100 * 1e18;
        uint256 withdrawAmount = 150 * 1e18;
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        vm.expectRevert("PlinkooGame: insufficient balance");
        game.withdraw(withdrawAmount);
        vm.stopPrank();
    }
    
    // ============ Play Game Tests ============
    
    function testPlayGame() public {
        uint256 depositAmount = 100 * 1e18;
        uint256 betAmount = 10 * 1e18;
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        
        vm.expectEmit(true, true, true, true);
        emit BetPlaced(player1, 1, betAmount);
        
        (uint256 gameId, uint8 outcome, uint256 multiplier, uint256[] memory pattern, uint256 winnings) = 
            game.playGame(betAmount);
        vm.stopPrank();
        
        assertEq(gameId, 1);
        assertGe(outcome, 0);
        assertLe(outcome, 16);
        assertEq(pattern.length, 16);
        assertEq(game.getPlayerBalance(player1), depositAmount - betAmount + winnings);
        
        // Verify game data
        PlinkooGame.GameData memory gameData = game.getGame(gameId);
        assertEq(gameData.player, player1);
        assertEq(gameData.betAmount, betAmount);
        assertEq(gameData.outcome, outcome);
        assertEq(gameData.winnings, winnings);
    }
    
    function testPlayGameRevertsInsufficientBalance() public {
        uint256 depositAmount = 5 * 1e18;
        uint256 betAmount = 10 * 1e18;
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        vm.expectRevert("PlinkooGame: insufficient balance");
        game.playGame(betAmount);
        vm.stopPrank();
    }
    
    function testPlayGameRevertsBetTooLow() public {
        uint256 depositAmount = 100 * 1e18;
        uint256 betAmount = 0.5 * 1e18; // Less than MIN_BET (1e18)
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        vm.expectRevert("PlinkooGame: bet amount too low");
        game.playGame(betAmount);
        vm.stopPrank();
    }
    
    function testPlayGameRevertsWhenPaused() public {
        uint256 depositAmount = 100 * 1e18;
        uint256 betAmount = 10 * 1e18;
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        vm.stopPrank();
        
        vm.prank(owner);
        game.pause();
        
        vm.prank(player1);
        vm.expectRevert("PlinkooGame: contract is paused");
        game.playGame(betAmount);
    }
    
    function testPlayGameMultipleGames() public {
        uint256 depositAmount = 100 * 1e18;
        uint256 betAmount = 10 * 1e18;
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        
        game.playGame(betAmount);
        game.playGame(betAmount);
        game.playGame(betAmount);
        vm.stopPrank();
        
        assertEq(game.gameCounter(), 3);
        
        (uint256[] memory gameIds, ) = game.getGameHistory(player1);
        assertEq(gameIds.length, 3);
    }
    
    // ============ Calculate Winnings Tests ============
    
    function testCalculateWinningsOutcome0() public {
        uint256 betAmount = 100 * 1e18;
        uint256 winnings = game.calculateWinnings(betAmount, 0);
        assertEq(winnings, 1600 * 1e18); // 16x
    }
    
    function testCalculateWinningsOutcome16() public {
        uint256 betAmount = 100 * 1e18;
        uint256 winnings = game.calculateWinnings(betAmount, 16);
        assertEq(winnings, 1600 * 1e18); // 16x
    }
    
    function testCalculateWinningsOutcome1() public {
        uint256 betAmount = 100 * 1e18;
        uint256 winnings = game.calculateWinnings(betAmount, 1);
        assertEq(winnings, 900 * 1e18); // 9x
    }
    
    function testCalculateWinningsOutcome8() public {
        uint256 betAmount = 100 * 1e18;
        uint256 winnings = game.calculateWinnings(betAmount, 8);
        assertEq(winnings, 50 * 1e18); // 0.5x
    }
    
    function testCalculateWinningsOutcome7() public {
        uint256 betAmount = 100 * 1e18;
        uint256 winnings = game.calculateWinnings(betAmount, 7);
        assertEq(winnings, 100 * 1e18); // 1x
    }
    
    // ============ Get Multiplier Tests ============
    
    function testGetMultiplier() public {
        assertEq(game.getMultiplier(0), 160000); // 16x
        assertEq(game.getMultiplier(1), 90000);  // 9x
        assertEq(game.getMultiplier(2), 20000);  // 2x
        assertEq(game.getMultiplier(3), 14000);  // 1.4x
        assertEq(game.getMultiplier(4), 14000);  // 1.4x
        assertEq(game.getMultiplier(5), 12000);  // 1.2x
        assertEq(game.getMultiplier(6), 11000);  // 1.1x
        assertEq(game.getMultiplier(7), 10000);  // 1x
        assertEq(game.getMultiplier(8), 5000);  // 0.5x
        assertEq(game.getMultiplier(9), 10000);  // 1x
        assertEq(game.getMultiplier(10), 11000); // 1.1x
        assertEq(game.getMultiplier(11), 12000); // 1.2x
        assertEq(game.getMultiplier(12), 14000); // 1.4x
        assertEq(game.getMultiplier(13), 14000); // 1.4x
        assertEq(game.getMultiplier(14), 20000); // 2x
        assertEq(game.getMultiplier(15), 90000); // 9x
        assertEq(game.getMultiplier(16), 160000); // 16x
    }
    
    // ============ Game History Tests ============
    
    function testGetGameHistory() public {
        uint256 depositAmount = 100 * 1e18;
        uint256 betAmount = 10 * 1e18;
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        game.playGame(betAmount);
        game.playGame(betAmount);
        vm.stopPrank();
        
        (uint256[] memory gameIds, PlinkooGame.GameData[] memory gameData) = 
            game.getGameHistory(player1);
        
        assertEq(gameIds.length, 2);
        assertEq(gameData.length, 2);
        assertEq(gameData[0].player, player1);
        assertEq(gameData[1].player, player1);
    }
    
    function testGetGameHistoryEmpty() public {
        (uint256[] memory gameIds, PlinkooGame.GameData[] memory gameData) = 
            game.getGameHistory(player1);
        
        assertEq(gameIds.length, 0);
        assertEq(gameData.length, 0);
    }
    
    // ============ Pause/Unpause Tests ============
    
    function testPause() public {
        vm.prank(owner);
        game.pause();
        
        assertTrue(game.paused());
    }
    
    function testUnpause() public {
        vm.startPrank(owner);
        game.pause();
        game.unpause();
        vm.stopPrank();
        
        assertFalse(game.paused());
    }
    
    function testPauseRevertsNotOwner() public {
        vm.prank(player1);
        vm.expectRevert();
        game.pause();
    }
    
    // ============ Claim Winnings Tests ============
    
    function testClaimWinnings() public {
        uint256 depositAmount = 100 * 1e18;
        uint256 betAmount = 10 * 1e18;
        
        // Mint tokens to contract to cover potential winnings
        // This simulates the house having funds to pay winners
        token.mint(address(game), 2000 * 1e18);
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        
        // Play game and potentially win
        game.playGame(betAmount);
        
        uint256 balance = game.getPlayerBalance(player1);
        game.claimWinnings();
        vm.stopPrank();
        
        assertEq(game.getPlayerBalance(player1), 0);
        assertEq(token.balanceOf(player1), INITIAL_BALANCE - depositAmount + balance);
    }
    
    function testClaimWinningsRevertsNoBalance() public {
        vm.prank(player1);
        vm.expectRevert("PlinkooGame: no winnings to claim");
        game.claimWinnings();
    }
    
    // ============ Edge Cases ============
    
    function testPlayGameWithAllOutcomes() public {
        uint256 depositAmount = 1000 * 1e18;
        uint256 betAmount = 1 * 1e18;
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        
        // Play multiple games to test different outcomes
        for (uint256 i = 0; i < 50; i++) {
            (uint256 gameId, uint8 outcome, , , ) = game.playGame(betAmount);
            assertGe(outcome, 0);
            assertLe(outcome, 16);
            assertGt(gameId, 0);
        }
        vm.stopPrank();
    }
    
    function testPatternGeneration() public {
        uint256 depositAmount = 100 * 1e18;
        uint256 betAmount = 10 * 1e18;
        
        vm.startPrank(player1);
        game.deposit(depositAmount);
        
        (uint256 gameId, uint8 outcome, , uint256[] memory pattern, ) = 
            game.playGame(betAmount);
        vm.stopPrank();
        
        // Verify pattern length
        assertEq(pattern.length, 16);
        
        // Verify outcome matches pattern (count of 1s)
        uint8 count = 0;
        for (uint256 i = 0; i < pattern.length; i++) {
            if (pattern[i] == 1) {
                count++;
            }
        }
        assertEq(outcome, count);
    }
    
    // ============ Fuzz Tests ============
    
    function testFuzzCalculateWinnings(uint256 betAmount, uint8 outcome) public {
        // Bound inputs
        betAmount = bound(betAmount, 1e18, 1000000 * 1e18);
        outcome = uint8(bound(uint256(outcome), 0, 16));
        
        uint256 winnings = game.calculateWinnings(betAmount, outcome);
        uint256 multiplier = game.getMultiplier(outcome);
        
        if (multiplier == 0) {
            assertEq(winnings, 0);
        } else {
            assertEq(winnings, (betAmount * multiplier) / 10000);
        }
    }
    
    function testFuzzGetMultiplier(uint8 outcome) public {
        outcome = uint8(bound(uint256(outcome), 0, 16));
        
        uint256 multiplier = game.getMultiplier(outcome);
        
        // Verify multiplier is within expected range
        assertGe(multiplier, 0);
        assertLe(multiplier, 160000);
    }
}

