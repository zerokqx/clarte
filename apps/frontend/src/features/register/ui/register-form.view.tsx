import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '../model/register.schema';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning';

export interface RegisterFormState {
  login: string;
  password: string;
}

interface RegisterFormProps {
  onSubmit: SubmitHandler<RegisterFormState>;
  isSubmitting?: boolean;
  rootError?: string | null;
}

export const RegisterFormView = ({
  onSubmit,
  isSubmitting,
  rootError,
}: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormState>({
    defaultValues: { login: '', password: '' },
    resolver: zodResolver(RegisterSchema),
  });

  return (
    <Stack gap="xl" component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        {(rootError || errors.root) && (
          <Alert color="red" variant="light" icon={<WarningIcon size={16} />}>
            {rootError || errors.root?.message}
          </Alert>
        )}
        <TextInput
          {...register('login')}
          label="Логин"
          error={errors.login?.message}
          placeholder="Придумайте логин"
          size="md"
        />
        <PasswordInput
          {...register('password')}
          label="Пароль"
          error={errors.password?.message}
          placeholder="Придумайте пароль"
          size="md"
        />
      </Stack>
      <Button type="submit" loading={isSubmitting} size="md">
        Зарегистрироваться
      </Button>
    </Stack>
  );
};
