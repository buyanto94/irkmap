import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage/pinia if needed
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response) {
      if (error.response.status === 401) {
        // Redirect to login or refresh token
        console.warn('Unauthorized. Please login.');
      } else if (error.response.status >= 500) {
        console.error('Server Error');
      }
    } else {
      console.error('Network Error');
    }
    return Promise.reject(error);
  }
);
