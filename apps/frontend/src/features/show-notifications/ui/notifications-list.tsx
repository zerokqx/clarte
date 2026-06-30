import { NotificationCard, useNotifications } from '@/entities/notification';

export const NotificationsList = () => {
  const { data: notifications } = useNotifications();
  return notifications?.map((notification) => <NotificationCard data={notification} key={notification.id} />);
};
