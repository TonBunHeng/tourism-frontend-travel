import axios from 'axios';

const ROOT_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/travel').replace(/\/travel\/?$/, '');

const createApiClient = (subPath) => {
  const client = axios.create({
    baseURL: `${ROOT_API_URL}/${subPath}`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || localStorage.getItem('travel_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
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

  return client;
};

export const api = createApiClient('travel');
export const businessApi = createApiClient('business');
export const guideApi = createApiClient('guide');

export default api;
