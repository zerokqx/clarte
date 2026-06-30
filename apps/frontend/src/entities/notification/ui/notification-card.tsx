import { NotificationDTO } from '@/shared/api/orval/generated/model';
import { Box, Text, Flex } from '@mantine/core';
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
    <Flex
      py="xs"
      px="md"
      gap="sm"
      pos="relative"
      align="center"
      style={{
        borderBottom: '1px solid var(--mantine-color-default-border)',
        transition: 'background-color 0.15s ease',
        userSelect: 'none',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'var(--mantine-color-default-hover)',
        },
      }}
    >
      <Box c="primary" display="flex" style={{ alignItems: 'center' }}>
        <BellIcon size={16} weight="bold" />
      </Box>

      <Flex direction="column" gap={2} style={{ flex: 1 }}>
        <Flex justify="space-between" align="baseline" gap="sm">
          <Text
            size="sm"
            fw={600}
            lh={1.2}
          >
            {data.title}
          </Text>
          <Text
            fz="xs"
            c="dimmed"
            fw={500}
            style={{ whiteSpace: 'nowrap' }}
          >
            {getFormattedDate(data.createdAt)}
          </Text>
        </Flex>
        <Text size="xs" c="dimmed" lh={1.4}>
          {data.text}
        </Text>
      </Flex>

      {actionSlot && (
        <Flex align="center" justify="center" style={{ alignSelf: 'center' }}>
          {actionSlot}
        </Flex>
      )}
    </Flex>
  );
};
