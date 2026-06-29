import { Anchor, Modal, Stack, Text } from '@mantine/core';
import { LoginForm } from './login-form.containter';

interface LoginModalProps extends Pick<Modal.Props, 'opened' | 'onClose' | 'stackId' | 'fullScreen' | 'centered'> {
  onDontHaveAccount?: () => void;
}

export const LoginModal = ({ onClose, opened, onDontHaveAccount, ...props }: LoginModalProps) => {
  return (
    <Modal
      onClose={onClose}
      opened={opened}
      title="Вход"
      size="sm"
      overlayProps={{ backgroundOpacity: 0.55, blur: 4 }}
      {...props}
    >
      <Stack gap="lg">
        <LoginForm onSuccess={onClose} />
        {onDontHaveAccount && (
          <Text size="sm" c="dimmed" ta="center">
            Нет аккаунта?{' '}
            <Anchor component="button" size="sm" onClick={onDontHaveAccount} fw={500}>
              Зарегистрироваться
            </Anchor>
          </Text>
        )}
      </Stack>
    </Modal>
  );
};
