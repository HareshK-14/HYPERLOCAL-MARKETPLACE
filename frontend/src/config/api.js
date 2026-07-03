// Central API base URL
// In development: uses http://localhost:5000
// In production: uses VITE_API_URL env variable set on Vercel
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
