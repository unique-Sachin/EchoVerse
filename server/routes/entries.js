const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');
const { upload, cloudinary } = require('../config/cloudinary');
const { encryptAudio, decryptAudio } = require('../utils/audioEncryption');
const https = require('https');

// Create new entry
router.post('/', auth, upload.single('audio'), async (req, res) => {
  try {
    const { title, mood, unlockAt } = req.body;
    
    // Validate required fields
    if (!title || !mood || !unlockAt) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No audio file provided' });
    }

    // Parse and validate the unlock date
    const unlockDate = new Date(unlockAt);
    if (isNaN(unlockDate.getTime())) {
      return res.status(400).json({ msg: 'Invalid unlock date' });
    }

    // Download the file from Cloudinary
    const audioUrl = req.file.path;
    const audioBuffer = await new Promise((resolve, reject) => {
      https.get(audioUrl, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      });
    });
    
    // Encrypt the audio file
    const encryptedAudio = encryptAudio(audioBuffer);
    
    const newEntry = new Entry({
      user: req.user.id,
      title: title.trim(),
      audioUrl: audioUrl, // Cloudinary URL
      audioIv: encryptedAudio.iv, // Store IV for decryption
      encryptedAudio: encryptedAudio.encryptedData, // Store encrypted audio data
      mood: decodeURIComponent(mood), // Decode the emoji
      unlockAt: unlockDate
    });

    const entry = await newEntry.save();
    res.json(entry);
  } catch (err) {
    console.error('Error creating entry:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Secure audio streaming endpoint
router.get('/audio/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    // Check user authorization
    if (entry.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Check if entry is unlocked
    if (entry.unlockAt > Date.now()) {
      return res.status(403).json({ msg: 'Entry is still locked' });
    }

    // Decrypt the audio
    const decryptedAudio = decryptAudio(entry.encryptedAudio, entry.audioIv);

    // Set appropriate headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline');
    res.send(decryptedAudio);
  } catch (err) {
    console.error('Error streaming audio:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
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
