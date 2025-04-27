const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  audioIv: {
    type: String,
    required: true
  },
  encryptedAudio: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  unlockAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isUnlocked: {
    type: Boolean,
    default: false
  }
});

// Index for efficient querying
EntrySchema.index({ user: 1, unlockAt: 1 });
EntrySchema.index({ user: 1, createdAt: 1 });

module.exports = mongoose.model('Entry', EntrySchema);
