import { authStore } from '@/entities/session';
import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';

export const $lastLogin = createStore<string>('');
export const loginSuccesed = createEvent();
export const lastLoginChanged = createEvent<string>();

persist({ store: $lastLogin, key: 'last-login' });

sample({ clock: lastLoginChanged, target: $lastLogin });

loginSuccesed.watch(() => {
  authStore.status = 'authenticated';
});

