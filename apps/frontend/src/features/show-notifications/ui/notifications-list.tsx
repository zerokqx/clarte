import { NotificationCard, useNotifications } from '@/entities/notification';
import { Loader, Flex, Text } from '@mantine/core';

export const NotificationsList = () => {
  const { data: notifications, isLoading } = useNotifications();

  if (isLoading) {
    return (
      <Flex p="md" justify="center" align="center">
        <Loader size="sm" />
      </Flex>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Flex p="md" justify="center" align="center">
        <Text size="xs" c="dimmed">Нет новых уведомлений</Text>
      </Flex>
    );
  }

  return notifications.map((notification) => (
    <NotificationCard data={notification} key={notification.id} />
  ));
};
