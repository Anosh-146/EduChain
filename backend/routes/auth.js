const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Institution = require('../models/Institution');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// @POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, institutionName, studentId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, role, studentId });

    // If institution role, always create institution record
    if (role === 'institution') {
      const inst = await Institution.create({ name: institutionName || name, email, owner: user._id });
      user.institution = inst._id;
      await user.save();
    }

    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Provide email and password' });

    const user = await User.findOne({ email }).populate('institution');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        studentId: user.studentId,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).populate('institution').select('-password');
  res.json({ success: true, user });
});

module.exports = router;

// @POST /api/auth/repair-institution — fixes existing institution accounts missing Institution record
const { protect: protectMiddleware } = require('../middleware/auth');
router.post('/repair-institution', protectMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'institution') return res.status(403).json({ success: false, message: 'Only for institution accounts' });
    let inst = await Institution.findOne({ owner: req.user._id });
    if (inst) return res.json({ success: true, message: 'Institution record already exists', data: inst });
    inst = await Institution.create({ name: req.body.institutionName || req.user.name, email: req.user.email, owner: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { institution: inst._id });
    res.json({ success: true, message: 'Institution record created', data: inst });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
