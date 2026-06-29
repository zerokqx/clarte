import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import Cookies from 'js-cookie';
import { COOKIE_NAME } from '@clarte/shared';

export type TAuthState = 'authenticated' | 'initial' | 'anonymous';

class AuthStore {
  status: TAuthState = 'initial';

  constructor() {
    makeAutoObservable(this);
  }

  private get hasSession(): boolean {
    return Cookies.get(COOKIE_NAME.HAS_SESSION) === '1';
  }

  async initAuth() {
    if (!this.hasSession) {
      this.status = 'anonymous';
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
}

export const authStore = new AuthStore();
