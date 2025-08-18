const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Step 1: Send OTP
router.post('/forgot-password', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    user.otpVerified = false;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}`
    });

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const otp = req.body.otp?.trim();

  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  try {
    const user = await User.findOne({ email });
    if (!user || !user.resetOTP || user.resetOTPExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otpVerified = true;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Step 3: Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const newPassword = req.body?.newPassword?.trim();

    // Validate required fields
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // // Check OTP verification & expiry
    // if (!user.otpVerified) {
    //   return res.status(400).json({ message: 'OTP not verified' });
    // }
    // if (!user.resetOTP || user.resetOTPExpiry < Date.now()) {
    //   return res.status(400).json({ message: 'OTP expired' });
    // }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP data
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    user.otpVerified = false;

    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error in /reset-password:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
