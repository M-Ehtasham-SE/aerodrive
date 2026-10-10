import axios from 'axios';

// Smart API URL resolution:
// In production (Render, Vercel, Netlify, custom domain), always connect to live Render backend
// In local development on localhost, allow local backend or configured VITE_API_URL
const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

let resolvedBaseURL = 'https://aerodrive-backend.onrender.com/api';

if (isLocalhost) {
  resolvedBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
} else if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('aerodrive-one.vercel.app') && !import.meta.env.VITE_API_URL.includes('localhost')) {
  resolvedBaseURL = import.meta.env.VITE_API_URL;
}

const instance = axios.create({
  baseURL: resolvedBaseURL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('aerodrive_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;
