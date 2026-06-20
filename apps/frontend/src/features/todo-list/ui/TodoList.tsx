import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Skeleton,
  ThemeIcon,
} from '@mantine/core';
import { IconCircleCheck, IconCircle } from '@tabler/icons-react';
import type { TodoDTO } from '@/shared/api/generated/model';

interface TodoCardProps {
  todo: TodoDTO;
}

export function TodoCard({ todo }: TodoCardProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" align="flex-start">
        <Group gap="sm">
          <ThemeIcon
            color={todo.isCompleted ? 'teal' : 'gray'}
            variant="light"
            size="sm"
          >
            {todo.isCompleted ? (
              <IconCircleCheck size={14} />
            ) : (
              <IconCircle size={14} />
            )}
          </ThemeIcon>
          <Stack gap={4}>
            <Text fw={500} td={todo.isCompleted ? 'line-through' : undefined}>
              {todo.title}
            </Text>
            {todo.description && (
              <Text size="sm" c="dimmed">
                {todo.description}
              </Text>
            )}
          </Stack>
        </Group>
        {todo.dueDate && (
          <Badge variant="light" color="blue" size="sm">
            {new Date(todo.dueDate).toLocaleDateString('ru-RU')}
          </Badge>
        )}
      </Group>
    </Card>
  );
}

interface TodoListProps {
  todos: TodoDTO[];
  isLoading: boolean;
}

export function TodoList({ todos, isLoading }: TodoListProps) {
  if (isLoading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={72} radius="md" />
        ))}
      </Stack>
    );
  }

  if (todos.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        Задач пока нет. Создайте первую!
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </Stack>
  );
}
