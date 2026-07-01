import { Button, Stack, Text, Title } from '@mantine/core';
import { AUTH_WELCOME_TEXTS } from '../config';

interface AuthEntryPanelProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const AuthEntryPanel = ({ onOpenLogin, onOpenRegister }: AuthEntryPanelProps) => (
  <Stack 
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
      <Text size="sm" c="dimmed" lh={1.5}>
        {AUTH_WELCOME_TEXTS.welcomeSubtitle}
      </Text>
    </Stack>

    {/* Экшены (Кнопки) */}
    <Stack gap="md">
      {/* Главное действие — кнопка залитая основным цветом */}
      <Button 
        size="md" 
        radius="md"  
        onClick={onOpenLogin} 
        fullWidth
        className="auth-primary-btn"
      >
        {AUTH_WELCOME_TEXTS.loginBtn}
      </Button>
      
      {/* Второстепенное действие — делаем прозрачной (light) или контурной (outline) */}
      <Button 
        size="md" 
        radius="md" 
        variant="default" // Автоматически адаптируется под тему (белый с бордером / темно-серый с бордером)
        onClick={onOpenRegister} 
        fullWidth
      >
        {AUTH_WELCOME_TEXTS.registerBtn}
      </Button>
    </Stack>

    {/* Текст соглашения */}
    <Text size="xs" c="dimmed" ta="center" px="xs" lh={1.4}>
      {AUTH_WELCOME_TEXTS.tosText}
    </Text>
  </Stack>
);
