import classes from './create-toodo.module.scss';
import { UnstyledButton } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react/dist/icons/Plus';
import { useCreateTodoAction } from '../model';

export const CreateTodoButton = () => {
  const { handleClick } = useCreateTodoAction();
  return (
    <UnstyledButton className={classes.button} variant="transparent" onClick={handleClick}>
      <PlusIcon className={classes.buttonIcon} aria-hidden="true" />
      Создать задачу
    </UnstyledButton>
  );
};
