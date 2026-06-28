import '@/features/login/model';
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';
import { $lastLogin, lastLoginChanged, loginSuccesed } from '../model';
import { useUnit } from 'effector-react';
import { useLoginMutation } from '../api';

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
  const { register, handleSubmit } = useForm<LoginFormState>({
    defaultValues: { login: lastLogin ?? '', password: '' },
  });

  const onSubmit: SubmitHandler<LoginFormState> = async (data) => {
    const resp = await mutateAsync({ data });
    loginSuccesedFn();
    lastLoginChangedFn(data.login);
    onSuccess?.();
  };

  return (
    <Stack component={'form'} onSubmit={handleSubmit(onSubmit)}>
      <TextInput {...register('login')} />
      <PasswordInput {...register('password')} />
      <Button type="submit">Submit</Button>
    </Stack>
  );
};
