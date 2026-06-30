import { NotificationDTO } from '@/shared/api/orval/generated/model';
import { Box, Text } from '@mantine/core';
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
    <Box
      p="md"
      style={{
        display: 'flex',
        gap: 'var(--mantine-spacing-md)',
        backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))',
        borderBottom: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))',
        transition: 'background-color 0.15s ease',
        position: 'relative',
        userSelect: 'none',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
        },
      }}
    >
      <Box
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          color: 'var(--mantine-color-violet-filled)',
          marginTop: '2px',
        }}
      >
        <BellIcon size={18} weight="bold" />
      </Box>

      <Box style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 'var(--mantine-spacing-sm)',
          }}
        >
          <Text
            size="sm"
            fw={600}
            style={{
              color: 'light-dark(var(--mantine-color-gray-9), var(--mantine-color-dark-0))',
              lineHeight: 1.3,
            }}
          >
            {data.title}
          </Text>
          <Text
            style={{
              fontSize: 'calc(var(--mantine-font-size-xs) * 0.85)',
              color: 'var(--mantine-color-placeholder)',
              whiteSpace: 'nowrap',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
            }}
          >
            {getFormattedDate(data.createdAt)}
          </Text>
        </Box>
        <Text size="xs" color="dimmed" style={{ lineHeight: 1.4 }}>
          {data.text}
        </Text>
      </Box>

      {actionSlot && (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          {actionSlot}
        </Box>
      )}
    </Box>
  );
};
