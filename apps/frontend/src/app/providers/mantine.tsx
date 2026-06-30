import { MantineProvider as MantineProviderOriginal } from '@mantine/core';
import { ReactProvider } from '@/shared/types';
import { theme } from '../mantine/theme';

export const MantineProvider: ReactProvider = ({ children }) => {
  return (
    <MantineProviderOriginal theme={theme} defaultColorScheme="dark">
      {children}
    </MantineProviderOriginal>
  );
};
