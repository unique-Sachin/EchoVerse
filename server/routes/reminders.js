const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reminder = require('../models/Reminder');
const Entry = require('../models/Entry');

// Create a reminder for an entry
router.post('/', auth, async (req, res) => {
  try {
    const { entryId, reminderTime } = req.body;

    // Validate entry exists and belongs to user
    const entry = await Entry.findOne({
      _id: entryId,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    // Create reminder
    const reminder = new Reminder({
      user: req.user.id,
      entry: entryId,
      reminderTime: new Date(reminderTime)
    });

    await reminder.save();
    res.json(reminder);
  } catch (err) {
    console.error('Error creating reminder:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all reminders for user
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id })
      .populate('entry', 'title unlockAt')
      .sort({ reminderTime: 1 });
    
    res.json(reminders);
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete a reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!reminder) {
      return res.status(404).json({ msg: 'Reminder not found' });
    }

    await Reminder.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Reminder removed' });
  } catch (err) {
    console.error('Error deleting reminder:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router; 