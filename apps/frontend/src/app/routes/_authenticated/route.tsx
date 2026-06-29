import { Header } from '@/widgets/header';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad({ context }) {
    if (context.authState === 'anonymous')
      throw redirect({ to: '/login', search: { location: window.location.pathname } });
  },

  component: () => <Outlet />,
});
