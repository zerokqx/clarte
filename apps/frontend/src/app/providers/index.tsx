import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { TanstackQueryProvider } from './tanstack-query';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <TanstackQueryProvider>
      <MantineProvider>{children}</MantineProvider>
    </TanstackQueryProvider>
  );
}
