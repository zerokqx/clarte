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
    <Stack component={'form'} onSubmit={handleSubmit(onSubmit)}>
      {(rootError || errors.root) && (
        <Alert color="red" variant="filled" icon={<WarningIcon />}>
          {rootError}
        </Alert>
      )}
      <TextInput {...register('login')} label={'Логин'} error={errors.login?.message} />
      <PasswordInput {...register('password')} label={'Пароль'} error={errors.password?.message} />
      <TextInput opacity={0} style={{ height: 0, margin: 0, padding: 0 }} />
      <Button type="submit" loading={isSubmitting}>
        Войти
      </Button>
    </Stack>
  );
};
