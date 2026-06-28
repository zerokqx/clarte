import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    switch (context.authState) {
      case 'anonymous':
        throw redirect({ to: '/login', from: '/' });
      case 'authenticated':
        throw redirect({ to: './c', from: '/' });
    }
  },
});
