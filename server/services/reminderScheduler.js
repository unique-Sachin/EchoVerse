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
    },
    tls: {
        rejectUnauthorized: false
    },
    secure: true,
    port: 465,
    host: 'smtp.gmail.com'
});

// Function to send reminder email
async function sendReminderEmail(user, entry) {
    try {
        const mailOptions = {
            from: `"EchoVerse" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'EchoVerse: Your Memory is Ready!',
            text: `Hello ${user.name},\n\nYour memory titled "${entry.title}" is now ready to be unlocked and listened to.\n\nVisit EchoVerse to listen to your memory: ${process.env.FRONTEND_URL}/timeline\n\nBest regards,\nThe EchoVerse Team`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Your Memory is Ready to be Unlocked!</h2>
          <p>Hello ${user.name},</p>
          <p>Your memory titled <strong>"${entry.title}"</strong> is now ready to be unlocked and listened to.</p>
          <div style="margin: 20px 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/timeline" 
               style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Your Memory
            </a>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Best regards,<br>
            The EchoVerse Team
          </p>
        </div>
      `,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
                'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
                'Precedence': 'bulk'
            }
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
}

// Function to process pending reminders
async function processReminders() {
    try {
        const now = new Date();
        const oneMinuteFromNow = new Date(now.getTime() + 60 * 1000);

        const reminders = await Reminder.find({
            reminderTime: { 
                $lte: oneMinuteFromNow
            },
            isSent: false
        }).populate('user').populate('entry');

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
        // Silently handle errors
    }
}

// Schedule reminder processing to run every minute
function startScheduler() {
    cron.schedule('* * * * *', processReminders);
}

module.exports = {
    startScheduler
}; 