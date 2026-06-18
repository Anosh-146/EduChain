# EduChain — Real Blockchain + IPFS Setup Guide

## How the System Works (Full Flow)

```
Institution issues cert
        │
        ▼
[1] SHA-256 Hash computed from cert data
        │
        ├──▶ [2] JSON pinned to IPFS via Pinata
        │         Returns: CID (QmXoypiz...)
        │         Anyone can retrieve at: gateway.pinata.cloud/ipfs/{CID}
        │
        └──▶ [3] Hash written to Polygon smart contract
                  Returns: TX hash (0xabc...)
                  Anyone can check: mumbai.polygonscan.com/tx/{txHash}
        │
        ▼
[4] cert saved in MongoDB with CID + txHash + sha256Hash

Employer/Anyone verifies:
        │
        ▼
[1] Look up cert ID in MongoDB (fast lookup)
[2] Call contract.isValid(sha256Hash) on Polygon (free read)
[3] If valid → show green, link to PolygonScan + IPFS
```

---

## Option A — Polygon Mumbai Testnet (Real Blockchain)

### What you need
- MetaMask wallet (free): https://metamask.io
- Free testnet MATIC: https://faucet.polygon.technology
- Alchemy account (free): https://alchemy.com

### Step 1 — Get a wallet
1. Install MetaMask browser extension
2. Create a new wallet — save your seed phrase safely
3. Switch network to **Polygon Mumbai** (add it at chainlist.org/chain/80001)

### Step 2 — Get free testnet MATIC
1. Go to https://faucet.polygon.technology
2. Paste your MetaMask wallet address
3. Request MATIC — you'll get 0.5 MATIC free (enough for ~500 certificates)

### Step 3 — Deploy the smart contract
1. Go to https://remix.ethereum.org
2. Create a new file `EduChainRegistry.sol`
3. Paste the Solidity code from `backend/blockchain/contract.js` (in the comment block)
4. Compile with Solidity 0.8.19
5. Deploy to **Injected Provider - MetaMask** (make sure MetaMask is on Mumbai)
6. Copy the deployed **contract address** (starts with 0x...)

### Step 4 — Get Alchemy RPC URL
1. Sign up at https://alchemy.com (free)
2. Create app → Network: Polygon Mumbai
3. Copy the HTTPS URL

### Step 5 — Add to .env
```
WALLET_PRIVATE_KEY=   # MetaMask → Account Details → Export Private Key
CONTRACT_ADDRESS=     # From Remix after deploy
ALCHEMY_MUMBAI_URL=   # From Alchemy dashboard
```

### Verify it works
After issuing a cert, the TX hash will appear on the verify page.
Click "View on PolygonScan" → you'll see your transaction on the real blockchain.

---

## Option B — IPFS via Pinata (Real Decentralised Storage)

### What you need
- Pinata account (free): https://pinata.cloud
- Free tier: 1GB storage, 100 files/month

### Step 1 — Create account
1. Sign up at https://pinata.cloud
2. Go to **API Keys** → **New Key**
3. Enable: pinFileToIPFS, pinJSONToIPFS, unpin
4. Copy the **API Key** and **API Secret**

### Step 2 — Add to .env
```
PINATA_API_KEY=       # From Pinata dashboard
PINATA_API_SECRET=    # From Pinata dashboard
```

### Verify it works
After issuing a cert, the IPFS CID will appear on the verify page.
Click "View on IPFS Gateway" → you'll see the certificate JSON hosted on IPFS.
URL format: https://gateway.pinata.cloud/ipfs/{CID}

---

## Without keys — Graceful Simulation

If you don't add the keys yet, the system still works:
- SHA-256 hash is still real and computed correctly
- IPFS CID is generated randomly (looks real but isn't pinned)
- Blockchain TX hash is generated randomly (looks real but isn't on-chain)
- The verify page shows "Simulated" badges so you know the status

This lets you build and test without setting up wallets first.

---

## Cost Summary

| Action | Cost |
|---|---|
| Deploy contract | ~0.01 MATIC (one time) |
| Issue certificate on-chain | ~0.001 MATIC (~$0.001) |
| Verify certificate (read) | FREE |
| IPFS pin (Pinata free tier) | FREE up to 1GB |

Mumbai testnet MATIC is free — zero real money needed for testing.
