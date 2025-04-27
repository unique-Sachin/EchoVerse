const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry',
    required: true
  },
  reminderTime: {
    type: Date,
    required: true
  },
  isSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
ReminderSchema.index({ user: 1, reminderTime: 1 });
ReminderSchema.index({ isSent: 1, reminderTime: 1 });

module.exports = mongoose.model('Reminder', ReminderSchema); 