import axios from 'axios';
import { BookType } from '@/types/book';

// This would be an environment variable in production
const API_URL = 'http://localhost:5000/api';

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
      console.log("API books response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  },
  
  getUserBooks: async (userId: string) => {
    try {
      const response = await api.get(`/books/user/${userId}`);
      console.log("User books response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user books:', error);
      return [];
    }
  },
  
  getBook: async (id: string) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching book details:', error);
      return null;
    }
  },
  
  addBook: async (bookData: BookType) => {
    try {
      console.log("Adding book with data:", bookData);
      
      // Ensure book has required properties
      const bookToAdd = {
        ...bookData,
        isAvailable: true,
        addedAt: bookData.addedAt || new Date()
      };
      
      const response = await api.post('/books', bookToAdd);
      console.log("Book added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
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
      // For development/demo purposes only
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
      // For development/demo purposes only
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
      // For development/demo purposes only
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

// Request API calls
export const requestApi = {
  getIncomingRequests: async (userId: string) => {
    try {
      const response = await api.get(`/requests/incoming/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching incoming requests:', error);
      throw error;
    }
  },
  
  getOutgoingRequests: async (userId: string) => {
    try {
      const response = await api.get(`/requests/outgoing/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching outgoing requests:', error);
      throw error;
    }
  },
  
  createRequest: async (bookId: string, requesterId: string) => {
    try {
      const response = await api.post('/requests', { bookId, requesterId });
      return response.data;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },
  
  updateRequest: async (requestId: string, updates: { status?: string, meetupDetails?: string }) => {
    try {
      const response = await api.patch(`/requests/${requestId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  },
  
  cancelRequest: async (requestId: string) => {
    try {
      const response = await api.delete(`/requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling request:', error);
      throw error;
    }
  }
};
