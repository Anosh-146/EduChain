const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  website: { type: String },
  logoUrl: { type: String },
  isVerified: { type: Boolean, default: false },
  totalIssued: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Institution', institutionSchema);
