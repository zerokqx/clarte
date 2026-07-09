import { Stack } from '@mantine/core';
import { Todo, TodoSkeleton, useTodos } from '@/entities/todo';
import { useCompleteTodo, useUncompleteTodo } from '@/features/toggle-todo-complete';
import { useDeleteTodo } from '@/features/delete-todo';
import { memo } from 'react';

const TodoMemo = memo(Todo);
export const TodoList = () => {
  const { data: todos, isLoading } = useTodos();
  const { mutate: completeTodo } = useCompleteTodo();
  const { mutate: uncompleteTodo } = useUncompleteTodo();
  const { mutateAsync } = useDeleteTodo();

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
        <TodoMemo
          key={todo.id}
          data={todo}
          onComplete={() => completeTodo({ id: todo.id })}
          onDelete={() => mutateAsync({ id: todo.id })}
          onUnComplete={() => uncompleteTodo({ id: todo.id })}
        />
      ))}
    </Stack>
  );
};
