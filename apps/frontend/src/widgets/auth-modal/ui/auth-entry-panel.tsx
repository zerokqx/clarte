import { Button, Stack, Text, Title } from '@mantine/core';
import { AUTH_WELCOME_TEXTS } from '../config';

interface AuthEntryPanelProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const AuthEntryPanel = ({ onOpenLogin, onOpenRegister }: AuthEntryPanelProps) => (
  <Stack p="xl" justify="center" align="stretch" gap="xl" style={{ minHeight: '380px' }}>
    <Stack gap="xs" ta="center">
      <Title order={3} fw={700}>
        {AUTH_WELCOME_TEXTS.welcomeTitle}
      </Title>
      <Text size="sm" c="dimmed">
        {AUTH_WELCOME_TEXTS.welcomeSubtitle}
      </Text>
    </Stack>

    <Stack gap="sm">
      <Button size="md" radius="md" onClick={onOpenLogin} fullWidth>
        {AUTH_WELCOME_TEXTS.loginBtn}
      </Button>
      <Button size="md" radius="md" variant="light" onClick={onOpenRegister} fullWidth>
        {AUTH_WELCOME_TEXTS.registerBtn}
      </Button>
    </Stack>

    <Text size="xs" c="dimmed" ta="center">
      {AUTH_WELCOME_TEXTS.tosText}
    </Text>
  </Stack>
);
