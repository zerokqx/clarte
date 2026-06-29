/**
 * Состояние авторизации пользователя в приложении.
 */
export type TAuthState = 'authenticated' | 'initial' | 'anonymous';

/**
 * Интерфейс хранилища авторизации.
 */
export interface IAuthStore {
  status: TAuthState;
  initAuth(): Promise<void>;
  refreshTokens(): Promise<void>;
  setAnonymous(): void;
}
