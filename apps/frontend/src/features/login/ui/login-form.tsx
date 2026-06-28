import { loginForm } from './login-form.module.css';

import { WarningIcon } from '@phosphor-icons/react';
import '@/features/login/model';
import { Button, Group, PasswordInput, Stack, Text, TextInput, ThemeIcon } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { $lastLogin, lastLoginChanged, loginSuccesed } from '../model';
import { useUnit } from 'effector-react';
import { useLoginMutation } from '../api';
import { AxiosError } from 'axios';
import { RootErrorForm } from '@/shared/ui/root-error-form';

interface LoginFormProps {
  onSuccess?: () => void;
}
interface LoginFormState {
  login: string;
  password: string;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [loginSuccesedFn, lastLoginChangedFn, lastLogin] = useUnit([
    loginSuccesed,
    lastLoginChanged,
    $lastLogin,
  ]);
  const { mutateAsync } = useLoginMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormState>({
    defaultValues: { login: lastLogin ?? '', password: '' },
  });

  const onSubmit: SubmitHandler<LoginFormState> = async (data) => {
    try {
      await mutateAsync({ data });
      loginSuccesedFn();
      lastLoginChangedFn(data.login);
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorData = err.response?.data;
        const errorMessage =
          errorData?.details || errorData?.message || 'Произошла ошибка при входе';
        setError('root', { message: errorMessage });
      } else {
        setError('root', { message: 'Что-то пошло не так' });
      }
    }
  };

  return (
    <Stack component={'form'} onSubmit={handleSubmit(onSubmit)}>
      {errors.root && <RootErrorForm message={errors.root.message} />}
      <TextInput {...register('login')} label={'Логин'} />
      <PasswordInput {...register('password')} label={'Пароль'} />
      <TextInput opacity={0} />
      <Button type="submit" loading={isSubmitting}>
        Войти
      </Button>
    </Stack>
  );
};
