import axios from 'axios';

// Default to live working Render backend everywhere (localhost, Render, Vercel)
// unless explicitly overridden by an active VITE_API_URL
const defaultBaseURL = 'https://aerodrive-backend.onrender.com/api';
const configuredURL = import.meta.env.VITE_API_URL;

const baseURL = (configuredURL && !configuredURL.includes('aerodrive-one.vercel.app'))
  ? configuredURL
  : defaultBaseURL;

const instance = axios.create({
  baseURL,
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
