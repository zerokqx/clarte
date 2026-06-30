import { Modal, useModalsStack } from '@mantine/core';
import { LoginModal } from '@/features/login';
import { RegisterModal } from '@/features/register';

interface AuthModalsStackProps {
  stack: ReturnType<typeof useModalsStack>;
  isMobile: boolean;
}

export const AuthModalsStack = ({ stack, isMobile }: AuthModalsStackProps) => (
  <Modal.Stack>
    <LoginModal
      {...stack.register('login')}
      onDontHaveAccount={() => stack.open('register')}
      fullScreen={isMobile}
      centered
    />
    <RegisterModal
      {...stack.register('register')}
      onHaveAccount={() => stack.open('login')}
      fullScreen={isMobile}
      centered
    />
  </Modal.Stack>
);
