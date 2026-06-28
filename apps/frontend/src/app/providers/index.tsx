import { ReactNode } from 'react';
import { TanstackQueryProvider } from './tanstack-query';
import { TanstackRouterProvider } from './tanstack-router';
import { MantineProvider } from './mantine';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders() {
  return (
    <TanstackQueryProvider>
      <MantineProvider>
        <TanstackRouterProvider />
      </MantineProvider>
    </TanstackQueryProvider>
  );
}
