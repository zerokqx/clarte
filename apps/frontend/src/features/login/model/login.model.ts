import { authenticated } from '@/shared/model';
import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';

export const $lastLogin = createStore<string>('');
export const loginSuccesed = createEvent();
export const lastLoginChanged = createEvent<string>();

persist({ store: $lastLogin, key: 'last-login' });

sample({ clock: lastLoginChanged, target: $lastLogin });

sample({
  clock: loginSuccesed,
  target: authenticated,
});
