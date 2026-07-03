import { MantineProvider as MantineProviderOriginal } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { ReactProvider } from '@/shared/types';
import { theme } from '../mantine/theme';
import { uiStore } from '@/shared/model';

export const MantineProvider: ReactProvider = ({ children }) => {
  return (
    <MantineProviderOriginal
      theme={{ ...theme, primaryColor: uiStore.primaryColor }}
      defaultColorScheme="dark"
    >
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProviderOriginal>
  );
};
