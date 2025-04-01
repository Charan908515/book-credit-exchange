import axios from 'axios';
import { BookType } from '@/types/book';

// This would be an environment variable in production
const API_URL = 'http://localhost:5000/api';

// Sample data for books in case the API fails
const sampleBooks: BookType[] = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genres: ["Fiction", "Classic", "Coming-of-age"],
    condition: "Good",
    creditValue: 2,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2023, 9, 15), // Oct 15, 2023
    readCount: 42,
    ownerId: "demo_user_123" // Added ownerId
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    genres: ["Fiction", "Dystopian", "Classics"],
    condition: "Very Good",
    creditValue: 3,
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=687&auto=format&fit=crop",
    addedAt: new Date(2023, 10, 5), // Nov 5, 2023
    readCount: 29,
    ownerId: "demo_admin_123" // Different user
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genres: ["Romance", "Classic", "Fiction"],
    condition: "Like New",
    creditValue: 4,
    coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=692&auto=format&fit=crop",
    addedAt: new Date(2023, 11, 12), // Dec 12, 2023
    readCount: 15,
    ownerId: "demo_user_123"
  }
];

// Configure axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor to log errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Book API calls
export const bookApi = {
  getAllBooks: async () => {
    try {
      const response = await api.get('/books');
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      // Return sample books if API call fails
      return sampleBooks;
    }
  },
  
  getUserBooks: async (userId: string) => {
    try {
      const response = await api.get(`/books/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user books:', error);
      // Filter sample books by ownerId
      return sampleBooks.filter(book => book.ownerId === userId);
    }
  },
  
  getBook: async (id: string) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching book details:', error);
      // Return a sample book if API call fails
      return sampleBooks.find(book => book.id === id);
    }
  },
  
  addBook: async (bookData: any) => {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error) {
      console.error('Error adding book:', error);
      // Create a new book with a random ID
      const newBook = {
        ...bookData,
        id: 'local_' + Date.now(),
        addedAt: new Date()
      };
      sampleBooks.push(newBook);
      return newBook;
    }
  },
  
  updateBook: async (id: string, bookData: any) => {
    const response = await api.patch(`/books/${id}`, bookData);
    return response.data;
  },
  
  deleteBook: async (id: string) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
  
  incrementReadCount: async (id: string) => {
    const response = await api.post(`/books/${id}/read`);
    return response.data;
  }
};

// User API calls
export const userApi = {
  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  requestOTP: async (email: string) => {
    try {
      const response = await api.post('/users/request-otp', { email });
      return response.data;
    } catch (error) {
      console.log('OTP Request Error:', error);
      // For development/demo purposes, simulate successful OTP sending
      console.log(`OTP for ${email} is: 123456`);
      return { message: 'OTP sent successfully (development mode)' };
    }
  },
  
  verifyOTPAndRegister: async (data: { 
    username: string; 
    email: string; 
    password: string;
    otp: string;
  }) => {
    try {
      const response = await api.post('/users/verify-otp', data);
      return response.data;
    } catch (error) {
      console.log('OTP Verification Error:', error);
      // For development/demo purposes, simulate successful registration if OTP is 123456
      if (data.otp === '123456') {
        console.log('Registered user:', data);
        return { 
          message: 'User registered successfully',
          user: {
            _id: 'demo_' + Date.now(),
            username: data.username,
            email: data.email,
            credits: 5,
            isAdmin: false
          }
        };
      }
      throw new Error('Invalid OTP');
    }
  },
  
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      console.log('Login Error:', error);
      // For development/demo purposes, simulate successful login with test credentials
      if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
        return {
          _id: 'demo_user_123',
          username: 'TestUser',
          email: credentials.email,
          credits: 10,
          isAdmin: false
        };
      }
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        return {
          _id: 'demo_admin_123',
          username: 'AdminUser',
          email: credentials.email,
          credits: 100,
          isAdmin: true
        };
      }
      throw new Error('Invalid credentials');
    }
  },
  
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  updateUser: async (id: string, userData: any) => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
  
  getUserTransactions: async (userId: string) => {
    const response = await api.get(`/users/${userId}/transactions`);
    return response.data;
  }
};

// Transaction API calls
export const transactionApi = {
  exchangeBook: async (requesterId: string, bookId: string) => {
    const response = await api.post('/transactions/exchange', { requesterId, bookId });
    return response.data;
  }
};
