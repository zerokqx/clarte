import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import * as ReactDOM from 'react-dom/client';
import { App } from './app';
import { AppProviders } from './providers';
import { attachLogger } from 'effector-logger';
import { appStarted } from '@/shared/model';

import.meta.env.DEV && attachLogger();

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

  appStarted();
});
