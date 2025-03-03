import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Interceptor para incluir token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  console.log('[Interceptor] Token enviado:', token?.slice(0, 15) + '...'); // Log parcial do token
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('Requisição sem token de autenticação');
  }
  return config;
});

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('tokenExpiration');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;