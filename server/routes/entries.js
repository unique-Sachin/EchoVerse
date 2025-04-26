const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');
const { upload } = require('../config/cloudinary');

// Create new entry
router.post('/', auth, upload.single('audio'), async (req, res) => {
  try {
    const { title, mood, unlockAt } = req.body;
    
    const newEntry = new Entry({
      user: req.user.id,
      title,
      audioUrl: req.file.path, // Cloudinary URL
      mood,
      unlockAt
    });

    const entry = await newEntry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all entries for user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    // Update isUnlocked status for each entry
    const currentTime = new Date();
    const updatedEntries = entries.map(entry => {
      const isUnlocked = entry.unlockAt <= currentTime;
      return {
        ...entry.toObject(),
        isUnlocked
      };
    });

    res.json(updatedEntries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get unlocked entries
router.get('/unlocked', auth, async (req, res) => {
  try {
    const entries = await Entry.find({
      user: req.user.id,
      unlockAt: { $lte: Date.now() }
    }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get upcoming entries
router.get('/upcoming', auth, async (req, res) => {
  try {
    const entries = await Entry.find({
      user: req.user.id,
      unlockAt: { $gt: Date.now() }
    }).sort({ unlockAt: 1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete entry
router.delete('/:id', auth, async (req, res) => {
  try {
    let entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    // Check user
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete the audio file from Cloudinary
    const { cloudinary } = require('../config/cloudinary');
    const publicId = entry.audioUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`echoverse/${publicId}`);

    await entry.remove();
    res.json({ msg: 'Entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
