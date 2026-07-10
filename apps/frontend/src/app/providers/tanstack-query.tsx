import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactProvider } from '@/shared/types';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } });

export const TanstackQueryProvider: ReactProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
