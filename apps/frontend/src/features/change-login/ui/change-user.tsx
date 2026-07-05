import { TextInput, Loader } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useChangeLogin } from '../api/change-login.mutation';
import { useMe } from '@/entities/user';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getUserControllerMeQueryKey } from '@/shared/api/orval';

export const ChangeLogin = () => {
  const { data: user, isLoading: isUserLoading } = useMe();
  const { mutateAsync, isPending } = useChangeLogin();
  const queryClient = useQueryClient();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (user?.login) {
      setValue(user.login);
    }
  }, [user?.login]);

  const debouncedMutate = useDebouncedCallback(async (val: string) => {
    const trimmed = val.trim();
    if (!trimmed || trimmed === user?.login) return;

    await mutateAsync(
      { data: { login: trimmed } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getUserControllerMeQueryKey() });
        },
      },
    );
  }, 600);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setValue(val);
    debouncedMutate(val);
  };

  return (
    <TextInput
      loading={isPending}
      label="Логин"
      placeholder="Введите новый логин"
      value={value}
      onChange={handleChange}
      disabled={isUserLoading}
      rightSection={isPending ? <Loader size="xs" /> : null}
    />
  );
};
