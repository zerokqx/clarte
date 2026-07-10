import { M } from '@clarte/mantine-helpers';
import { useCallback } from 'react';
import { useCreateTodo } from '../api';
import { openCreateTodoModal } from '../ui/open-create-todo-modal';

export const useCreateTodoAction = () => {
  const isMobile = M.useBreakpointMediaQuery('max-width', 'xs');
  const { mutate, ...rest } = useCreateTodo();
  const handleClick = useCallback(async () => {
    const data = await openCreateTodoModal({ fullScreen: isMobile });
    if (data) mutate({ data });
  }, [isMobile, mutate]);

  return { ...rest, handleClick };
};
