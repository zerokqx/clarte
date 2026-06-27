import axios, { AxiosResponse } from 'axios';
import { createEvent, createStore, createEffect, sample } from 'effector';
import { persist } from 'effector-storage/local';
import { attachLogger } from 'effector-logger';

export const $isAuthenticated = createStore<boolean>(false);

export const authenticated = createEvent();
export const notAuthenticated = createEvent();

$isAuthenticated.on(authenticated, () => true).on(notAuthenticated, () => false);

persist({ store: $isAuthenticated, key: 'auth' });

export const refreshTokensFx = createEffect<() => Promise<AxiosResponse>>(async () => {
  const response = await axios.post('/api/auth/refresh');
  return response;
});

const redirectFx = createEffect((url: string) => {
  window.location.href = url;
});

sample({
  clock: authenticated,
  fn: () => '/',
  target: redirectFx,
});

attachLogger();
