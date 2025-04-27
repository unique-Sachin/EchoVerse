const Reminder = require('../models/Reminder');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
    ,
    port: 465,
    host: "smtp.gmail.com"
});

// Function to send reminder email
async function sendReminderEmail(user, entry) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'EchoVerse: Your Memory is Ready!',
            html: `
        <h2>Your Memory is Ready to be Unlocked!</h2>
        <p>Hello ${user.name},</p>
        <p>Your memory titled "${entry.title}" is now ready to be unlocked and listened to.</p>
        <p>Visit EchoVerse to listen to your memory: <a href="${process.env.FRONTEND_URL}/timeline">View Timeline</a></p>
        <p>Best regards,<br>The EchoVerse Team</p>
      `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending reminder email:', error);
        return false;
    }
}

// Function to process pending reminders
async function processReminders() {
    try {
        const now = new Date();
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000); // 5 minutes from now

        // Only get reminders that are due within the next 5 minutes
        const reminders = await Reminder.find({
            reminderTime: { 
                $gte: now,
                $lte: fiveMinutesFromNow
            },
            isSent: false
        }).populate('user').populate('entry');

        // Process reminders in batches of 10
        const batchSize = 10;
        for (let i = 0; i < reminders.length; i += batchSize) {
            const batch = reminders.slice(i, i + batchSize);
            await Promise.all(batch.map(async (reminder) => {
                const emailSent = await sendReminderEmail(reminder.user, reminder.entry);
                if (emailSent) {
                    reminder.isSent = true;
                    await reminder.save();
                }
            }));
        }
    } catch (error) {
        console.error('Error processing reminders:', error);
    }
}

// Schedule reminder processing to run every 5 minutes
function startScheduler() {
    cron.schedule('*/5 * * * *', processReminders);
    console.log('Reminder scheduler started');
}

module.exports = {
    startScheduler
}; 