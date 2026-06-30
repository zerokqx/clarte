import { useNotificationControllerGetUserNotifications } from '@/shared/api/orval';

export const useNotifications = () => {
  return useNotificationControllerGetUserNotifications();
};
