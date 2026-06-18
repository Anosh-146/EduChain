const { ethers } = require('ethers');
const { CONTRACT_ABI } = require('./contract');

// Polygon AMOY Testnet (Mumbai is deprecated — Amoy is the current testnet)
const AMOY_RPC = process.env.ALCHEMY_AMOY_URL || 'https://rpc-amoy.polygon.technology';

let provider, wallet, contract;

function initBlockchain() {
  const privateKey     = process.env.WALLET_PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!privateKey || !contractAddress ||
      privateKey === 'your_metamask_private_key_here' ||
      contractAddress === 'your_deployed_contract_address_here') {
    console.warn('⚠️  Blockchain: keys not set — running in simulation mode');
    return false;
  }

  try {
    provider = new ethers.JsonRpcProvider(AMOY_RPC);
    wallet   = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);
    console.log('✅ Blockchain connected: Polygon Amoy Testnet');
    console.log(`📍 Contract: ${contractAddress}`);
    console.log(`👛 Wallet:   ${wallet.address}`);
    return true;
  } catch (err) {
    console.error('❌ Blockchain init failed:', err.message);
    return false;
  }
}

function hashToBytes32(sha256Hex) {
  return '0x' + sha256Hex;
}

async function issueOnChain(sha256Hash) {
  if (!contract) {
    return {
      txHash: '0x' + require('crypto').randomBytes(32).toString('hex'),
      blockNumber: Math.floor(Math.random() * 10000000) + 5000000,
      network: 'Polygon Amoy (Simulated — fill .env to go live)',
      simulated: true,
    };
  }
  try {
    const tx = await contract.issueCertificate(hashToBytes32(sha256Hash), { gasLimit: 100000 });
    console.log(`⛓️  TX sent: ${tx.hash}`);
    const receipt = await tx.wait(1);
    console.log(`✅ Confirmed in block ${receipt.blockNumber}`);
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      network: 'Polygon Amoy Testnet',
      simulated: false,
    };
  } catch (err) {
    console.error('❌ Blockchain issue failed:', err.message);
    return {
      txHash: '0x' + require('crypto').randomBytes(32).toString('hex'),
      blockNumber: null,
      network: 'Polygon Amoy (TX Failed — check POL balance)',
      simulated: true,
      error: err.message,
    };
  }
}

async function verifyOnChain(sha256Hash) {
  if (!contract) {
    return { onChainValid: true, simulated: true, message: 'Fill .env keys to verify on real chain' };
  }
  try {
    const h = hashToBytes32(sha256Hash);
    const isValid = await contract.isValid(h);
    const [issuer, timestamp, revoked] = await contract.getCertificate(h);
    return {
      onChainValid: isValid,
      issuer,
      issuedAt: timestamp > 0 ? new Date(Number(timestamp) * 1000).toISOString() : null,
      revoked,
      simulated: false,
    };
  } catch (err) {
    console.error('❌ On-chain verify failed:', err.message);
    return { onChainValid: false, simulated: true, error: err.message };
  }
}

async function revokeOnChain(sha256Hash) {
  if (!contract) {
    return { txHash: '0x' + require('crypto').randomBytes(32).toString('hex'), simulated: true };
  }
  try {
    const tx = await contract.revokeCertificate(hashToBytes32(sha256Hash), { gasLimit: 80000 });
    const receipt = await tx.wait(1);
    return { txHash: receipt.hash, success: true, simulated: false };
  } catch (err) {
    console.error('❌ On-chain revoke failed:', err.message);
    return { txHash: null, success: false, error: err.message, simulated: true };
  }
}

module.exports = { initBlockchain, issueOnChain, verifyOnChain, revokeOnChain };
