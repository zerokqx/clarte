import { ActionIcon, Badge, Checkbox, Skeleton, Text, Tooltip } from '@mantine/core';
import { CalendarIcon } from '@phosphor-icons/react/dist/csr/Calendar';
import { PencilSimpleIcon } from '@phosphor-icons/react/dist/csr/PencilSimple';
import { TrashIcon } from '@phosphor-icons/react/dist/csr/Trash';
import { ClockIcon } from '@phosphor-icons/react/dist/csr/Clock';
import classes from './todo.module.css';
import { M } from '@/shared/lib/mantine';

export interface TodoDataProp {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: string;
  createdAt: string;
}

interface TodoProps {
  data: TodoDataProp;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const Todo = ({ data, onToggleComplete, onEdit, onDelete }: TodoProps) => {
  const isOverdue = !data.isCompleted && new Date(data.dueDate).getTime() < Date.now();

  const formattedDate = new Date(data.dueDate).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={classes.card}>
      <Checkbox
        size="md"
        checked={data.isCompleted}
        onChange={onToggleComplete}
        color="teal"
        radius="xl"
        className={classes.checkbox}
      />

      <div className={classes.content}>
        <div className={classes.textGroup}>
          <Text className={classes.title} data-completed={data.isCompleted}>
            {data.title}
          </Text>
          {data.description && (
            <Text className={classes.description} data-completed={data.isCompleted}>
              {data.description}
            </Text>
          )}
        </div>

        <div className={classes.metaGroup}>
          <div className={classes.dueDate}>
            <CalendarIcon
              size={14}
              color={data.isCompleted ? M.dimmed() : isOverdue ? M.color('red')(6) : M.primary(6)}
            />
            <Text
              className={classes.dateText}
              data-completed={data.isCompleted}
              data-overdue={isOverdue}
            >
              {formattedDate}
            </Text>
          </div>

          {data.isCompleted ? (
            <Badge color="teal" variant="light" size="xs" radius="sm">
              Выполнено
            </Badge>
          ) : isOverdue ? (
            <Badge
              color="red"
              variant="light"
              size="xs"
              radius="sm"
              leftSection={<ClockIcon size={10} />}
            >
              Просрочено
            </Badge>
          ) : (
            <Badge color="blue" variant="light" size="xs" radius="sm">
              В процессе
            </Badge>
          )}
        </div>
      </div>

      <div className={classes.actions}>
        <Tooltip label="Редактировать" position="top" withArrow>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={onEdit}
            radius="md"
            size="md"
            className={classes.actionButton}
          >
            <PencilSimpleIcon size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Удалить" position="top" withArrow>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={onDelete}
            radius="md"
            size="md"
            className={classes.actionButton}
          >
            <TrashIcon size={18} />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
};

export const TodoSkeleton = () => {
  return (
    <div className={classes.card} style={{ pointerEvents: 'none' }}>
      <Skeleton height={20} width={20} radius="xl" className={classes.checkbox} />

      <div className={classes.content}>
        <div className={classes.textGroup}>
          <Skeleton height={14} width="40%" radius="sm" style={{ marginBottom: 6 }} />
          <Skeleton height={12} width="70%" radius="sm" />
        </div>

        <div className={classes.metaGroup} style={{ marginTop: 6 }}>
          <Skeleton height={14} width={90} radius="sm" />
          <Skeleton height={14} width={65} radius="sm" />
        </div>
      </div>
    </div>
  );
};
