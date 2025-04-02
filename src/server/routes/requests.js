
const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Book = require('../models/Book');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get requests where user is the owner (incoming requests)
router.get('/incoming/:userId', async (req, res) => {
  try {
    const requests = await Request.find({ 
      ownerId: req.params.userId,
      status: 'pending'
    })
    .populate('bookId')
    .populate('requesterId', 'username email');
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get requests made by user (outgoing requests)
router.get('/outgoing/:userId', async (req, res) => {
  try {
    const requests = await Request.find({ 
      requesterId: req.params.userId 
    })
    .populate('bookId')
    .populate('ownerId', 'username email');
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new request
router.post('/', async (req, res) => {
  // Check if book exists and is available
  try {
    const book = await Book.findById(req.body.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({
      bookId: req.body.bookId,
      requesterId: req.body.requesterId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists' });
    }

    const request = new Request({
      bookId: req.body.bookId,
      requesterId: req.body.requesterId,
      ownerId: book.ownerId
    });

    const newRequest = await request.save();
    
    // Populate request with book and user details
    const populatedRequest = await Request.findById(newRequest._id)
      .populate('bookId')
      .populate('requesterId', 'username email')
      .populate('ownerId', 'username email');
      
    res.status(201).json(populatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update request status (approve/reject)
router.patch('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (req.body.status) {
      request.status = req.body.status;
    }
    
    if (req.body.meetupDetails) {
      request.meetupDetails = req.body.meetupDetails;
    }

    // If approved, mark book as unavailable
    if (req.body.status === 'approved') {
      await Book.findByIdAndUpdate(request.bookId, { isAvailable: false });
    }

    const updatedRequest = await request.save();
    
    // Populate request with book and user details
    const populatedRequest = await Request.findById(updatedRequest._id)
      .populate('bookId')
      .populate('requesterId', 'username email')
      .populate('ownerId', 'username email');
      
    res.json(populatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cancel a request
router.delete('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Only allow cancellation if status is pending
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel a non-pending request' });
    }
    
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
