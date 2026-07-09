import { ActionIcon, Badge, Checkbox, Skeleton, Text, Tooltip } from '@mantine/core';
import { CalendarIcon } from '@phosphor-icons/react/dist/csr/Calendar';
import { PencilSimpleIcon } from '@phosphor-icons/react/dist/csr/PencilSimple';
import { TrashIcon } from '@phosphor-icons/react/dist/csr/Trash';
import { ClockIcon } from '@phosphor-icons/react/dist/csr/Clock';
import classes from './todo.module.scss';
import { M } from '@clarte/mantine-helpers';

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
  onComplete?: () => void;
  onUnComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const Todo = ({ data, onComplete, onUnComplete, onEdit, onDelete }: TodoProps) => {
  const isOverdue = !data.isCompleted && new Date(data.dueDate).getTime() < Date.now();

  const formattedDate = new Date(data.dueDate).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCheckboxChange = () => {
    if (data.isCompleted) {
      onUnComplete?.();
    } else {
      onComplete?.();
    }
  };

  return (
    <div className={classes.todo}>
      <Checkbox
        size="md"
        checked={data.isCompleted}
        onChange={handleCheckboxChange}
        color="green"
        radius="xl"
        className={classes.todoCheckbox}
      />

      <div className={classes.todoContent}>
        <div className={classes.todoTextGroup}>
          <Text className={classes.todoTitle} data-completed={data.isCompleted}>
            {data.title}
          </Text>
          {data.description && (
            <Text className={classes.todoDescription} data-completed={data.isCompleted}>
              {data.description}
            </Text>
          )}
        </div>

        <div className={classes.todoMetaGroup}>
          <div className={classes.todoDueDate}>
            <CalendarIcon size={14} color={M.primary()} />
            <Text
              className={classes.todoDateText}
              data-completed={data.isCompleted}
              data-overdue={isOverdue}
            >
              {formattedDate}
            </Text>
          </div>
        </div>
      </div>

      <div className={classes.todoActions}>
        <Tooltip label="Редактировать" position="top" withArrow>
          <ActionIcon
            variant="subtle"
            color="gray"
            radius="md"
            size="md"
            onClick={onEdit}
            className={classes.todoActionButton}
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
            className={classes.todoActionButton}
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
    <div className={classes.todo} style={{ pointerEvents: 'none' }}>
      <Skeleton height={20} width={20} radius="xl" className={classes.todoCheckbox} />

      <div className={classes.todoContent}>
        <div className={classes.todoTextGroup}>
          <Skeleton height={14} width="40%" radius="sm" style={{ marginBottom: 6 }} />
          <Skeleton height={12} width="70%" radius="sm" />
        </div>

        <div className={classes.todoMetaGroup} style={{ marginTop: 6 }}>
          <Skeleton height={14} width={90} radius="sm" />
          <Skeleton height={14} width={65} radius="sm" />
        </div>
      </div>
    </div>
  );
};
