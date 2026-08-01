import { NotificationsList } from '@/features/show-notifications';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { Box, Center } from '@mantine/core';

export const NotificationsPage = () => {
  return (
    <Center w="100%" py="md">
      <Box w="min(100%, 480px)">
        <NotificationsList />
        <BottomNavigation.SubActions>
          <BottomNavigation.SubActions.Action>dawd</BottomNavigation.SubActions.Action>
        </BottomNavigation.SubActions>
      </Box>
    </Center>
  );
};
