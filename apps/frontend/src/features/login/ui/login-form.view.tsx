import {pipe} from "effect"
import '@/features/login/model';
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { $lastLogin, lastLoginChanged, loginSuccesed } from '../model';
import { useUnit } from 'effector-react';
import { useLoginMutation } from '../api';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { RootErrorForm } from '@/shared/ui/root-error-form';
import { LoginSchema } from '../model/login.schema';

interface LoginFormProps {
  onSubmit: (data: LoginFormState) => void;
  onSuccess?: () => void;
  lastLoginName?: string
}

interface LoginFormState {
  login: string;
  password: string;
}

export const LoginForm = ({ onSuccess ,onSubmit, lastLoginName}: LoginFormProps) => {
  // const [loginSuccesedFn, lastLoginChangedFn, lastLogin] = useUnit([
  //   loginSuccesed,
  //   lastLoginChanged,
  //   $lastLogin,
  // ]);
  // const { mutateAsync } = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormState>({
    defaultValues: { login: lastLogin ?? '', password: '' },
    resolver: zodResolver(LoginSchema),
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
      <TextInput {...register('login')} label={'Логин'} error={errors.login?.message} />
      <PasswordInput {...register('password')} label={'Пароль'} error={errors.password?.message} />
      <TextInput opacity={0} />
      <Button type="submit" loading={isSubmitting}>
        Войти
      </Button>
    </Stack>
  );
};
