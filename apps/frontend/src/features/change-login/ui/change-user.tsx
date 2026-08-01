import { Effect as E, pipe } from 'effect';
import { TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useChangeLogin } from '../api/change-login.mutation';
import { UserLoginSchema } from '@/entities/user';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getUserControllerMeQueryKey } from '@clarte/shared-api/endpoints';
import { ZodError } from 'zod';

type ChangeLoginProps = Pick<TextInput.Props, 'defaultValue'>;
export const ChangeLogin = ({ defaultValue }: ChangeLoginProps) => {
  const { mutateAsync, isPending } = useChangeLogin();
  const queryClient = useQueryClient();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState('');

  const debouncedMutate = useDebouncedCallback((val: string) => {
    const program = pipe(
      E.tryPromise({
        try: async () => {
          const res = await UserLoginSchema.parseAsync(val);
          setError('');
          return res;
        },
        catch: (e) => {
          if (e instanceof ZodError) {
            setError(e.issues[0].message);
          }
          return e;
        },
      }),
      E.flatMap((validLogin) =>
        E.tryPromise({
          try: () =>
            mutateAsync(
              { data: { login: validLogin } },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: getUserControllerMeQueryKey() });
                },
              },
            ),
          catch: (err) => err,
        }),
      ),
    );

    E.runPromiseExit(program);
  }, 600);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setValue(val);
    debouncedMutate(val);
  };

  return (
    <TextInput
      label="Логин"
      placeholder="Введите новый логин"
      value={value}
      onChange={handleChange}
      error={error}
      loading={isPending}
    />
  );
};
