const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const Certificate = require('../models/Certificate');
const Institution = require('../models/Institution');
const ActivityLog = require('../models/ActivityLog');
const { protect, authorize } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const { issueOnChain } = require('../blockchain/polygon');
const { pinCertificateToIPFS } = require('../blockchain/ipfs');

const generateHash = (data) =>
  crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');

// @GET /api/certificates
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'institution') {
      const inst = await Institution.findOne({ owner: req.user._id });
      if (inst) query.institution = inst._id;
    } else if (req.user.role === 'student') {
      query.studentEmail = req.user.email;
    }
    const certs = await Certificate.find(query).populate('institution', 'name').sort({ createdAt: -1 });
    res.json({ success: true, count: certs.length, data: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/certificates/issue
router.post('/issue', protect, authorize('institution'), upload.single('file'), async (req, res) => {
  try {
    const { studentName, studentEmail, studentId, courseName, degree, cgpa, issueDate, expiryDate } = req.body;

    // Auto-create institution if missing
    let institution = await Institution.findOne({ owner: req.user._id });
    if (!institution) {
      institution = await Institution.create({
        name: req.user.name, email: req.user.email, owner: req.user._id,
      });
    }

    const certId = uuidv4().toUpperCase().slice(0, 12);
    const issueDateNorm = new Date(issueDate).toISOString();

    // Deterministic hash payload — same field order used in verify route
    const hashPayload = {
      certId,
      studentName:   (studentName   || '').trim(),
      studentEmail:  (studentEmail  || '').trim().toLowerCase(),
      studentId:     (studentId     || '').trim(),
      courseName:    (courseName    || '').trim(),
      degree:        (degree        || '').trim(),
      cgpa:          (cgpa          || '').trim(),
      issueDate:     issueDateNorm,
      institutionId: institution._id.toString(),
    };
    const sha256Hash = generateHash(hashPayload);

    // ── 1. Upload file to Cloudinary (PDF stored as 'raw', image as 'image') ──
    let fileUrl = null, filePublicId = null, fileResourceType = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);
      fileUrl          = result.secure_url;
      filePublicId     = result.public_id;
      fileResourceType = result.resource_type;
    }

    // ── 2. Pin certificate JSON to IPFS via Pinata ────────────────────────────
    const ipfsResult = await pinCertificateToIPFS({
      certificateId: certId, studentName, studentEmail, studentId,
      courseName, degree, cgpa, issueDate: issueDateNorm,
      institutionName: institution.name, sha256Hash,
    });

    // ── 3. Anchor SHA-256 hash on Polygon Amoy blockchain ────────────────────
    const chainResult = await issueOnChain(sha256Hash);

    // Generate QR code
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify/${certId}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 200, margin: 2 });

    const certificate = await Certificate.create({
      certificateId: certId,
      studentName, studentEmail, studentId, courseName, degree, cgpa,
      issueDate:   new Date(issueDate),
      expiryDate:  expiryDate ? new Date(expiryDate) : undefined,
      institution: institution._id,
      institutionName: institution.name,
      issuedBy:    req.user._id,
      sha256Hash,
      ipfsCid:          ipfsResult.cid,
      ipfsGatewayUrl:   ipfsResult.gatewayUrl,
      ipfsSimulated:    ipfsResult.simulated,
      blockchainTxHash:    chainResult.txHash,
      blockchainNetwork:   chainResult.network,
      blockchainSimulated: chainResult.simulated,
      blockNumber:         chainResult.blockNumber,
      fileUrl, filePublicId, fileResourceType,
      qrCodeUrl: qrDataUrl,
    });

    await Institution.findByIdAndUpdate(institution._id, { $inc: { totalIssued: 1 } });
    await ActivityLog.create({
      action: 'CERTIFICATE_ISSUED', performedBy: req.user._id, certificate: certificate._id,
      details: { certId, studentName, fileUrl, ipfsCid: ipfsResult.cid, txHash: chainResult.txHash },
    });

    res.status(201).json({ success: true, data: certificate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/certificates/stats/dashboard
router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    let institutionId = null;
    if (req.user.role === 'institution') {
      const inst = await Institution.findOne({ owner: req.user._id });
      if (inst) institutionId = inst._id;
    }
    const query = institutionId ? { institution: institutionId } : {};
    const [total, active, revoked, recent] = await Promise.all([
      Certificate.countDocuments(query),
      Certificate.countDocuments({ ...query, status: 'active' }),
      Certificate.countDocuments({ ...query, status: 'revoked' }),
      Certificate.find(query).sort({ createdAt: -1 }).limit(5).populate('institution', 'name'),
    ]);
    res.json({ success: true, data: { total, active, revoked, recent } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/certificates/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.id })
      .populate('institution', 'name email website');
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, data: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/certificates/:id/revoke
router.put('/:id/revoke', protect, authorize('institution'), async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.id });
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    cert.status = 'revoked';
    cert.revokedReason = req.body.reason || 'Revoked by institution';
    cert.revokedAt = new Date();
    await cert.save();
    await ActivityLog.create({
      action: 'CERTIFICATE_REVOKED', performedBy: req.user._id, certificate: cert._id,
      details: { reason: cert.revokedReason },
    });
    res.json({ success: true, message: 'Certificate revoked', data: cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
