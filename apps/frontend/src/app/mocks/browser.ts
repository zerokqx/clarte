import { setupWorker } from 'msw/browser';
import { getAuthMock } from '@clarte/shared-api/endpoints/auth/auth.msw';
import { getNotificationsMock } from '@clarte/shared-api/endpoints/notifications/notifications.msw';
import { getTodoMock } from '@clarte/shared-api/endpoints/todo/todo.msw';
import { getUserMock } from '@clarte/shared-api/endpoints/user/user.msw';
import { getUserEditMock } from '@clarte/shared-api/endpoints/user-edit/user-edit.msw';
import { getUserStorageMock } from '@clarte/shared-api/endpoints/user-storage/user-storage.msw';

export const worker = setupWorker(
  ...getAuthMock(),
  ...getNotificationsMock(),
  ...getTodoMock(),
  ...getUserMock(),
  ...getUserEditMock(),
  ...getUserStorageMock(),
);
