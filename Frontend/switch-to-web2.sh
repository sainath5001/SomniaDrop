#!/bin/bash

# Script to switch to Web2 version

echo "🔄 Switching to Web2 version..."

cd "$(dirname "$0")"

# Backup Web3 files
echo "📦 Backing up Web3 files..."
mkdir -p .backup-web3

[ -f app/layout.tsx ] && cp app/layout.tsx .backup-web3/layout.tsx
[ -f app/page.tsx ] && cp app/page.tsx .backup-web3/page.tsx
[ -f app/game/page.tsx ] && cp app/game/page.tsx .backup-web3/game-page.tsx
[ -f lib/providers.tsx ] && cp lib/providers.tsx .backup-web3/providers.tsx
[ -f hooks/usePlinkoo.ts ] && cp hooks/usePlinkoo.ts .backup-web3/usePlinkoo.ts
[ -f hooks/useSomniaStreams.ts ] && cp hooks/useSomniaStreams.ts .backup-web3/useSomniaStreams.ts

# Replace with Web2 versions
echo "✨ Installing Web2 version..."

if [ -f app/layout-web2.tsx ]; then
  mv app/layout.tsx app/layout-web3.tsx.backup 2>/dev/null || true
  cp app/layout-web2.tsx app/layout.tsx
  echo "  ✓ Replaced layout.tsx"
fi

if [ -f app/page-web2.tsx ]; then
  mv app/page.tsx app/page-web3.tsx.backup 2>/dev/null || true
  cp app/page-web2.tsx app/page.tsx
  echo "  ✓ Replaced page.tsx"
fi

if [ -f app/game/page-web2.tsx ]; then
  mv app/game/page.tsx app/game/page-web3.tsx.backup 2>/dev/null || true
  cp app/game/page-web2.tsx app/game/page.tsx
  echo "  ✓ Replaced game/page.tsx"
fi

if [ -f lib/providers-web2.tsx ]; then
  mv lib/providers.tsx lib/providers-web3.tsx.backup 2>/dev/null || true
  cp lib/providers-web2.tsx lib/providers.tsx
  echo "  ✓ Replaced providers.tsx"
fi

if [ -f hooks/usePlinkooWeb2.ts ]; then
  mv hooks/usePlinkoo.ts hooks/usePlinkoo-web3.ts.backup 2>/dev/null || true
  cp hooks/usePlinkooWeb2.ts hooks/usePlinkoo.ts
  echo "  ✓ Replaced usePlinkoo.ts"
fi

if [ -f hooks/useSomniaStreamsWeb2.ts ]; then
  mv hooks/useSomniaStreams.ts hooks/useSomniaStreams-web3.ts.backup 2>/dev/null || true
  cp hooks/useSomniaStreamsWeb2.ts hooks/useSomniaStreams.ts
  echo "  ✓ Replaced useSomniaStreams.ts"
fi

# Update GameHistory import if needed
if [ -f components/GameHistoryWeb2.tsx ]; then
  # Check if page.tsx imports GameHistory and update it
  if grep -q "from '@/components/GameHistory'" app/game/page.tsx 2>/dev/null; then
    sed -i "s|from '@/components/GameHistory'|from '@/components/GameHistoryWeb2'|g" app/game/page.tsx
    sed -i "s|GameHistory|GameHistoryWeb2|g" app/game/page.tsx
    echo "  ✓ Updated GameHistory imports"
  fi
fi

echo ""
echo "✅ Successfully switched to Web2 version!"
echo ""
echo "📝 Next steps:"
echo "  1. Install dependencies: npm install"
echo "  2. Run the project: npm run dev"
echo ""
echo "💡 Web3 files are backed up in .backup-web3/ directory"



