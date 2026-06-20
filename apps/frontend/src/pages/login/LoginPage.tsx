import { Container, Paper, Title, Text, Center, Box } from '@mantine/core';
import { LoginForm } from '@/features/auth-login';
import { useLoginFeature } from '@/features/auth-login';

export function LoginPage() {
  const { submit, isPending } = useLoginFeature();

  return (
    <Center mih="100vh" bg="var(--mantine-color-gray-0)">
      <Container size={420} w="100%">
        <Box mb="xl" ta="center">
          <Title order={1} fw={900} size="h2">
            Clarte
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Войдите в свой аккаунт
          </Text>
        </Box>
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <LoginForm onSubmit={submit} isPending={isPending} />
        </Paper>
      </Container>
    </Center>
  );
}
