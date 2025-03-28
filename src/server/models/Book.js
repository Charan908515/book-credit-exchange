
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genres: {
    type: [String],
    default: []
  },
  condition: {
    type: String,
    required: true,
    enum: ['Like New', 'Very Good', 'Good', 'Fair', 'Poor']
  },
  creditValue: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  coverUrl: {
    type: String,
    default: ''
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', bookSchema);
