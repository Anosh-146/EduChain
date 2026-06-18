/**
 * RUN THIS ONCE to fix all certificates issued before the hash normalisation fix.
 * Usage:  node scripts/rehash-certificates.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const crypto = require('crypto');
const Certificate = require('../models/Certificate');

const generateHash = (data) => crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');

async function rehash() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const certs = await Certificate.find({});
  console.log(`Found ${certs.length} certificate(s) to check\n`);

  let fixed = 0;

  for (const cert of certs) {
    const payload = {
      certId:        cert.certificateId,
      studentName:   (cert.studentName  || '').trim(),
      studentEmail:  (cert.studentEmail || '').trim().toLowerCase(),
      studentId:     (cert.studentId    || '').trim(),
      courseName:    (cert.courseName   || '').trim(),
      degree:        (cert.degree       || '').trim(),
      cgpa:          (cert.cgpa         || '').trim(),
      issueDate:     new Date(cert.issueDate).toISOString(),
      institutionId: cert.institution.toString(),
    };

    const correctHash = generateHash(payload);

    if (cert.sha256Hash !== correctHash) {
      cert.sha256Hash = correctHash;
      await cert.save();
      console.log(`🔧 Fixed: ${cert.certificateId} — ${cert.studentName}`);
      fixed++;
    } else {
      console.log(`✓  OK:    ${cert.certificateId} — ${cert.studentName}`);
    }
  }

  console.log(`\n🎉 Done. ${fixed} certificate(s) rehashed.`);
  await mongoose.disconnect();
}

rehash().catch(err => { console.error('Error:', err.message); process.exit(1); });
