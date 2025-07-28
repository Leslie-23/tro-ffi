const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { User } = require('../models/user');

const notificationService = {
    sendEmail: async (to, subject, text) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    },

    sendSMS: async (to, message) => {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        try {
            await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to,
            });
            console.log('SMS sent successfully');
        } catch (error) {
            console.error('Error sending SMS:', error);
        }
    },

    notifyUser: async (userId, message) => {
        try {
            const user = await User.findById(userId);
            if (user) {
                await this.sendEmail(user.email, 'Notification', message);
                await this.sendSMS(user.phone, message);
            }
        } catch (error) {
            console.error('Error notifying user:', error);
        }
    },
};

module.exports = notificationService;