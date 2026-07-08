import { Stack } from '@mantine/core';
import { Todo, TodoSkeleton, useTodos } from '@/entities/todo';
import { useCompleteTodo, useUncompleteTodo } from '@/features/toggle-todo-complete';

export const TodoList = () => {
  const { data: todos, isLoading } = useTodos();
  const { mutate: completeTodo } = useCompleteTodo();
  const { mutate: uncompleteTodo } = useUncompleteTodo();

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
        <Todo
          key={todo.id}
          data={todo}
          onComplete={() => completeTodo({ id: todo.id })}
          onUnComplete={() => uncompleteTodo({ id: todo.id })}
        />
      ))}
    </Stack>
  );
};
