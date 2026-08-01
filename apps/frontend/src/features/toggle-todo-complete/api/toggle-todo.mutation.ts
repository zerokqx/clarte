import { useQueryClient } from '@tanstack/react-query';
import {
  useTodoControllerCompleteTodo,
  useTodoControllerUncompleteTodo,
  getTodoControllerGetUserTodosQueryKey,
} from '@clarte/shared-api/endpoints';
import type { TodoDTO } from '@clarte/shared-api/model';
import { produce } from 'immer';

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();

  return useTodoControllerCompleteTodo({
    mutation: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey: getTodoControllerGetUserTodosQueryKey() });

        const previousTodos = queryClient.getQueryData<TodoDTO[]>(
          getTodoControllerGetUserTodosQueryKey(),
        );

        if (previousTodos) {
          queryClient.setQueryData<TodoDTO[]>(
            getTodoControllerGetUserTodosQueryKey(),
            produce(previousTodos, (draft) => {
              const todo = draft.find((t) => t.id === variables.id);
              if (todo) {
                todo.isCompleted = true;
              }
            }),
          );
        }

        return { previousTodos };
      },

      onError: (_err, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData<TodoDTO[]>(
            getTodoControllerGetUserTodosQueryKey(),
            context.previousTodos,
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getTodoControllerGetUserTodosQueryKey() });
      },
    },
  });
};

export const useUncompleteTodo = () => {
  const queryClient = useQueryClient();

  return useTodoControllerUncompleteTodo({
    mutation: {
      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey: getTodoControllerGetUserTodosQueryKey() });

        const previousTodos = queryClient.getQueryData<TodoDTO[]>(
          getTodoControllerGetUserTodosQueryKey(),
        );

        if (previousTodos) {
          queryClient.setQueryData<TodoDTO[]>(
            getTodoControllerGetUserTodosQueryKey(),
            produce(previousTodos, (draft) => {
              const todo = draft.find((t) => t.id === variables.id);
              if (todo) {
                todo.isCompleted = false;
              }
            }),
          );
        }

        return { previousTodos };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousTodos) {
          queryClient.setQueryData<TodoDTO[]>(
            getTodoControllerGetUserTodosQueryKey(),
            context.previousTodos,
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getTodoControllerGetUserTodosQueryKey() });
      },
    },
  });
};
