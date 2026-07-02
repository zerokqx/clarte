import { NotificationDTO } from '@/shared/api/orval/generated/model';
import { M } from '@/shared/lib/mantine';
import { Text, Flex, ThemeIcon, Stack, Group, Divider } from '@mantine/core';
import { BellIcon } from '@phosphor-icons/react/dist/csr/Bell';
import { ReactNode } from 'react';

export interface NotificationCardProps {
  data: NotificationDTO;
  actionSlot?: ReactNode;
}

const getFormattedDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

export const NotificationCard = ({ data, actionSlot }: NotificationCardProps) => {
  return (
    <Group
      py="xs"
      px="md"
      gap="sm"
      style={{
        userSelect: 'none',
      }}
    >
      <ThemeIcon variant="transparent">
        <BellIcon size={16} weight="duotone" />
      </ThemeIcon>

      <Stack gap={4} flex="1">
        <Group justify="space-between">
          <Text size="sm" fw={600} lh={1.2}>
            {data.title}
          </Text>
          <Text fz="xs" c={M.dimmed()} fw={500} style={{ whiteSpace: 'nowrap' }}>
            {getFormattedDate(data.createdAt)}
          </Text>
        </Group>
        <Text size="xs" c={M.dimmed()} lh={1.4}>
          {data.text}
        </Text>
      </Stack>

      {actionSlot && (
        <Flex align="center" justify="center" style={{ alignSelf: 'center' }}>
          {actionSlot}
        </Flex>
      )}

      <Divider w={'100%'} />
    </Group>
  );
};
