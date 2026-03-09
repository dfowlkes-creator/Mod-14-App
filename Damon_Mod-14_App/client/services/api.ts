import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor automatically attaches JWT bearer token to all outgoing requests
 * Token is stored globally after successful login via authService
 */
api.interceptors.request.use(
  (config) => {
    const token = global.authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
