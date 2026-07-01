import { ActionIcon, Button } from '@mantine/core';
import { openCreateTodoModal } from './open-create-todo-modal';
import { M } from '@/shared/lib/mantine';
import { useCreateTodo } from '../api';
import { PlusIcon } from '@phosphor-icons/react/dist/icons/Plus';

// interface CreateTodoButtonProps {
//   title;
// }

export const CreateTodoButton = () => {
  const isMobile = M.useBreakpointMediaQuery('max-width', 'xs');
  const { mutateAsync } = useCreateTodo();
  return (
    <ActionIcon
      bdrs={'xl'}
      size={'input-xl'}
      onClick={async () => {
        const data = await openCreateTodoModal({ fullScreen: isMobile });
        if (data) mutateAsync({ data });
      }}
    >
      <PlusIcon />
    </ActionIcon>
  );
};
