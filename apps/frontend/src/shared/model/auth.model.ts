import { COOKIE_NAME } from '@clarte/shared';
import axios, { AxiosResponse } from 'axios';
import { createEvent, createStore, createEffect, sample } from 'effector';
import Cookies from 'js-cookie';

const hasSession = () => Cookies.get(COOKIE_NAME.HAS_SESSION) === '1';

export type TAuthState = 'authenticated' | 'initial' | 'anonymous';

export const $authenticatedStatus = createStore<TAuthState>('initial');
export const appStarted = createEvent();
export const authenticated = createEvent();
export const notAuthenticated = createEvent();

$authenticatedStatus
  .on(authenticated, () => 'authenticated')
  .on(notAuthenticated, () => 'anonymous');

export const checkAuthFx = createEffect<void, void>(async () => {
  await axios.get('/api/auth/check');
});

export const refreshTokensFx = createEffect<void, AxiosResponse>(async () => {
  return await axios.post('/api/auth/refresh');
});

// === ЦЕПОЧКА ИНИЦИАЛИЗАЦИИ ===

// 1. Старт: Если кука есть -> проверяем сессию
sample({
  clock: appStarted,
  filter: hasSession,
  target: checkAuthFx,
});

// 2. Старт: Если куки нет -> заведомо аноним (не ждем бэкенд)
sample({
  clock: appStarted,
  filter: () => !hasSession(),
  target: notAuthenticated,
});

// 3. Проверка успешна -> авторизован
sample({
  clock: checkAuthFx.done,
  target: authenticated,
});

// 4. Проверка упала (например, access-токен протух), но кука сессии на месте -> рефрешим
sample({
  clock: checkAuthFx.fail,
  filter: hasSession,
  target: refreshTokensFx,
});

// 5. Проверка упала И куки уже нет (бэк мог её снести или она пропала) -> аноним
sample({
  clock: checkAuthFx.fail,
  filter: () => !hasSession(),
  target: notAuthenticated,
});

// 6. Рефреш успешен -> восстановили сессию
sample({
  clock: refreshTokensFx.done,
  target: authenticated,
});

// 7. Рефреш упал (сессия сдохла на бэке) -> железно аноним (без фильтров!)
sample({
  clock: refreshTokensFx.fail,
  target: notAuthenticated,
});
