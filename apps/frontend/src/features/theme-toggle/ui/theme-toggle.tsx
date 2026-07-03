import { MoonIcon } from '@phosphor-icons/react/dist/csr/Moon';
import { SunIcon } from '@phosphor-icons/react/dist/csr/Sun';
import {
  Switch,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
  rem,
} from '@mantine/core';

export const ThemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const theme = useMantineTheme();

  const checked = computedColorScheme === 'dark';

  const sunIcon = (
    <SunIcon
      style={{ width: rem(12), height: rem(12) }}
      color={theme.colors.yellow[4]}
      weight="bold"
    />
  );

  const moonIcon = (
    <MoonIcon
      style={{ width: rem(12), height: rem(12) }}
      color={theme.colors.blue[6]}
      weight="bold"
    />
  );

  return (
    <Switch
      checked={checked}
      onChange={() => setColorScheme(checked ? 'light' : 'dark')}
      size="md"
      color="dark"
      thumbIcon={checked ? moonIcon : sunIcon}
    />
  );
};
