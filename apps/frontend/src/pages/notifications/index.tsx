import { NotificationsList } from '@/features/show-notifications';
import { Box, Center } from '@mantine/core';

export const NotificationsPage = () => {
  return (
    <Center w="100%" py="md">
      <Box w="min(100%, 480px)">
        <NotificationsList />
      </Box>
    </Center>
  );
};
