
const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
const connectDB = require('./db');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Sample books data
const sampleBooks = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genres: ["Classic", "Fiction", "Drama"],
    condition: "Very Good",
    creditValue: 3,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
    description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
    publishedDate: "1960",
    isAvailable: true,
  },
  {
    title: "1984",
    author: "George Orwell",
    genres: ["Dystopian", "Science Fiction", "Classic"],
    condition: "Good",
    creditValue: 4,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg",
    description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
    publishedDate: "1949",
    isAvailable: true,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genres: ["Classic", "Romance", "Fiction"],
    condition: "Like New",
    creditValue: 5,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg",
    description: "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language.",
    publishedDate: "1813",
    isAvailable: true,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genres: ["Classic", "Fiction", "Literature"],
    condition: "Good",
    creditValue: 3,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
    description: "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    publishedDate: "1925",
    isAvailable: true,
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genres: ["Fantasy", "Young Adult", "Fiction"],
    condition: "Very Good",
    creditValue: 4,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg",
    description: "Harry Potter's life is miserable. His parents are dead and he's stuck with his heartless relatives, who force him to live in a tiny closet under the stairs.",
    publishedDate: "1997",
    isAvailable: true,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genres: ["Fantasy", "Classics", "Fiction"],
    condition: "Fair",
    creditValue: 3,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
    description: "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar.",
    publishedDate: "1937",
    isAvailable: true,
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genres: ["Fiction", "Classics", "Young Adult"],
    condition: "Good",
    creditValue: 2,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg",
    description: "The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield.",
    publishedDate: "1951",
    isAvailable: true,
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    genres: ["Classics", "Science Fiction", "Dystopian"],
    condition: "Good",
    creditValue: 4,
    coverUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1575509280i/5129.jpg",
    description: "Brave New World is a dystopian novel by English author Aldous Huxley, written in 1931 and published in 1932.",
    publishedDate: "1932",
    isAvailable: true,
  }
];

// Function to seed books
const seedBooks = async () => {
  try {
    // Get a sample user to assign as owner
    const user = await User.findOne();
    
    if (!user) {
      console.log('No users found in the database. Please create at least one user before running this script.');
      process.exit(1);
    }
    
    console.log(`Using user ${user.username} (${user._id}) as the book owner.`);
    
    // Delete existing books
    await Book.deleteMany({});
    console.log('Existing books deleted.');
    
    // Add owner ID to each book
    const booksWithOwner = sampleBooks.map(book => ({
      ...book,
      ownerId: user._id
    }));
    
    // Insert books
    await Book.insertMany(booksWithOwner);
    console.log(`${booksWithOwner.length} sample books added successfully.`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedBooks();
