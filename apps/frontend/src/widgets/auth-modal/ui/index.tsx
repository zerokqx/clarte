import { motion } from 'motion/react';
import {
  Center,
  Container,
  Paper,
  SimpleGrid,
  useMantineTheme,
  useModalsStack,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { GreetingCard } from './greeting-card';
import { AuthEntryPanel } from './auth-entry-panel';
import { AuthModalsStack } from './auth-modals-stack';
import { useEffect, useState } from 'react';
import { AuthModalStack } from '../model';

export const AuthModal = () => {
  const [scale, setScale] = useState(1);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const stack: AuthModalStack = useModalsStack(['login', 'register']);

  useEffect(() => {
    if (stack.state.login || stack.state.register) {
      setScale(0.5);
      return;
    }
    setScale(1);
  }, [stack.state]);

  return (
    <Center style={{ minHeight: '80vh' }} w="100%">
      <motion.div
        initial={{ scale: 0.8, width: '80%' }}
        animate={{ scale, width: 'auto' }}
        viewport={{ once: true }}
      >
        <Container size="md" w="100%">
          <Paper p={0} radius="xl" withBorder shadow="xl" style={{ overflow: 'hidden' }}>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={0}>
              <GreetingCard />
              <AuthEntryPanel
                onOpenLogin={() => stack.open('login')}
                onOpenRegister={() => stack.open('register')}
              />
            </SimpleGrid>
          </Paper>
        </Container>
        <AuthModalsStack stack={stack} isMobile={!!isMobile} />
      </motion.div>
    </Center>
  );
};
