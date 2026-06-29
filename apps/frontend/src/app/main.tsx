import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/spotlight/styles.css';
import * as ReactDOM from 'react-dom/client';
import { AppProviders } from './providers';
import { enableLogging } from 'mobx-logger';
import { authStore } from '@/entities/session';
import { setupAxiosInterceptors } from '@/shared/api';

setupAxiosInterceptors(() => authStore.refreshTokens());
if (import.meta.env.DEV) {
  enableLogging({
    transaction: true,
    predicate: () => true,
    action: true,
    reaction: true,
    compute: true,
  });
}

async function enableMocking() {
  if (import.meta.env.VITE_MOCK !== 'true') {
    return;
  }
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(<AppProviders />);
  authStore.initAuth();
});
