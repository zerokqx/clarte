import { Button, Group, Stack, TextInput, Textarea } from '@mantine/core';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTodoSchema } from '../model';
import { CalendarIcon } from '@phosphor-icons/react/dist/csr/Calendar';
import { FileTextIcon } from '@phosphor-icons/react/dist/csr/FileText';
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';

export interface CreateTodoFormState {
  title: string;
  description: string;
  dueDate: Date | null;
}

export interface CreateTodoModalResult {
  title: string;
  description: string;
  dueDate: string;
}

interface CreateTodoFormProps {
  onSubmit: (data: CreateTodoModalResult) => void;
  onCancel?: () => void;
}

export const CreateTodoForm = ({ onCancel, onSubmit }: CreateTodoFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTodoFormState>({
    resolver: zodResolver(CreateTodoSchema) as unknown as Resolver<CreateTodoFormState>,
    defaultValues: {
      title: '',
      description: '',
      dueDate: null,
    },
  });

  const handleFormSubmit = (data: CreateTodoFormState) => {
    let isoDate = '';
    if (data.dueDate) {
      const dateObj = data.dueDate instanceof Date ? data.dueDate : new Date(data.dueDate);
      if (!isNaN(dateObj.getTime())) {
        isoDate = dateObj.toISOString();
      }
    }

    onSubmit({
      title: data.title,
      description: data.description,
      dueDate: isoDate,
    });
  };

  return (
    <Stack component={'form'} gap={'md'} onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap={'sm'}>
        <TextInput
          size="sm"
          label="Название задачи"
          placeholder="Например: Закончить отчёт по проекту"
          leftSection={<FileTextIcon size={16} />}
          error={errors.title?.message}
          {...register('title', { required: 'Пожалуйста, введите название задачи' })}
        />

        <Textarea
          size="sm"
          label="Описание"
          placeholder="Добавьте подробности, заметки или ссылки..."
          error={errors.description?.message}
          minRows={3}
          maxRows={6}
          autosize
          {...register('description')}
        />

        <Controller
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              {...field}
              dropdownType="modal"
              modalProps={{ zIndex: 1000000 }}
              label="Срок выполнения"
              placeholder="Выберите дату и время окончания"
              leftSection={<CalendarIcon size={16} />}
              size="sm"
              clearable
              error={error?.message}
            />
          )}
          control={control}
          name="dueDate"
          rules={{ required: 'Пожалуйста, укажите срок выполнения' }}
        />
      </Stack>

      <Group justify="flex-end" gap="xs" mt="md">
        <Button type="button" variant="subtle" color="gray" size="sm" onClick={onCancel}>
          Отмена
        </Button>
        <Button
          type="submit"
          size="sm"
          variant="filled"
          leftSection={<PlusIcon size={16} weight="bold" />}
        >
          Создать
        </Button>
      </Group>
    </Stack>
  );
};
