/**
 * CLOUDINARY — PDF fix using memoryStorage + upload_stream
 * multer-storage-cloudinary is NOT used because it ignores resource_type
 * and uploads PDFs as images, breaking them. We use upload_stream directly.
 */
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Keep file in RAM — we push to Cloudinary manually with correct resource_type
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF, PNG, JPG allowed'));
  },
});

/**
 * Upload buffer to Cloudinary with correct resource_type:
 *   PDF   → resource_type: 'raw'   (serves as real PDF, not broken image)
 *   image → resource_type: 'image'
 */
function uploadToCloudinary(buffer, mimetype, originalname) {
  const isPdf = mimetype === 'application/pdf';
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'educhain/certificates',
        resource_type: isPdf ? 'raw' : 'image',
        public_id: `cert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        ...(isPdf && { format: 'pdf' }),
        // Force inline delivery so PDFs open in browser instead of downloading
        ...(isPdf && { flags: 'attachment:false' }),
      },
      (error, result) => {
        if (error) return reject(error);
        // For PDFs: transform the secure_url to add fl_inline so browser opens it
        // Cloudinary raw PDFs default to Content-Disposition: attachment (forces download)
        // Adding /fl_inline/ in the URL path switches it to Content-Disposition: inline
        if (isPdf && result.secure_url) {
          result.secure_url = result.secure_url.replace(
            '/raw/upload/',
            '/raw/upload/fl_inline/'
          );
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function deleteFromCloudinary(publicId, resourceType = 'image') {
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
}

module.exports = { cloudinary, upload, uploadToCloudinary, deleteFromCloudinary };
