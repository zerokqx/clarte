import { setupWorker } from 'msw/browser';
import { getAuthMock } from '../../shared/api/orval/generated/endpoints/auth/auth.msw';
import { getNotificationsMock } from '../../shared/api/orval/generated/endpoints/notifications/notifications.msw';
import { getTodoMock } from '../../shared/api/orval/generated/endpoints/todo/todo.msw';
import { getUserMock } from '../../shared/api/orval/generated/endpoints/user/user.msw';
import { getUserEditMock } from '../../shared/api/orval/generated/endpoints/user-edit/user-edit.msw';
import { getUserStorageMock } from '../../shared/api/orval/generated/endpoints/user-storage/user-storage.msw';

export const worker = setupWorker(
  ...getAuthMock(),
  ...getNotificationsMock(),
  ...getTodoMock(),
  ...getUserMock(),
  ...getUserEditMock(),
  ...getUserStorageMock(),
);
