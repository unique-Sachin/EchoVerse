const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Entry = require('../models/Entry');
const auth = require('../middleware/auth');

// Create a reminder
router.post('/', auth, async (req, res) => {
  try {
    const { entryId, reminderTime } = req.body;
    const userId = req.user._id;

    // Validate entry exists and belongs to user
    const entry = await Entry.findOne({ _id: entryId, user: userId });
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found or not owned by user' });
    }

    const reminder = new Reminder({
      user: userId,
      entry: entryId,
      reminderTime
    });

    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reminder' });
  }
});

// Get all reminders for a user
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id })
      .populate('entry')
      .sort({ reminderTime: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reminders' });
  }
});

// Delete a reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reminder' });
  }
});

module.exports = router; 