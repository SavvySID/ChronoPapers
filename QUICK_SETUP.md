# 🚀 Quick Filecoin Setup Guide

## The Issue
Your upload is failing because the Filecoin private key isn't configured yet. The system is trying to use the placeholder text instead of a real private key.

## 🔧 Quick Fix

### Option 1: Get a Test Private Key (Recommended)
1. **Visit**: https://calibration.filfox.info/
2. **Click**: "Create Wallet" 
3. **Copy**: The private key (starts with `0x`)
4. **Open**: `.env.local` file in your project
5. **Replace**: `your_filecoin_private_key_here` with your actual private key
6. **Save** and **restart** the server

### Option 2: Use a Demo Mode (Temporary)
If you want to test uploads without setting up Filecoin right now, I can create a demo mode that simulates uploads.

## 📝 Example Configuration
Your `.env.local` should look like this:
```
RPC_URL=https://api.calibration.node.glif.io/rpc/v1
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
DATABASE_URL="file:./prisma/dev.db"
```

## ⚠️ Important Notes
- **Calibration testnet** is safe for development (free tokens)
- **Never share** your private key
- **Never commit** private keys to git (`.env.local` is already ignored)

## 🎯 What Happens After Setup
- ✅ **Uploads** will work and store files on Filecoin
- ✅ **Verification** will work with real network calls
- ✅ **Downloads** will retrieve files from Filecoin network

Would you like me to:
1. **Help you get a private key** (I can guide you through the process)
2. **Create a demo mode** (for testing without Filecoin setup)
3. **Show you the exact steps** to configure everything
