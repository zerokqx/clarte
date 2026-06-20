import { useNotificationControllerGetUserNotifications } from '@/shared/api/generated/notifications/notifications';

export function useNotificationsFeature() {
  const { data: notifications, isLoading } = useNotificationControllerGetUserNotifications();

  return {
    notifications: notifications ?? [],
    isLoading,
  };
}
