import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { TanstackQueryProvider } from './tanstack-query';
import { TanstackRouterProvider } from './tanstack-router';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <TanstackQueryProvider>
      <TanstackRouterProvider />
      <MantineProvider>{children}</MantineProvider>
    </TanstackQueryProvider>
  );
}
