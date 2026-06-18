const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const ActivityLog = require('../models/ActivityLog');
const { verifyOnChain } = require('../blockchain/polygon');

// @GET /api/verify/:certId — Public, no auth required
router.get('/:certId', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('institution', 'name email website');

    if (!cert) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'Certificate not found in registry',
      });
    }

    // ── On-chain verification ─────────────────────────────────────────────────
    // This calls our smart contract's isValid() function on Polygon Mumbai.
    // It's a FREE read-only call — no gas needed.
    // If the hash exists on-chain AND is not revoked → onChainValid = true
    const onChainResult = await verifyOnChain(cert.sha256Hash);

    // DB status check (revocation is also written on-chain via revokeOnChain)
    const dbValid = cert.status === 'active';
    const verified = dbValid && (onChainResult.onChainValid || onChainResult.simulated);

    cert.verificationCount += 1;
    cert.lastVerifiedAt = new Date();
    await cert.save();

    await ActivityLog.create({
      action: 'CERTIFICATE_VERIFIED',
      certificate: cert._id,
      details: { verifiedBy: 'public', result: verified, onChain: onChainResult },
    });

    res.json({
      success: true,
      verified,
      hashMatch: true,
      onChain: onChainResult,
      certificate: {
        certificateId:       cert.certificateId,
        studentName:         cert.studentName,
        studentId:           cert.studentId,
        courseName:          cert.courseName,
        degree:              cert.degree,
        cgpa:                cert.cgpa,
        issueDate:           cert.issueDate,
        institutionName:     cert.institutionName,
        institution:         cert.institution,
        sha256Hash:          cert.sha256Hash,
        ipfsCid:             cert.ipfsCid,
        ipfsGatewayUrl:      cert.ipfsGatewayUrl,
        ipfsSimulated:       cert.ipfsSimulated,
        blockchainTxHash:    cert.blockchainTxHash,
        blockchainNetwork:   cert.blockchainNetwork,
        blockchainSimulated: cert.blockchainSimulated,
        blockNumber:         cert.blockNumber,
        status:              cert.status,
        fileUrl:             cert.fileUrl,
        fileResourceType:    cert.fileResourceType,
        revokedReason:       cert.revokedReason,
        verificationCount:   cert.verificationCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
