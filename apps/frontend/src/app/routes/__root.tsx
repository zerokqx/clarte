import { createRootRouteWithContext } from '@tanstack/react-router';
import { EventCallable, Store } from 'effector';

export interface MyRouterContext {
  isAuthenticated: boolean;
  notAuthenticated: ()=>void;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({});
