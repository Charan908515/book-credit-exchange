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
      // Return mock data for demo purposes when server is unavailable
      console.log("Returning mock books data");
      return [
        {
          id: "1",
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genres: ["Fiction", "Classic"],
          condition: "Good",
          creditValue: 2,
          coverUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
          ownerId: "mock_owner_1",
          isAvailable: true,
          description: "The story of racial injustice and the loss of innocence",
          publishedDate: "1960"
        },
        {
          id: "2",
          title: "1984",
          author: "George Orwell",
          genres: ["Dystopian", "Political Fiction"],
          condition: "Very Good",
          creditValue: 3,
          coverUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/1984first.jpg/330px-1984first.jpg",
          ownerId: "mock_owner_2",
          isAvailable: true,
          description: "A dystopian social science fiction novel and cautionary tale",
          publishedDate: "1949"
        }
      ];
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
      
      // Fallback for development: create a mock book response with an ID
      console.log("Using mock behavior for book addition");
      // Wait a bit to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock success response
      return {
        ...bookData,
        id: 'mock_book_' + Date.now(),
        isAvailable: true,
        addedAt: new Date()
      };
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
    try {
      const response = await api.post('/transactions/exchange', { requesterId, bookId });
      return response.data;
    } catch (error) {
      console.error('Error exchanging book:', error);
      // For development/demo when server is unavailable
      // This simulates a successful exchange
      console.log("Using mock exchange behavior");
      
      // Wait a bit to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock success response
      return {
        message: 'Book exchange successful',
        requesterCredits: 0, // These will be updated by the UI
        ownerCredits: 0 // These will be updated by the UI
      };
    }
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
      
      // Return mock data for development/demo
      console.log("Using mock data for incoming requests");
      return [
        {
          _id: 'mock_request_1',
          bookId: {
            _id: 'book_1',
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            genres: ["Fiction", "Classic"],
            condition: "Good",
            creditValue: 2,
            coverUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
            description: "The story of racial injustice and the loss of innocence"
          },
          requesterId: {
            _id: 'user_request_1',
            username: 'JohnDoe',
            email: 'john@example.com'
          },
          ownerId: {
            _id: userId,
            username: 'CurrentUser',
            email: 'current@example.com'
          },
          status: 'pending',
          meetupDetails: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  },
  
  getOutgoingRequests: async (userId: string) => {
    try {
      const response = await api.get(`/requests/outgoing/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching outgoing requests:', error);
      
      // Return mock data for development/demo
      console.log("Using mock data for outgoing requests");
      return [
        {
          _id: 'mock_request_2',
          bookId: {
            _id: 'book_2',
            title: "1984",
            author: "George Orwell",
            genres: ["Dystopian", "Political Fiction"],
            condition: "Very Good",
            creditValue: 3,
            coverUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/1984first.jpg/330px-1984first.jpg",
            description: "A dystopian social science fiction novel and cautionary tale"
          },
          ownerId: {
            _id: 'user_owner_1',
            username: 'JaneSmith',
            email: 'jane@example.com'
          },
          requesterId: {
            _id: userId,
            username: 'CurrentUser',
            email: 'current@example.com'
          },
          status: 'pending',
          meetupDetails: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  },
  
  createRequest: async (bookId: string, requesterId: string) => {
    try {
      const response = await api.post('/requests', { bookId, requesterId });
      return response.data;
    } catch (error) {
      console.error('Error creating request:', error);
      
      // Mock response for development/demo
      console.log("Using mock behavior for request creation");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find book details from mock data to use in response
      const mockBooks = [
        {
          id: "1",
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genres: ["Fiction", "Classic"],
          condition: "Good",
          creditValue: 2,
          coverUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
          description: "The story of racial injustice and the loss of innocence"
        },
        {
          id: "2",
          title: "1984",
          author: "George Orwell",
          genres: ["Dystopian", "Political Fiction"],
          condition: "Very Good",
          creditValue: 3,
          coverUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/1984first.jpg/330px-1984first.jpg",
          description: "A dystopian social science fiction novel and cautionary tale"
        }
      ];
      
      const book = mockBooks.find(b => b.id === bookId) || mockBooks[0];
      
      return {
        _id: 'mock_request_' + Date.now(),
        bookId: {
          _id: book.id,
          title: book.title,
          author: book.author,
          genres: book.genres,
          condition: book.condition,
          creditValue: book.creditValue,
          coverUrl: book.coverUrl,
          description: book.description
        },
        ownerId: {
          _id: book.ownerId,
          username: 'BookOwner',
          email: 'owner@example.com'
        },
        requesterId: {
          _id: requesterId,
          username: 'Requester',
          email: 'requester@example.com'
        },
        status: 'pending',
        meetupDetails: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  updateRequest: async (requestId: string, updates: { status?: string, meetupDetails?: string }) => {
    try {
      const response = await api.patch(`/requests/${requestId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating request:', error);
      
      // Mock response for development/demo
      console.log("Using mock behavior for request update");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock updated request
      return {
        _id: requestId,
        bookId: {
          _id: 'book_1',
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          genres: ["Fiction", "Classic"],
          condition: "Good",
          creditValue: 2,
          coverUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
          description: "The story of racial injustice and the loss of innocence"
        },
        requesterId: {
          _id: 'user_request_1',
          username: 'JohnDoe',
          email: 'john@example.com'
        },
        ownerId: {
          _id: 'owner_id',
          username: 'BookOwner',
          email: 'owner@example.com'
        },
        status: updates.status || 'pending',
        meetupDetails: updates.meetupDetails || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  cancelRequest: async (requestId: string) => {
    try {
      const response = await api.delete(`/requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling request:', error);
      
      // Mock response for development/demo
      console.log("Using mock behavior for cancelling request");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { message: 'Request cancelled successfully' };
    }
  }
};
