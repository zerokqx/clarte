import { CreateTodoButton, useCreateTodoAction } from '@/features/create-todo';
import { BottomNavigation } from '@/widgets/bottom-navigation';
import { TodoList } from '@/widgets/todo-list';
import { Center, Group, Stack } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react/dist/icons/Plus';

export const TodosPage = () => {
  const { handleClick } = useCreateTodoAction();
  return (
    <>
      <BottomNavigation.SubActions>
        <BottomNavigation.SubActions.Action onClick={handleClick}>
          <PlusIcon />
        </BottomNavigation.SubActions.Action>
      </BottomNavigation.SubActions>
      <Center>
        <Stack w={'min(100%,480px)'}>
          <TodoList />
          <Group justify="center">
            <CreateTodoButton />
          </Group>
        </Stack>
      </Center>
    </>
  );
};
