# ChronoPapers Configuration Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# Web3Auth Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID="your-web3auth-client-id"

# Filecoin Configuration
FILECOIN_NETWORK="testnet"
FILECOIN_RPC_URL="https://api.calibration.node.glif.io/rpc/v1"

# App Configuration
NEXT_PUBLIC_APP_NAME="ChronoPapers"
NEXT_PUBLIC_APP_DESCRIPTION="Decentralized Academic Publishing Platform"
```

## Setup Instructions

### 1. Web3Auth Setup
1. Go to [Web3Auth Dashboard](https://dashboard.web3auth.io/)
2. Create a new project
3. Copy your Client ID
4. Add it to `.env.local` as `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`

### 2. Filecoin Network Configuration
- **Testnet**: Use `testnet` for development
- **Mainnet**: Use `mainnet` for production
- **RPC URL**: Update `FILECOIN_RPC_URL` for your preferred provider

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```

## Features Enabled

### Real Filecoin Storage
- Files are uploaded to Filecoin using Synapse SDK
- Real CID generation and storage
- Actual file retrieval from decentralized storage

### Wallet Authentication
- Web3Auth integration for secure wallet connection
- Support for multiple wallet providers
- Ethereum mainnet/testnet support

### PDP Verification
- Real Proof-of-Data-Possession verification
- File integrity checking on Filecoin
- Cryptographic proof validation

## Production Deployment

### Environment Variables for Production
```env
DATABASE_URL="postgresql://user:password@localhost:5432/chronopapers"
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID="your-production-client-id"
FILECOIN_NETWORK="mainnet"
FILECOIN_RPC_URL="https://api.node.glif.io/rpc/v1"
```

### Database Migration
```bash
npx prisma migrate deploy
```

### Build for Production
```bash
npm run build
npm start
```

## Troubleshooting

### Common Issues

1. **Web3Auth Connection Failed**
   - Check if `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` is set correctly
   - Verify the client ID is valid in Web3Auth dashboard

2. **Filecoin Upload Failed**
   - Check network connectivity
   - Verify RPC URL is accessible
   - Ensure sufficient FIL balance for storage deals

3. **Database Connection Issues**
   - Run `npx prisma generate` to regenerate client
   - Check `DATABASE_URL` format
   - Ensure database file permissions

### Support
- Check the [Synapse SDK documentation](https://github.com/FilOzone/synapse-sdk)
- Review [Web3Auth documentation](https://web3auth.io/docs/)
- Filecoin network status: [Filecoin Status](https://status.filecoin.io/)
