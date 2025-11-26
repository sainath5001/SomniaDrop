// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {PlinkooGame} from "../src/PlinkooGame.sol";
import {MockERC20} from "../src/MockERC20.sol";

/**
 * @title DeployScript
 * @dev Deployment script for PlinkooGame on Somnia Testnet
 * @notice To deploy:
 *   1. Set PRIVATE_KEY environment variable
 *   2. Optionally set TOKEN_ADDRESS (if not set, will deploy MockERC20)
 *   3. Run: forge script script/Deploy.s.sol:DeployScript --rpc-url somnia_testnet --broadcast --verify
 */
contract DeployScript is Script {
    function setUp() public {}
    
    function run() public {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Get token address (optional - will deploy MockERC20 if not provided)
        address tokenAddress;
        try vm.envAddress("TOKEN_ADDRESS") returns (address addr) {
            tokenAddress = addr;
        } catch {
            tokenAddress = address(0);
        }
        
        console.log("=== PlinkooGame Deployment ===");
        console.log("Network: Somnia Testnet");
        console.log("RPC URL: https://dream-rpc.somnia.network");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy or use existing token
        address token = tokenAddress;
        if (token == address(0)) {
            console.log("Deploying MockERC20 token...");
            MockERC20 mockToken = new MockERC20("Somnia Test Token", "STT");
            token = address(mockToken);
            console.log("MockERC20 deployed at:", token);
            console.log("Token Name: Somnia Test Token");
            console.log("Token Symbol: STT");
        } else {
            console.log("Using existing token at:", token);
        }
        
        // Deploy PlinkooGame
        console.log("\nDeploying PlinkooGame...");
        PlinkooGame game = new PlinkooGame(token);
        console.log("PlinkooGame deployed at:", address(game));
        
        vm.stopBroadcast();
        
        // Log deployment summary
        console.log("\n=== Deployment Summary ===");
        console.log("Token Address:", token);
        console.log("Game Address:", address(game));
        console.log("Network: Somnia Testnet");
        console.log("Chain ID: Check Somnia docs");
        console.log("RPC URL: https://dream-rpc.somnia.network");
        console.log("\n=== Next Steps ===");
        console.log("1. Verify contract on SomniaScan (if available)");
        console.log("2. Fund the contract with tokens for payouts");
        console.log("3. Integrate with Somnia Data Streams SDK");
        console.log("4. Connect frontend to deployed contract");
    }
}

