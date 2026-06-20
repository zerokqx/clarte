import { Title, Paper, Divider } from '@mantine/core';
import { TodoList, CreateTodoForm, useTodosFeature } from '@/features/todo-list';

export function TodosPage() {
  const { todos, isLoading, createTodo, isCreating } = useTodosFeature();

  return (
    <>
      <Title order={2} mb="xl">
        Задачи
      </Title>
      <Paper shadow="sm" p="md" radius="md" withBorder mb="xl">
        <CreateTodoForm onSubmit={createTodo} isPending={isCreating} />
      </Paper>
      <Divider mb="md" />
      <TodoList todos={todos} isLoading={isLoading} />
    </>
  );
}
