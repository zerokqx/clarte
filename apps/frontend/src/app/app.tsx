import { Providers } from './providers/Providers';
import { AppRouter } from './router/AppRouter';

export function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
