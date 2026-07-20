/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react-lite';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/app/route-tree.gen';
import { authStore, TAuthState } from '@/entities/session';
import { useEffect } from 'react';
import { Center, Loader } from '@mantine/core';

export interface MyRouterContext {
  authState: TAuthState;
  notAuthenticated: () => void;
}

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <Center>
      <Loader size="xs" />
    </Center>
  ),

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

export const TanstackRouterProvider = observer(() => {
  const authState = authStore.status;

  const notAuthenticatedCallback = () => {
    authStore.setAnonymous();
  };

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
});
