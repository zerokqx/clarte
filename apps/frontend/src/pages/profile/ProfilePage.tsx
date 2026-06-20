import { Title, Paper, Avatar, Text, Group, Stack, Skeleton } from '@mantine/core';
import { useUserControllerMe } from '@/shared/api/generated/user/user';

export function ProfilePage() {
  const { data: user, isLoading } = useUserControllerMe();

  return (
    <>
      <Title order={2} mb="xl">
        Профиль
      </Title>
      <Paper shadow="sm" p="xl" radius="md" withBorder maw={480}>
        {isLoading ? (
          <Group gap="md">
            <Skeleton circle height={80} />
            <Stack gap="xs" style={{ flex: 1 }}>
              <Skeleton height={20} w="60%" />
              <Skeleton height={16} w="40%" />
            </Stack>
          </Group>
        ) : (
          <Group gap="md">
            <Avatar
              src={user?.avatarUrl ?? undefined}
              size={80}
              radius={80}
              color="blue"
            >
              {user?.login?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Stack gap={4}>
              <Text fw={600} size="lg">
                {user?.login}
              </Text>
              <Text size="sm" c="dimmed">
                ID: {user?.id}
              </Text>
            </Stack>
          </Group>
        )}
      </Paper>
    </>
  );
}
