import { MantineProvider as MantineProviderOriginal } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { ReactProvider } from '@/shared/types';
import { theme } from '../mantine/theme';
import { themeStore } from '@/entities/theme';
import { observer } from 'mobx-react-lite';

export const MantineProvider: ReactProvider = observer(({ children }) => {
  return (
    <MantineProviderOriginal
      theme={{ ...theme, primaryColor: themeStore.primaryColor }}
      defaultColorScheme="dark"
    >
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProviderOriginal>
  );
});
