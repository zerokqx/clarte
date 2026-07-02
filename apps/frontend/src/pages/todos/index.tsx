import { CreateTodoButton } from '@/features/create-todo';
import { TodoList } from '@/widgets/todo-list';
import { Center, Group, Stack } from '@mantine/core';

export const TodosPage = () => {
  return (
    <Center>
      <Stack w={'min(100%,480px)'}>
        <TodoList />
        <Group justify="end">
          <CreateTodoButton />
        </Group>
      </Stack>
    </Center>
  );
};
