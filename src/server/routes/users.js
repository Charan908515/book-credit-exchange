
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const crypto = require('crypto');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password -otp');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -otp');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request OTP for new registration
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.otp.verified) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP valid for 15 minutes
    
    // In a production app, you would send an email with OTP here
    console.log(`OTP for ${email}: ${otp}`);
    
    // If user exists but not verified, update the OTP
    if (existingUser) {
      existingUser.otp.code = otp;
      existingUser.otp.expiresAt = otpExpiry;
      await existingUser.save();
    } else {
      // Create a temporary user with OTP
      const tempUser = new User({
        username: 'temp_' + Math.random().toString(36).substring(2),
        email,
        password: 'temp_password',
        otp: {
          code: otp,
          expiresAt: otpExpiry,
          verified: false
        }
      });
      await tempUser.save();
    }
    
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify OTP and complete registration
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, username, password, otp } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please request OTP again.' });
    }
    
    // Check OTP
    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // Check OTP expiry
    if (new Date() > new Date(user.otp.expiresAt)) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    
    // Update user information
    user.username = username;
    user.password = password; // In a real app, hash this password
    user.otp.verified = true;
    
    await user.save();
    
    // Create initial credits transaction
    const transaction = new Transaction({
      userId: user._id,
      type: 'credit',
      amount: 5,
      description: 'Initial signup credits'
    });
    await transaction.save();
    
    res.status(201).json({
      message: 'Registration successful'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if user is verified
    if (!user.otp.verified) {
      return res.status(401).json({ message: 'Account not verified. Please complete registration.' });
    }
    
    // Check password
    if (user.password !== password) { // In a real app, use bcrypt.compare
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Return user data without sensitive information
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      credits: user.credits,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user transactions
router.get('/:id/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user
router.patch('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password -otp');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete all user's transactions
    await Transaction.deleteMany({ userId: req.params.id });
    
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
