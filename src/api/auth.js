import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const register = (formData) => API.post('/auth/register', formData);
export const login = (formData) => API.post('/auth/login', formData);

export const getCurrentUser = () =>
  API.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });