import { makePersistable, isHydrated } from 'mobx-persist-store';
import { makeAutoObservable } from 'mobx';

/**
 * Стор MobX для управления состоянием логина.
 * Сохраняет имя последнего успешно вошедшего пользователя в localStorage.
 */
class LoginStore {
  lastLogin = '';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'LoginStore',
      properties: ['lastLogin'],
      storage: window.localStorage,
    });
  }
  get isReady() {
    return isHydrated(this);
  }

  /**
   * Обновляет имя последнего вошедшего пользователя.
   */
  setLastLogin(login: string) {
    this.lastLogin = login;
    localStorage.setItem('last-login', login);
  }
}

export const loginStore = new LoginStore();
