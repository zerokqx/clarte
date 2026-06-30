import { NotificationsPage } from '@/pages/notifications';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/c/notifications')({
  component: NotificationsPage,
});
