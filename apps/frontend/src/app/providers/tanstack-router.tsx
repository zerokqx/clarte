import { useUnit } from 'effector-react';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/app/route-tree.gen';
import { $isAuthenticated, notAuthenticated } from '@/shared/model';

const router = createRouter({
  routeTree,
  context: {
    isAuthenticated: undefined!,
    notAuthenticated: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const TanstackRouterProvider = () => {
  const [isAuthenticated, notAuthenticatedCallback] = useUnit([$isAuthenticated, notAuthenticated]);
  return (
    <RouterProvider
      router={router}
      context={{
        isAuthenticated,
        notAuthenticated: notAuthenticatedCallback,
      }}
    />
  );
};
