import { Stack, Card, Text, Group, ThemeIcon, Skeleton, Badge } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';
import type { NotificationDTO } from '@/shared/api/generated/model';

interface NotificationListProps {
  notifications: NotificationDTO[];
  isLoading: boolean;
}

export function NotificationList({ notifications, isLoading }: NotificationListProps) {
  if (isLoading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={64} radius="md" />
        ))}
      </Stack>
    );
  }

  if (notifications.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        Уведомлений нет
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      {notifications.map((n) => (
        <Card key={n.id} shadow="sm" padding="md" radius="md" withBorder>
          <Group gap="sm">
            <ThemeIcon color="blue" variant="light" size="sm">
              <IconBell size={14} />
            </ThemeIcon>
            <Stack gap={2} style={{ flex: 1 }}>
              <Group justify="space-between">
                <Text fw={500} size="sm">
                  {n.title}
                </Text>
                {n.createdAt && (
                  <Badge variant="outline" size="xs" color="gray">
                    {new Date(n.createdAt).toLocaleString('ru-RU')}
                  </Badge>
                )}
              </Group>
              <Text size="sm" c="dimmed">
                {n.text}
              </Text>
            </Stack>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
