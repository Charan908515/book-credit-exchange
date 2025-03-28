
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a new user
router.post('/', async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password // In a real app, you would hash this password
  });

  try {
    const newUser = await user.save();
    
    // Create initial credits transaction
    const transaction = new Transaction({
      userId: newUser._id,
      type: 'credit',
      amount: 5,
      description: 'Initial signup credits'
    });
    await transaction.save();
    
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      credits: newUser.credits
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
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

module.exports = router;
