import { Modal } from '@mantine/core';
import { RegisterForm } from './register-form.containter';

type RegisterModalProps = Pick<Modal.Props, 'opened' | 'onClose'>;

export const RegisterModal = ({ onClose, opened }: RegisterModalProps) => {
  return (
    <Modal onClose={onClose} opened={opened} title="Регистрация">
      <RegisterForm onSuccess={onClose} />
    </Modal>
  );
};
