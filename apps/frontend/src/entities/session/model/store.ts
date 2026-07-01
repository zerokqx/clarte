import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import Cookies from 'js-cookie';
import { COOKIE_NAME } from '@clarte/shared';
import { IAuthStore, TAuthState } from './types';

/**
 * Стор MobX для управления состоянием авторизации пользователя.
 * Инкапсулирует бизнес-логику проверки сессии, обновления токенов доступа
 * и хранения текущего статуса авторизации.
 */
class AuthStore implements IAuthStore {
  /**
   * Текущий статус авторизации.
   */
  status: TAuthState = 'initial';

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Возвращает true, если в куках присутствует флаг активной сессии.
   */
  private get hasSession(): boolean {
    return Cookies.get(COOKIE_NAME.HAS_SESSION) === '1';
  }

  /**
   * Инициализирует сессию пользователя при старте приложения.
   * Оптимизирует загрузку: если кука активной сессии отсутствует,
   * мгновенно переводит статус в `anonymous` без отправки сетевых запросов.
   * Если сессия есть, проверяет её актуальность и автоматически запускает
   * обновление токенов в случае ошибки проверки (например, при истечении access-токена).
   */
  async initAuth() {
    if (!this.hasSession) {
      this.status = 'anonymous';
      console.log(1)
      return;
    }

    try {
      await axios.get('/api/auth/check');
      runInAction(() => {
        this.status = 'authenticated';
      });
    } catch {
      if (this.hasSession) {
        await this.refreshTokens();
      } else {
        runInAction(() => {
          this.status = 'anonymous';
        });
      }
    }
  }

  /**
   * Обновляет токены доступа на бэкенде.
   * При успешном обновлении статус пользователя устанавливается в `authenticated`.
   * В случае провала (например, если сессия на сервере аннулирована)
   * переводит статус в `anonymous` и пробрасывает ошибку для обработки.
   *
   * @throws Пробрасывает ошибку сетевого запроса, если обновление токенов не удалось.
   */
  async refreshTokens() {
    try {
      await axios.post('/api/auth/refresh');
      runInAction(() => {
        this.status = 'authenticated';
      });
    } catch (error) {
      runInAction(() => {
        this.status = 'anonymous';
      });
      throw error;
    }
  }

  /**
   * Сбрасывает статус авторизации на анонимный.
   */
  setAnonymous() {
    this.status = 'anonymous';
  }

  /**
   * Устанавливает статус авторизации как успешный.
   */
  setAuthenticated() {
    this.status = 'authenticated';
  }
}

/**
 * Глобальный экземпляр хранилища авторизации (Singleton).
 */
export const authStore = new AuthStore();


