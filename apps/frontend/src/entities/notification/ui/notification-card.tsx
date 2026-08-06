import { NotificationDTO } from '@clarte/shared-api/model';
import { M } from '@clarte/mantine-helpers';
import { Text, Box, ThemeIcon, Stack, Group, Paper } from '@mantine/core';
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
    <Paper
      p="sm"
      radius="md"
      withBorder={false}
      style={{
        userSelect: 'none',
        backgroundColor: M.lightDark('rgba(0, 0, 0, 0.025)', 'rgba(255, 255, 255, 0.035)'),
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: M.lightDark('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.07)'),
        },
      }}
    >
      <Group align="flex-start" gap="sm" wrap="nowrap">
        <ThemeIcon
          variant="light"
          color="blue"
          size="md"
          radius="md"
          style={{ flexShrink: 0, marginTop: 2 }}
        >
          <BellIcon size={16} weight="bold" />
        </ThemeIcon>

        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
            <Text size="sm" fw={600} lh={1.2} style={{ wordBreak: 'break-word' }}>
              {data.title}
            </Text>
            <Text fz="xs" c={M.dimmed()} fw={500} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
              {getFormattedDate(data.createdAt)}
            </Text>
          </Group>

          <Text size="xs" c={M.dimmed()} lh={1.4} style={{ wordBreak: 'break-word' }}>
            {data.text}
          </Text>
        </Stack>

        {actionSlot && <Box style={{ flexShrink: 0 }}>{actionSlot}</Box>}
      </Group>
    </Paper>
  );
};
