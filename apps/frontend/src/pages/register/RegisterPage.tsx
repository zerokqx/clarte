import { Container, Paper, Title, Text, Center, Box } from '@mantine/core';
import { RegisterForm } from '@/features/auth-register';
import { useRegisterFeature } from '@/features/auth-register';

export function RegisterPage() {
  const { submit, isPending } = useRegisterFeature();

  return (
    <Center mih="100vh" bg="var(--mantine-color-gray-0)">
      <Container size={420} w="100%">
        <Box mb="xl" ta="center">
          <Title order={1} fw={900} size="h2">
            Clarte
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Создайте новый аккаунт
          </Text>
        </Box>
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <RegisterForm onSubmit={submit} isPending={isPending} />
        </Paper>
      </Container>
    </Center>
  );
}
