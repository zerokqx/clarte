import {
  createRootRouteWithContext,
  Outlet,
  useRouteContext,
} from '@tanstack/react-router';
import { MyRouterContext } from '../providers/tanstack-router';
import { z } from 'zod';
import { Loader } from '@mantine/core';

const RouterComponent = () => {
  const context = useRouteContext({ from: '__root__' });
  if (context.authState === 'initial') {
    console.log('LOADER, authState is initial');
    return <Loader size={'lg'} />;
  }
  return <Outlet />;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  validateSearch: z.object({
    location: z.string().optional(),
  }),
  component: RouterComponent,
});
