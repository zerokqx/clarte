import classes from './create-toodo.module.scss';
import { UnstyledButton } from '@mantine/core';
import { openCreateTodoModal } from './open-create-todo-modal';
import { M } from '@clarte/mantine-helpers';
import { useCreateTodo } from '../api';
import { PlusIcon } from '@phosphor-icons/react/dist/icons/Plus';

export const CreateTodoButton = () => {
  const isMobile = M.useBreakpointMediaQuery('max-width', 'xs');
  const { mutateAsync } = useCreateTodo();
  return (
    <UnstyledButton
      className={classes.button}
      variant="transparent"
      onClick={async () => {
        const data = await openCreateTodoModal({ fullScreen: isMobile });
        if (data) mutateAsync({ data });
      }}
    >
      <PlusIcon className={classes.buttonIcon} aria-hidden="true" />
      Создать задачу
    </UnstyledButton>
  );
};
