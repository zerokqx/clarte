import Axios, { InternalAxiosRequestConfig, AxiosError, HttpStatusCode } from 'axios';

// Кастомное расширение типа конфига для поддержки флага повтора
interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const AXIOS_INSTANCE = Axios.create({
  baseURL: '',
  withCredentials: true, // Важно, так как рефреш/аксесс токен сидят в куках
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

// Обработчик обновления токенов, внедряемый извне
let refreshTokensHandler: (() => Promise<void>) | null = null;

/**
 * Инициализирует перехватчики (interceptors) для Axios, внедряя функцию обновления токена.
 * Позволяет избежать зависимости low-level слоя shared от high-level слоя entities.
 */
export const setupAxiosInterceptors = (onUnauthorized: () => Promise<void>) => {
  refreshTokensHandler = onUnauthorized;
};

// Очистка очереди запросов
const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null);
    }
  });
  failedQueue = [];
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;

    // Если бэк вернул 401 и этот запрос еще не пытался повториться
    if (
      error.response?.status === HttpStatusCode.Unauthorized &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // Если прямо сейчас КТО-ТО ДРУГОЙ уже обновляет токен через MobX / Axios
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Перед повторным вызовом убеждаемся, что флаг взведен
            originalRequest._retry = true;
            return AXIOS_INSTANCE(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Если мы — первый запрос, который поймал 401. Начинаем процесс рефреша
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (refreshTokensHandler) {
          await refreshTokensHandler();
        } else {
          throw new Error('Refresh token handler is not initialized');
        }

        processQueue(null);

        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Хелпер-функция для Orval
export const customInstance = <T>(
  config: CustomRequestConfig,
  options?: CustomRequestConfig,
): Promise<T> => {
  return AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
