const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId:  { type: String, required: true, unique: true },
  studentName:    { type: String, required: true },
  studentEmail:   { type: String, required: true },
  studentId:      { type: String, required: true },
  courseName:     { type: String, required: true },
  degree:         { type: String },
  cgpa:           { type: String },
  issueDate:      { type: Date, required: true },
  expiryDate:     { type: Date },
  institution:    { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true },
  institutionName:{ type: String, required: true },
  issuedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Cryptographic proof
  sha256Hash: { type: String, required: true, unique: true },

  // IPFS
  ipfsCid:        { type: String },
  ipfsGatewayUrl: { type: String },
  ipfsSimulated:  { type: Boolean, default: true },

  // Polygon Amoy blockchain
  blockchainTxHash:    { type: String },
  blockchainNetwork:   { type: String, default: 'Polygon Amoy Testnet' },
  blockchainSimulated: { type: Boolean, default: true },
  blockNumber:         { type: Number },

  // Cloudinary file storage
  fileUrl:          { type: String },
  filePublicId:     { type: String },
  fileResourceType: { type: String },

  // QR code
  qrCodeUrl: { type: String },

  // Status
  status:        { type: String, enum: ['active', 'revoked', 'expired'], default: 'active' },
  revokedReason: { type: String },
  revokedAt:     { type: Date },

  // Stats
  verificationCount: { type: Number, default: 0 },
  lastVerifiedAt:    { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
