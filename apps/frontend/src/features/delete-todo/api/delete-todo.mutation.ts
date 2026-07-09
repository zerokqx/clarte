import {
  getTodoControllerGetUserTodosQueryKey,
  getTodoControllerGetUserTodosQueryOptions,
  useTodoControllerDeleteTodo,
} from '@clarte/shared-api/endpoints';
import { TodoDTO } from '@clarte/shared-api/model';
import { produce } from 'immer';

export const useDeleteTodo = () => {
  const queryKey = getTodoControllerGetUserTodosQueryKey();
  const options = getTodoControllerGetUserTodosQueryOptions();

  return useTodoControllerDeleteTodo({
    mutation: {
      async onMutate(variables, { client }) {
        await client.cancelQueries(options);
        const prevTodos = client.getQueryData<TodoDTO[]>(queryKey);
        client.setQueryData<TodoDTO[]>(queryKey, (data) => {
          if (!data) return undefined;
          return produce(data, (draft) => {
            return draft.filter((todo) => todo.id !== variables.id);
          });
        });
        return { prevTodos };
      },
      onError(error, _variables, onMutateResult, { client }) {
        const prevTodos = onMutateResult?.prevTodos;
        if (error) client.setQueryData(queryKey, prevTodos);
      },

      onSettled(_data, _error, _variables, _onMutateResult, { client }) {
        client.invalidateQueries(options);
      },
    },
  });
};
