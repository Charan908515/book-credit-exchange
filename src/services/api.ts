
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Book API calls
export const bookApi = {
  getAllBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },
  
  getUserBooks: async (userId: string) => {
    const response = await api.get(`/books/user/${userId}`);
    return response.data;
  },
  
  getBook: async (id: string) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },
  
  addBook: async (bookData: any) => {
    const response = await api.post('/books', bookData);
    return response.data;
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
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
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
