import { authenticated, notAuthenticated, refreshTokensFx } from '@/shared/model';
import Axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  HttpStatusCode,
} from 'axios';

// Кастомное расширение типа конфига для поддержки флага повтора
interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const AXIOS_INSTANCE = Axios.create({
  baseURL: '',
  withCredentials: true, // Важно, если рефреш/аксесс токен сидят в куках
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

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
      // Если прямо сейчас КТО-ТО ДРУГОЙ уже обновляет токен
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Перед повторным вызовом убеждаемся, что флаг взведен
            originalRequest._retry = true;
            // Если токены в Headers, здесь нужно заново прописать:
            // originalRequest.headers.Authorization = `Bearer ${getFreshToken()}`;
            return AXIOS_INSTANCE(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Если мы — первый запрос, который поймал 401. Начинаем процесс рефреша
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Запускаем эффект Effector для обновления токенов
        await refreshTokensFx();

        // Переводим стейт в авторизованный
        authenticated();

        // Пропускаем всю очередь накопившихся запросов
        processQueue(null);

        // Повторяем наш текущий (первый) запрос
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        // Если рефреш сдох — сбрасываем авторизацию в Effector
        notAuthenticated();

        // Отклоняем всю очередь запросов со звуком боли
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
