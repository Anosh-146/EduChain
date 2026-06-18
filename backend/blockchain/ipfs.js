/**
 * IPFS SERVICE via Pinata
 *
 * HOW IT WORKS — Step by Step:
 * ─────────────────────────────
 * IPFS = InterPlanetary File System. Instead of storing files on one server
 * (which can go down), IPFS stores files across thousands of nodes worldwide.
 * A file is identified by its CONTENT HASH (CID), not by a URL.
 * This means: if even one byte changes, the CID changes — perfect for certificates.
 *
 * Pinata is a "pinning service" — they run IPFS nodes and guarantee your file
 * stays available (not garbage-collected). Free tier = 1GB, 100 files/month.
 *
 * THE FLOW:
 * 1. We build a JSON object with all certificate data
 * 2. POST it to Pinata's API → they pin it to IPFS
 * 3. Pinata returns a CID like "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
 * 4. That CID is stored in MongoDB and displayed on the verify page
 * 5. Anyone can view the cert at: https://gateway.pinata.cloud/ipfs/{CID}
 *
 * WHY THIS MATTERS:
 * - The CID is derived from the file content → tamper-evident
 * - The file lives on IPFS forever (as long as it's pinned)
 * - No central server needed to retrieve it
 */

const fetch = require('node-fetch');
const FormData = require('form-data');

const PINATA_API = 'https://api.pinata.cloud';

/**
 * Pin certificate JSON data to IPFS via Pinata.
 * Returns { cid, ipfsUrl, gatewayUrl, simulated }
 */
async function pinCertificateToIPFS(certData) {
  const apiKey = process.env.PINATA_API_KEY;
  const apiSecret = process.env.PINATA_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn('⚠️  IPFS: PINATA_API_KEY not set — using simulated CID');
    const fakeCid = 'Qm' + require('crypto').randomBytes(22).toString('hex').toUpperCase().slice(0, 44);
    return {
      cid: fakeCid,
      ipfsUrl: `ipfs://${fakeCid}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${fakeCid}`,
      simulated: true,
    };
  }

  try {
    // Build the JSON payload to pin — full certificate data
    const payload = {
      pinataContent: {
        version: '1.0',
        type: 'EduChain Certificate',
        issuedAt: new Date().toISOString(),
        certificate: {
          id: certData.certificateId,
          studentName: certData.studentName,
          studentEmail: certData.studentEmail,
          studentId: certData.studentId,
          courseName: certData.courseName,
          degree: certData.degree,
          cgpa: certData.cgpa,
          issueDate: certData.issueDate,
          institutionName: certData.institutionName,
          sha256Hash: certData.sha256Hash,
        }
      },
      pinataMetadata: {
        name: `EduChain-${certData.certificateId}`,
        keyvalues: {
          certId: certData.certificateId,
          studentEmail: certData.studentEmail,
          institution: certData.institutionName,
        }
      },
      pinataOptions: { cidVersion: 0 }
    };

    // POST to Pinata's pinJSONToIPFS endpoint
    const response = await fetch(`${PINATA_API}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': apiSecret,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Pinata error ${response.status}: ${err}`);
    }

    const result = await response.json();
    const cid = result.IpfsHash;

    console.log(`📌 Pinned to IPFS: ${cid}`);

    return {
      cid,
      ipfsUrl: `ipfs://${cid}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
      simulated: false,
    };
  } catch (err) {
    console.error('❌ IPFS pin failed:', err.message);
    const fakeCid = 'Qm' + require('crypto').randomBytes(22).toString('hex').toUpperCase().slice(0, 44);
    return {
      cid: fakeCid,
      ipfsUrl: `ipfs://${fakeCid}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${fakeCid}`,
      simulated: true,
      error: err.message,
    };
  }
}

/**
 * Fetch certificate data back from IPFS by CID.
 * This lets anyone independently retrieve the cert without our server.
 */
async function fetchFromIPFS(cid) {
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error('❌ IPFS fetch failed:', err.message);
    return null;
  }
}

module.exports = { pinCertificateToIPFS, fetchFromIPFS };
