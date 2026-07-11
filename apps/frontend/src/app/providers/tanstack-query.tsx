import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactProvider } from '@/shared/types';

const queryClient = new QueryClient();
export const TanstackQueryProvider: ReactProvider = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
