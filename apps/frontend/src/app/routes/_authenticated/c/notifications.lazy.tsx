import { NotificationsPage } from '@/pages/notifications';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/c/notifications')({
  component: NotificationsPage,
});
