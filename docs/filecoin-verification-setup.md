# 🔗 Real Filecoin Verification Setup Guide

## Overview
This guide will help you set up **real Filecoin verification** instead of simulation. You'll be able to verify papers against the actual Filecoin network.

## 🚀 Quick Setup

### Step 1: Get a Filecoin Private Key
1. **Visit Calibration Testnet**: Go to https://calibration.filfox.info/
2. **Create/Import Wallet**: 
   - Click "Create Wallet" for a new wallet
   - Or "Import Wallet" if you have an existing one
3. **Copy Private Key**: Save your private key securely

### Step 2: Configure Environment
1. **Open `.env.local`** file in your project root
2. **Replace the placeholder**:
   ```
   PRIVATE_KEY=your_filecoin_private_key_here
   ```
   With your actual private key:
   ```
   PRIVATE_KEY=0x1234567890abcdef...
   ```

### Step 3: Restart Development Server
```bash
npm run dev
```

## 🔍 How Real Verification Works

### What Happens During Verification:
1. **Network Connection**: Connects to Filecoin Calibration testnet
2. **CID Lookup**: Searches for the paper's Content ID (CID) on the network
3. **Data Integrity Check**: Verifies the file exists and hasn't been corrupted
4. **Proof Generation**: Creates cryptographic proof of verification
5. **Status Update**: Updates the paper's verification status in database

### Expected Results:
- **Real Papers**: Will verify successfully if they exist on Filecoin
- **Demo Papers**: Will fail verification (as expected) since they have fake CIDs
- **Configuration Issues**: Will show helpful error messages

## 🎯 Testing Real Verification

### Option 1: Upload a Real Paper
1. Go to Upload tab
2. Upload an actual PDF file
3. The paper will be stored on Filecoin
4. Try verifying it - should work with real verification

### Option 2: Test with Demo Papers
- Demo papers will show "verification failed" messages
- This is expected behavior since they have fake CIDs
- You'll see the actual error handling in action

## 🔧 Troubleshooting

### Common Issues:

**"Must provide exactly one of: privateKey, provider, or signer"**
- Solution: Configure your private key in `.env.local`

**"Unable to connect to Filecoin network"**
- Solution: Check your internet connection and RPC URL

**"Verification failed - data may be corrupted or missing"**
- Solution: This is normal for demo papers with fake CIDs

## 🛡️ Security Notes

- ⚠️ **Never commit private keys** to version control
- ✅ `.env.local` is already in `.gitignore`
- 🔒 Use Calibration testnet for development (not mainnet)
- 💰 Testnet tokens are free and safe to use

## 🎉 What You'll Experience

With real verification enabled, you'll see:
- **Actual network calls** to Filecoin
- **Real cryptographic verification**
- **Proper error handling** for different scenarios
- **Authentic verification proofs** stored in database

This gives you the full experience of how ChronoPapers will work in production!
