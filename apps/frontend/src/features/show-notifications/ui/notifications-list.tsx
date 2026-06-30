import { NotificationCard, useNotifications } from '@/entities/notification';
import { Loader, Flex, Text, Stack } from '@mantine/core';

export const NotificationsList = () => {
  const { data: notifications, isLoading } = useNotifications();

  if (isLoading) {
    return (
      <Flex p="md" justify="center" align="center" w="100%">
        <Loader size="sm" />
      </Flex>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Flex p="md" justify="center" align="center" w="100%">
        <Text size="xs" c="dimmed">Нет новых уведомлений</Text>
      </Flex>
    );
  }

  return (
    <Stack gap={0} w="100%">
      {notifications.map((notification) => (
        <NotificationCard data={notification} key={notification.id} />
      ))}
    </Stack>
  );
};
