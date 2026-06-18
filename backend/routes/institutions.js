const express = require('express');
const router = express.Router();
const Institution = require('../models/Institution');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/institutions/me
router.get('/me', protect, authorize('institution'), async (req, res) => {
  try {
    const inst = await Institution.findOne({ owner: req.user._id });
    if (!inst) return res.status(404).json({ success: false, message: 'Institution not found' });
    res.json({ success: true, data: inst });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/institutions/me - Update institution info
router.put('/me', protect, authorize('institution'), async (req, res) => {
  try {
    const inst = await Institution.findOneAndUpdate(
      { owner: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: inst });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
