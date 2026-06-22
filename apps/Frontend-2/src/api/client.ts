import axios from 'axios';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  console.log(
    'Запрос:',
    config.method?.toUpperCase(),
    config.baseURL + config.url,
  );
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('Ответ:', response.status);
    return response;
  },
  (error) => {
    // Only log actual errors, not expected 503 service unavailable states handled offline
    if (error.response?.status !== 503) {
      console.error('Ошибка:', error.response?.status, error.response?.data);
    }
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
