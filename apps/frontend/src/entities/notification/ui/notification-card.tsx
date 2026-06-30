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
      p="md"
      gap="md"
      pos="relative"
      bg={{ base: 'white', dark: 'dark.7' }}
      style={{
        borderBottom: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))',
        transition: 'background-color 0.15s ease',
        userSelect: 'none',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
        },
      }}
    >
      <Box c="violet" mt={2} display="flex" style={{ alignItems: 'flex-start' }}>
        <BellIcon size={18} weight="bold" />
      </Box>

      <Flex direction="column" gap={4} style={{ flex: 1 }}>
        <Flex justify="space-between" align="baseline" gap="sm">
          <Text
            size="sm"
            fw={600}
            c={{ base: 'gray.9', dark: 'dark.0' }}
            lh={1.3}
          >
            {data.title}
          </Text>
          <Text
            fz="calc(var(--mantine-font-size-xs) * 0.85)"
            c="placeholder"
            fw={500}
            tt="uppercase"
            lts="0.3px"
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
