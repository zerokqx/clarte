import { useUnit } from 'effector-react';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/app/route-tree.gen';
import { $authenticatedStatus, notAuthenticated, TAuthState } from '@/shared/model';
import { useEffect } from 'react';

export interface MyRouterContext {
  authState: TAuthState;
  notAuthenticated: () => void;
}

const router = createRouter({
  routeTree,
  context: {
    authState: undefined!,
    notAuthenticated: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const TanstackRouterProvider = () => {
  const [authState, notAuthenticatedCallback] = useUnit([$authenticatedStatus, notAuthenticated]);

  useEffect(() => {
    router.invalidate();
  }, [authState]);

  return (
    <RouterProvider
      router={router}
      context={{
        authState,
        notAuthenticated: notAuthenticatedCallback,
      }}
    />
  );
};
