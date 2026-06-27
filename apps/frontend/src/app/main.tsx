import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import * as ReactDOM from 'react-dom/client';
import { App } from './app';
import { AppProviders } from './providers';
import { routeTree } from '@/app/route-tree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { TanstackRouterProvider } from './providers/tanstack-router';

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

  root.render(
    <AppProviders>
      <App />
    </AppProviders>,
  );
});
