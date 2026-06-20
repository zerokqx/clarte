import { TextInput, Button, Group, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import type { CreateTodoFormValues } from '../model/use-todos';

interface CreateTodoFormProps {
  onSubmit: (values: CreateTodoFormValues) => void;
  isPending: boolean;
}

export function CreateTodoForm({ onSubmit, isPending }: CreateTodoFormProps) {
  const form = useForm<CreateTodoFormValues>({
    initialValues: { title: '', description: '', dueDate: null },
    validate: {
      title: (v: string) => (v.length < 1 ? 'Введите название' : null),
    },
  });

  const handleSubmit = (values: CreateTodoFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <TextInput
          placeholder="Название задачи"
          {...form.getInputProps('title')}
        />
        <TextInput
          placeholder="Описание (необязательно)"
          {...form.getInputProps('description')}
        />
        <DateInput
          clearable
          placeholder="Дата выполнения"
          {...form.getInputProps('dueDate')}
        />
        <Group justify="flex-end">
          <Button type="submit" loading={isPending} size="sm">
            Добавить
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

