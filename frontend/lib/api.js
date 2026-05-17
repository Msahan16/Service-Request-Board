import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const jobsAPI = {
  // Get all jobs with optional filters
  getAllJobs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`${API_URL}/api/jobs?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single job
  getJobById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new job (requires authentication)
  createJob: async (jobData) => {
    try {
      const response = await axios.post(`${API_URL}/api/jobs`, jobData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update job status
  updateJobStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_URL}/api/jobs/${id}`, { status }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete job (requires authentication)
  deleteJob: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/jobs/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Auth API endpoints
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return getAuthToken() !== null;
  },

  // Get current user
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
};

