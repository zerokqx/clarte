import { useState } from 'react';
import { authApi } from '../api/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (login: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ login, password });
      console.log('Вход успешен:', response);
      return true;
    } catch (err: any) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        err.response?.data?.details ||
        err.message;

      if (status === 401) {
        setError('Неверный логин или пароль');
      } else if (status === 404) {
        setError('Пользователь не найден');
      } else if (status === 503) {
        setError('Сервис авторизации недоступен. Попробуйте позже.');
      } else {
        setError(message || 'Ошибка входа');
      }
      console.error('Ошибка входа:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (login: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register({ login, password });
      console.log('Регистрация успешна:', response);
      return true;
    } catch (err: any) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        err.response?.data?.details ||
        err.message;

      if (
        status === 409 ||
        message?.includes('already exists') ||
        message?.includes('существует')
      ) {
        setError('Пользователь с таким логином уже существует');
      } else if (status === 400) {
        setError('Неверный формат данных. Проверьте введённые данные.');
      } else if (status === 404) {
        setError('Сервис регистрации недоступен. Попробуйте позже.');
      } else if (status === 500) {
        setError('Внутренняя ошибка сервера. Попробуйте позже.');
      } else if (status === 503) {
        setError('Сервис временно недоступен. Попробуйте позже.');
      } else if (message) {
        setError(message);
      } else {
        setError(
          'Ошибка регистрации. Проверьте введённые данные и попробуйте снова.',
        );
      }
      console.error('Ошибка регистрации:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    document.cookie =
      'jwt_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'jwt_refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  return { login, register, logout, isLoading, error };
};
