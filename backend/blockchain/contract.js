/**
 * EduChain Smart Contract Interface
 * 
 * HOW IT WORKS:
 * 1. A Solidity smart contract is deployed on Polygon Mumbai testnet (free)
 * 2. When a certificate is issued, the SHA-256 hash is sent to this contract
 * 3. The contract stores: hash → { issuer address, timestamp, revoked status }
 * 4. Anyone can call isValid(hash) on-chain to verify — no central authority needed
 * 5. Revocation is also recorded on-chain so it's tamper-proof
 * 
 * The contract ABI below is the "interface" — what functions exist and their inputs/outputs
 */

// Minimal ABI — only the functions we actually call
const CONTRACT_ABI = [
  // Issue: store a certificate hash on-chain
  {
    "inputs": [{ "internalType": "bytes32", "name": "certHash", "type": "bytes32" }],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Revoke: mark a hash as invalid on-chain
  {
    "inputs": [{ "internalType": "bytes32", "name": "certHash", "type": "bytes32" }],
    "name": "revokeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Check: returns true if hash exists and is NOT revoked
  {
    "inputs": [{ "internalType": "bytes32", "name": "certHash", "type": "bytes32" }],
    "name": "isValid",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  // Get full record: issuer, timestamp, revoked
  {
    "inputs": [{ "internalType": "bytes32", "name": "certHash", "type": "bytes32" }],
    "name": "getCertificate",
    "outputs": [
      { "internalType": "address", "name": "issuer", "type": "address" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "bool",    "name": "revoked",   "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

/**
 * SOLIDITY SOURCE (deploy this once on Remix IDE → Polygon Mumbai):
 * 
 * // SPDX-License-Identifier: MIT
 * pragma solidity ^0.8.19;
 * 
 * contract EduChainRegistry {
 *     struct Certificate {
 *         address issuer;
 *         uint256 timestamp;
 *         bool revoked;
 *     }
 *     mapping(bytes32 => Certificate) private certs;
 *
 *     event CertificateIssued(bytes32 indexed certHash, address indexed issuer, uint256 timestamp);
 *     event CertificateRevoked(bytes32 indexed certHash, address indexed revoker);
 *
 *     function issueCertificate(bytes32 certHash) external {
 *         require(certs[certHash].timestamp == 0, "Already exists");
 *         certs[certHash] = Certificate(msg.sender, block.timestamp, false);
 *         emit CertificateIssued(certHash, msg.sender, block.timestamp);
 *     }
 *
 *     function revokeCertificate(bytes32 certHash) external {
 *         require(certs[certHash].issuer == msg.sender, "Not issuer");
 *         certs[certHash].revoked = true;
 *         emit CertificateRevoked(certHash, msg.sender);
 *     }
 *
 *     function isValid(bytes32 certHash) external view returns (bool) {
 *         return certs[certHash].timestamp > 0 && !certs[certHash].revoked;
 *     }
 *
 *     function getCertificate(bytes32 certHash) external view returns (address, uint256, bool) {
 *         Certificate memory c = certs[certHash];
 *         return (c.issuer, c.timestamp, c.revoked);
 *     }
 * }
 */

module.exports = { CONTRACT_ABI };
