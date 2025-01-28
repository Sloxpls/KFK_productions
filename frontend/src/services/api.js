import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token') || ''
  }
});

// Add request interceptor to include token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Authentication
  login: (credentials) => api.post('/login', credentials),
  validateToken: () => api.get('/validate'),

  // Existing API calls...
  getSongs: () => api.get('/songs'),
  // ... rest of your existing methods
};