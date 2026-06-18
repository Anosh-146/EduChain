# Deploy EduChain Smart Contract

## Steps

1. Fill in `.env` in this folder:
   - ALCHEMY_AMOY_URL  → from Alchemy dashboard
   - WALLET_PRIVATE_KEY → from MetaMask → Account Details → Export Private Key

2. Install and deploy:
   ```
   npm install
   npm run deploy
   ```

3. You'll see:
   ```
   ✅ CONTRACT ADDRESS: 0xABC123...
   Copy this into backend/.env:
   CONTRACT_ADDRESS=0xABC123...
   ```

4. Paste that address into `backend/.env` → CONTRACT_ADDRESS
