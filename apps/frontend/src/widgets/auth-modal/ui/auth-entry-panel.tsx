import { Button, Stack, Text, Title } from '@mantine/core';
import { AUTH_WELCOME_TEXTS } from '../config';
import { M } from '@/shared/lib/mantine';

interface AuthEntryPanelProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const AuthEntryPanel = ({ onOpenLogin, onOpenRegister }: AuthEntryPanelProps) => (
  <Stack
    bg={M.themeGradient({
      dir: 'to bottom',
      light: [M.primary(0), M.dark(0)],
      dark: [M.dark(8), M.dark(7)],
    })}
    p="xl"
    justify="center"
    align="stretch"
    gap="xl"
    h="100%" // Занимает всю высоту родительского контейнера (флекса) вместо хардкода px
  >
    {/* Заголовок и подзаголовок */}
    <Stack gap="xs" ta="center">
      <Title order={3} fw={800} lts="-0.5px">
        {AUTH_WELCOME_TEXTS.welcomeTitle}
      </Title>
      <Text size="sm" c={M.dimmed()} lh={1.5}>
        {AUTH_WELCOME_TEXTS.welcomeSubtitle}
      </Text>
    </Stack>

    <Stack gap="md">
      <Button size="md" radius="md" onClick={onOpenLogin} fullWidth>
        {AUTH_WELCOME_TEXTS.loginBtn}
      </Button>

      <Button size="md" radius="md" variant="subtle" onClick={onOpenRegister} fullWidth>
        {AUTH_WELCOME_TEXTS.registerBtn}
      </Button>
    </Stack>

    <Text size="xs" c={M.dimmed()} ta="center" px="xs" lh={1.4}>
      {AUTH_WELCOME_TEXTS.tosText}
    </Text>
  </Stack>
);
