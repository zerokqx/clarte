import { Anchor, Modal, Stack, Text } from '@mantine/core';
import { RegisterForm } from './register-form.containter';

interface RegisterModalProps extends Pick<Modal.Props, 'opened' | 'onClose' | 'stackId' | 'fullScreen' | 'centered'> {
  onHaveAccount?: () => void;
}

export const RegisterModal = ({ onClose, opened, onHaveAccount, ...props }: RegisterModalProps) => {
  return (
    <Modal
      onClose={onClose}
      opened={opened}
      title="Регистрация"
      size="sm"
      overlayProps={{ backgroundOpacity: 0.55, blur: 4 }}
      {...props}
    >
      <Stack gap="lg">
        <RegisterForm onSuccess={onClose} />
        {onHaveAccount && (
          <Text size="sm" c="dimmed" ta="center">
            Уже есть аккаунт?{' '}
            <Anchor component="button" size="sm" onClick={onHaveAccount} fw={500}>
              Войти
            </Anchor>
          </Text>
        )}
      </Stack>
    </Modal>
  );
};
