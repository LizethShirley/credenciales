import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true, // si usas cookies
});

export const login = (data) => api.post('/login', data);
export const getSuscribers = () => api.get('/suscribers');

export default api;
