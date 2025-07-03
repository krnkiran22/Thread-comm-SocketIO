const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DisputeThread = require('../models/DisputeThread');
const User = require('../models/User');
const Message = require('../models/Message');

// Create a thread (Investor/Issuer)
router.post('/', auth, async (req, res) => {
  if (!['Investor', 'Issuer'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  try {
    // Find the admin user
    const admin = await User.findOne({ role: 'Admin' });
    const participants = [req.user.id];
    if (admin) participants.push(admin._id);

    const thread = new DisputeThread({
      creator: req.user.id,
      status: 'open',
      metadata: req.body.metadata,
      participants
    });
    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// List threads (role-based)
router.get('/', auth, async (req, res) => {
  try {
    let threads;
    if (req.user.role === 'Admin') {
      threads = await DisputeThread.find().populate('creator participants');
    } else {
      threads = await DisputeThread.find({ participants: req.user.id }).populate('creator participants');
    }
    res.json(threads);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get thread by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const thread = await DisputeThread.findById(req.params.id).populate('creator participants');
    if (!thread) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'Admin' && !thread.participants.some(p => p._id.equals(req.user.id))) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(thread);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a thread
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({ thread: req.params.id }).populate('sender', 'email role');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update thread status (Admin only)
router.patch('/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const thread = await DisputeThread.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(thread);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 