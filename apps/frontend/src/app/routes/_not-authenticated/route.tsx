import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_not-authenticated')({
  beforeLoad({ context, search }) {
    if (context.authState === 'authenticated'){
      throw redirect({ to: search.location ?? '/' });
    }
  },
  component: () => <Outlet />,
});
