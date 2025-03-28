
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Book = require('../models/Book');
const mongoose = require('mongoose');

// Process a book exchange
router.post('/exchange', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { requesterId, bookId } = req.body;
    
    // Get book details
    const book = await Book.findById(bookId).session(session);
    if (!book) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (!book.isAvailable) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Book is not available for exchange' });
    }
    
    // Get users
    const requester = await User.findById(requesterId).session(session);
    const owner = await User.findById(book.ownerId).session(session);
    
    if (!requester || !owner) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if requester has enough credits
    if (requester.credits < book.creditValue) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Not enough credits' });
    }
    
    // Update book
    book.isAvailable = false;
    await book.save({ session });
    
    // Update credits
    requester.credits -= book.creditValue;
    owner.credits += book.creditValue;
    
    await requester.save({ session });
    await owner.save({ session });
    
    // Create transactions
    const requesterTransaction = new Transaction({
      userId: requesterId,
      bookId: bookId,
      type: 'debit',
      amount: book.creditValue,
      description: `Exchanged book: ${book.title}`
    });
    
    const ownerTransaction = new Transaction({
      userId: book.ownerId,
      bookId: bookId,
      type: 'credit',
      amount: book.creditValue,
      description: `Book exchanged: ${book.title}`
    });
    
    await requesterTransaction.save({ session });
    await ownerTransaction.save({ session });
    
    await session.commitTransaction();
    
    res.status(200).json({ 
      message: 'Book exchange successful',
      requesterCredits: requester.credits,
      ownerCredits: owner.credits
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
