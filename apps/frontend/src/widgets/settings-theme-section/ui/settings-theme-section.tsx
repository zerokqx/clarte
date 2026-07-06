import { PrimaryColorSelect, ThemeToggle } from '@/features/theme-switcher';
import { Stack } from '@mantine/core';

export const SettingsThemeSection = () => {
  return (
    <Stack>
      <ThemeToggle />
      <PrimaryColorSelect />
    </Stack>
  );
};
