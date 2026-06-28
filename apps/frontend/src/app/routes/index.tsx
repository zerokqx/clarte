import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.authState === 'anonymous') throw redirect({ to: '/login', from: '/' });
    if (context.authState === 'authenticated') throw redirect({ to: './c', from: '/' });
  },
});

