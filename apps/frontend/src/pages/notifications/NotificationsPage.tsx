import { Title } from '@mantine/core';
import { NotificationList, useNotificationsFeature } from '@/features/notifications';

export function NotificationsPage() {
  const { notifications, isLoading } = useNotificationsFeature();

  return (
    <>
      <Title order={2} mb="xl">
        Уведомления
      </Title>
      <NotificationList notifications={notifications} isLoading={isLoading} />
    </>
  );
}
