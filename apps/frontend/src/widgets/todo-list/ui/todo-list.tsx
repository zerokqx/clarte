import { Stack } from '@mantine/core';
import { Todo, TodoSkeleton, useTodos } from '@/entities/todo';

export const TodoList = () => {
  const { data: todos, isLoading } = useTodos();

  if (isLoading) {
    return (
      <Stack gap="sm">
        {Array.from({ length: 3 }).map((_, index) => (
          <TodoSkeleton key={index} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack gap="sm">
      {todos?.map((todo) => (
        <Todo key={todo.id} data={todo} />
      ))}
    </Stack>
  );
};
