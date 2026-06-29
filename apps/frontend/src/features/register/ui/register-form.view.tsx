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
    <Stack component={'form'} onSubmit={handleSubmit(onSubmit)}>
      {(rootError || errors.root) && (
        <Alert color="red" variant="filled" icon={<WarningIcon />}>
          {rootError || errors.root?.message}
        </Alert>
      )}
      <TextInput {...register('login')} label={'Логин'} error={errors.login?.message} />
      <PasswordInput {...register('password')} label={'Пароль'} error={errors.password?.message} />
      <TextInput opacity={0} style={{ height: 0, margin: 0, padding: 0 }} />
      <Button type="submit" loading={isSubmitting}>
        Зарегистрироваться
      </Button>
    </Stack>
  );
};
