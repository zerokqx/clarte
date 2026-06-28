import { Modal } from '@mantine/core';
import { LoginForm } from './login-form';

interface LoginModalProps extends Pick<Modal.Props, 'opened' | 'onClose'> {}

export const LoginModal = ({ onClose, opened }: LoginModalProps) => {
  return (
    <Modal onClose={onClose} opened={opened}>
      <LoginForm />
    </Modal>
  );
};
