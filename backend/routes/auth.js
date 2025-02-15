const express = require('express');
const router = express.Router();
const User = require('../models/user');
const twilio = require('twilio');
const nodemailer = require('nodemailer');

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper Function to Generate OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

// Route to Send OTP
router.post('/api/auth/send-otp', async (req, res) => {
    const { email, phone } = req.body;

    // Check if either email or phone is provided
    if (!email && !phone) {
        return res.status(400).json({ error: 'Either email or phone is required' });
    }

    let formattedPhone = phone && phone.trim() ? (phone.startsWith('+') ? phone : `+91${phone}`) : null;

    // Validate email format if email is provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const otp = generateOtp();
    const otpExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    console.log('Received email:', email);
    console.log('Received phone:', phone);

    try {
        const query = {};
        if (email) query.email = email;
        if (formattedPhone) query.phone = formattedPhone;

        console.log('Query to find user:', query);

        // Check if a user with the same email or phone exists
        let existingUser = await User.findOne(query);

        if (existingUser) {
            console.log('User exists:', existingUser);

            if (formattedPhone && existingUser.phone !== formattedPhone) {
                existingUser.phone = formattedPhone;
            }

            existingUser.otp = otp;
            existingUser.otpExpires = otpExpires;
            await existingUser.save({ validateModifiedOnly: true });

        } else {
            console.log('Creating new user');
            const newUserData = { email, otp, otpExpires };

            if (formattedPhone) {
                newUserData.phone = formattedPhone;
            }

            existingUser = new User(newUserData);
            await existingUser.save({ validateModifiedOnly: true });

        }

        // Send OTP via email or phone using the helper function
        await sendOtpToUser(existingUser, otp);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Error sending OTP:', err);
        res.status(500).json({ error: 'Error sending OTP' });
    }
});

// Helper function to send OTP to the user
const sendOtpToUser = async (user, otp) => {
    try {
        if (user.email) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Your OTP is:',
                text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
            });
            console.log(`OTP sent to email: ${user.email}`);
        }

        if (user.phone) {
            await twilioClient.messages.create({
                body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: user.phone,
            });
            console.log(`OTP sent to phone: ${user.phone}`);
        }
    } catch (err) {
        console.error('Error sending OTP:', err);
        throw new Error('Error sending OTP');
    }
};

// Route to Verify OTP
router.post('/api/auth/verify-otp', async (req, res) => {
    const { phone, email } = req.body;

    try {
        const query = phone ? { phone } : { email };
        let user = await User.findOne(query);

        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({ phone, email });
        }

        // Generate OTP and set expiry
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        // Use `validateModifiedOnly` to skip unrelated fields
        await user.save({ validateModifiedOnly: true });

        // Send the OTP to user
        // (Use your OTP sending logic here)

        // Respond with user details including user ID
        res.status(200).json({
            message: "OTP sent successfully",
            userDetails: {
                userId: user._id,
                email: user.email,
                phone: user.phone,
                bookings: user.bookings, // Include bookings if relevant
            },
        });
    } catch (err) {
        console.error("Error sending OTP:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;
