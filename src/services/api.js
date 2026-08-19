import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/travel';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor to attach Bearer Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || localStorage.getItem('travel_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for standard response data handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('travel_token');
      localStorage.removeItem('travel_user');
      window.dispatchEvent(new Event('user-profile-updated'));
    }
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const errors = error.response?.data?.errors || null;
    return Promise.reject({ message, errors, status: error.response?.status, raw: error });
  }
);

export default api;
