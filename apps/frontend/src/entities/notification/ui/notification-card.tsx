import { NotificationDTO } from '@/shared/api/orval/generated/model';
import { Box, Text } from '@mantine/core';
import { BellIcon } from '@phosphor-icons/react/dist/csr/Bell';
import { ReactNode } from 'react';
import {
  card,
  iconWrapper,
  contentWrapper,
  headerRow,
  title,
  text as textClass,
  time as timeClass,
  actionSlot as actionSlotClass,
} from './notification-card.module.css';

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
    <Box className={card}>
      <div className={iconWrapper}>
        <BellIcon size={18} weight="bold" />
      </div>

      <div className={contentWrapper}>
        <div className={headerRow}>
          <Text className={title}>{data.title}</Text>
          <Text className={timeClass}>{getFormattedDate(data.createdAt)}</Text>
        </div>
        <Text className={textClass}>{data.text}</Text>
      </div>

      {actionSlot && <div className={actionSlotClass}>{actionSlot}</div>}
    </Box>
  );
};
