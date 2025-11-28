#!/bin/bash

# Official Somnia Deployment Script
# Based on: https://somnia.network official deployment guide

set -e

echo "=== Somnia Contract Deployment ==="
echo ""

# Get private key from .env
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    exit 1
fi

PRIVATE_KEY=$(grep PRIVATE_KEY .env | cut -d '=' -f2 | tr -d ' ')

if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY not found in .env file!"
    exit 1
fi

echo "✓ Private key loaded"
echo ""

# RPC URL
RPC_URL="https://dream-rpc.somnia.network"

echo "Deploying to: $RPC_URL"
echo ""

# Step 1: Deploy MockERC20 Token
echo "Step 1: Deploying MockERC20 Token..."
echo "-----------------------------------"
TOKEN_OUTPUT=$(forge create \
    --rpc-url "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    src/MockERC20.sol:MockERC20 \
    --constructor-args "Somnia Test Token" "STT" 2>&1)

echo "$TOKEN_OUTPUT"

# Extract token address from output
TOKEN_ADDRESS=$(echo "$TOKEN_OUTPUT" | grep -oP "Deployed to: \K0x[a-fA-F0-9]{40}" || echo "")

if [ -z "$TOKEN_ADDRESS" ]; then
    echo ""
    echo "❌ Failed to deploy MockERC20. Please check the output above."
    exit 1
fi

echo ""
echo "✅ MockERC20 deployed successfully!"
echo "Token Address: $TOKEN_ADDRESS"
echo ""

# Step 2: Deploy PlinkooGame
echo "Step 2: Deploying PlinkooGame..."
echo "-----------------------------------"
GAME_OUTPUT=$(forge create \
    --rpc-url "$RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    src/PlinkooGame.sol:PlinkooGame \
    --constructor-args "$TOKEN_ADDRESS" 2>&1)

echo "$GAME_OUTPUT"

# Extract game address from output
GAME_ADDRESS=$(echo "$GAME_OUTPUT" | grep -oP "Deployed to: \K0x[a-fA-F0-9]{40}" || echo "")

if [ -z "$GAME_ADDRESS" ]; then
    echo ""
    echo "❌ Failed to deploy PlinkooGame. Please check the output above."
    exit 1
fi

echo ""
echo "✅ PlinkooGame deployed successfully!"
echo "Game Address: $GAME_ADDRESS"
echo ""

# Summary
echo "=========================================="
echo "🎉 Deployment Complete!"
echo "=========================================="
echo ""
echo "Contract Addresses:"
echo "  Token (MockERC20): $TOKEN_ADDRESS"
echo "  Game (PlinkooGame): $GAME_ADDRESS"
echo ""
echo "Network: Somnia Testnet"
echo "RPC URL: $RPC_URL"
echo "Chain ID: 50312"
echo ""
echo "Next Steps:"
echo "1. Update Frontend/.env.local with these addresses:"
echo "   NEXT_PUBLIC_PLINKOO_GAME_ADDRESS=$GAME_ADDRESS"
echo "   NEXT_PUBLIC_TOKEN_ADDRESS=$TOKEN_ADDRESS"
echo ""
echo "2. Or update Frontend/lib/config.ts with the addresses above"
echo ""
echo "=========================================="



