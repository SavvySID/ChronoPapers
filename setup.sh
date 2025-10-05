#!/bin/bash

# ChronoPapers Development Setup Script

echo "🚀 Setting up ChronoPapers development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📊 Setting up database..."
npx prisma db push

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cat > .env.local << EOF
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_WALLET_PROJECT_ID=""
FILECOIN_API_KEY=""
FILECOIN_NETWORK="testnet"
NEXT_PUBLIC_APP_NAME="ChronoPapers"
NEXT_PUBLIC_APP_DESCRIPTION="Decentralized Academic Publishing Platform"
EOF
    echo "✅ Created .env.local file"
fi

echo ""
echo "🎉 Setup complete! You can now start the development server:"
echo "   npm run dev"
echo ""
echo "📚 Additional commands:"
echo "   npm run db:studio  - Open Prisma Studio"
echo "   npm run build      - Build for production"
echo "   npm run lint        - Run ESLint"
echo ""
echo "🌐 Open http://localhost:3000 to view the application"
