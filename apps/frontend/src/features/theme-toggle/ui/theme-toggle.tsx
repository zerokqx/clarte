import { MoonIcon } from '@phosphor-icons/react/dist/csr/Moon';
import { SunIcon } from '@phosphor-icons/react/dist/csr/Sun';
import { Switch, useComputedColorScheme, useMantineColorScheme, rem } from '@mantine/core';
import { M } from '@clarte/mantine-helpers';

export const ThemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const checked = computedColorScheme === 'dark';

  const sunIcon = (
    <SunIcon height={rem(12)} width={rem(12)} color={M.color('yellow')(6)} weight="bold" />
  );
  const moonIcon = (
    <MoonIcon height={rem(12)} width={rem(12)} color={M.color('blue')(6)} weight="bold" />
  );

  return (
    <Switch
      checked={checked}
      onChange={() => setColorScheme(checked ? 'light' : 'dark')}
      label="Тема"
      description="Переключите что бы сменить тему"
      size="md"
      thumbIcon={checked ? moonIcon : sunIcon}
    />
  );
};
