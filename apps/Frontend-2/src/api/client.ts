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

let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    console.log('Ответ:', response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Only log actual errors, not expected 503 service unavailable states handled offline
    if (error.response?.status !== 503) {
      console.error('Ошибка:', error.response?.status, error.response?.data);
    }

    const isAuthUrl =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthUrl) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(apiClient(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Попытка обновления токена через /auth/refresh...');
        await apiClient.post('/auth/refresh');
        console.log('Токены успешно обновлены, повторяем запрос:', originalRequest.url);
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Не удалось обновить токен:', refreshError);
        processQueue(refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401 && !isAuthUrl) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);
