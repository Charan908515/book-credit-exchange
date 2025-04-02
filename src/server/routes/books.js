
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');

// Get all available books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ isAvailable: true });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's books
router.get('/user/:userId', async (req, res) => {
  try {
    const books = await Book.find({ ownerId: req.params.userId });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new book
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genres: req.body.genres,
    condition: req.body.condition,
    creditValue: req.body.creditValue,
    coverUrl: req.body.coverUrl,
    ownerId: req.body.ownerId,
    description: req.body.description || '',
    publishedDate: req.body.publishedDate || '',
    readCount: 0,
    isAvailable: true
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a book
router.patch('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (req.body.title) book.title = req.body.title;
    if (req.body.author) book.author = req.body.author;
    if (req.body.genres) book.genres = req.body.genres;
    if (req.body.condition) book.condition = req.body.condition;
    if (req.body.creditValue) book.creditValue = req.body.creditValue;
    if (req.body.coverUrl) book.coverUrl = req.body.coverUrl;
    if (req.body.isAvailable !== undefined) book.isAvailable = req.body.isAvailable;
    if (req.body.readCount !== undefined) book.readCount = req.body.readCount;
    if (req.body.description) book.description = req.body.description;
    if (req.body.publishedDate) book.publishedDate = req.body.publishedDate;
    
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Increment read count for a book
router.post('/:id/read', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    book.readCount += 1;
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
