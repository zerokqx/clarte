import { modals } from '@mantine/modals';
import { CreateTodoForm, CreateTodoModalResult } from './create-todo-form';

interface OpenCreateTodoModalProps {
  fullScreen?: boolean;
}

export const openCreateTodoModal = ({ fullScreen }: OpenCreateTodoModalProps) =>
  new Promise<CreateTodoModalResult | null>((resolve) => {
    let hasResolved = false;
    const safeResolve = (value: CreateTodoModalResult | null) => {
      if (!hasResolved) {
        hasResolved = true;
        resolve(value);
      }
    };

    const modalId = modals.open({
      fullScreen,
      title: 'Новая задача',
      onClose: () => safeResolve(null),
      children: (
        <CreateTodoForm
          onSubmit={(data) => {
            safeResolve(data);
            modals.close(modalId);
          }}
          onCancel={() => {
            safeResolve(null);
            modals.close(modalId);
          }}
        />
      ),
    });
  });
