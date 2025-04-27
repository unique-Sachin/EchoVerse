const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Entry = require('../models/Entry');
const auth = require('../middleware/auth');

// Create a reminder
router.post('/', auth, async (req, res) => {
  try {
    const { entryId, reminderTime } = req.body;
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

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
    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Fetching reminders for user:', userId);
    
    const reminders = await Reminder.find({ user: userId })
      .populate('entry')
      .sort({ reminderTime: 1 });

    console.log('Found reminders:', reminders.length);
    console.log('Reminder details:', reminders.map(r => ({
      id: r._id,
      entryId: r.entry?._id,
      reminderTime: r.reminderTime,
      isSent: r.isSent
    })));

    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ message: 'Error fetching reminders' });
  }
});

// Delete a reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Attempting to delete reminder:', {
      reminderId: req.params.id,
      userId: userId
    });

    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: userId
    });

    console.log('Delete result:', reminder ? 'Found and deleted' : 'Not found');

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: 'Error deleting reminder' });
  }
});

module.exports = router; 