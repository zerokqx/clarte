import { LoginModal } from '@/features/login';
import { useDisclosure } from '@mantine/hooks';

export const LoginPage = () => {
  const [opened, { close }] = useDisclosure(true);
  return <LoginModal opened={opened} onClose={close} />;
};
