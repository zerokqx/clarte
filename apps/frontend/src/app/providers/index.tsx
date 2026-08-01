import { TanstackQueryProvider } from './tanstack-query';
import { TanstackRouterProvider } from './tanstack-router';
import { MantineProvider } from './mantine';

export function AppProviders() {
  return (
    <TanstackQueryProvider>
      <MantineProvider>
        <TanstackRouterProvider />
      </MantineProvider>
    </TanstackQueryProvider>
  );
}
