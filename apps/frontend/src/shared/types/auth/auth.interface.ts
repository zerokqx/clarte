export type TAuthState = 'authenticated' | 'initial' | 'anonymous';

export interface IAuthStore {
  status: TAuthState;
  initAuth(): Promise<void>;
  refreshTokens(): Promise<void>
}
