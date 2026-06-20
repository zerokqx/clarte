import { useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  useTodoControllerGetUserTodos,
  useTodoControllerCreateTodo,
  getTodoControllerGetUserTodosQueryKey,
} from '@/shared/api/generated/todo/todo';
import type { CreateTodoDTO } from '@/shared/api/generated/model';

export interface CreateTodoFormValues {
  title: string;
  description: string;
  dueDate: Date | null;
}

export function useTodosFeature() {
  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useTodoControllerGetUserTodos();

  const createMutation = useTodoControllerCreateTodo({
    mutation: {
      onSuccess: () => {
        notifications.show({
          title: 'Задача создана',
          message: 'Новая задача добавлена в список',
          color: 'teal',
        });
        queryClient.invalidateQueries({
          queryKey: getTodoControllerGetUserTodosQueryKey(),
        });
      },
      onError: () => {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось создать задачу',
          color: 'red',
        });
      },
    },
  });

  const createTodo = (values: CreateTodoFormValues) => {
    createMutation.mutate({
      data: {
        title: values.title,
        description: values.description,
        dueDate: values.dueDate
          ? values.dueDate.toISOString()
          : new Date().toISOString(),
      } as CreateTodoDTO,
    });
  };

  return {
    todos: todos ?? [],
    isLoading,
    createTodo,
    isCreating: createMutation.isPending,
  };
}
