import { useNotificationControllerGetUserNotifications } from '@clarte/shared-api/endpoints';

export const useNotifications = () => {
  return useNotificationControllerGetUserNotifications();
};
