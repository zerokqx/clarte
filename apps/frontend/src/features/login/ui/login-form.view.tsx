import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '../model/login.schema';
import { WarningIcon } from '@phosphor-icons/react/dist/csr/Warning';

export interface LoginFormState {
  login: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: SubmitHandler<LoginFormState>;
  isSubmitting?: boolean;
  lastLoginName?: string;
  rootError?: string | null;
}

export const LoginFormView = ({
  onSubmit,
  isSubmitting,
  lastLoginName,
  rootError,
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormState>({
    defaultValues: { login: lastLoginName ?? '', password: '' },
    resolver: zodResolver(LoginSchema),
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
          placeholder="Ваш логин"
          size="md"
        />
        <PasswordInput
          {...register('password')}
          label="Пароль"
          error={errors.password?.message}
          placeholder="Ваш пароль"
          size="md"
        />
      </Stack>
      <Button type="submit" loading={isSubmitting} size="md">
        Войти
      </Button>
    </Stack>
  );
};
