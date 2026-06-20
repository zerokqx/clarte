import { TextInput, PasswordInput, Button, Stack, Anchor, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import type { LoginFormValues } from '../model/use-login';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isPending: boolean;
}

export function LoginForm({ onSubmit, isPending }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    initialValues: { login: '', password: '' },
    validate: {
      login: (v) => (v.length < 1 ? 'Введите логин' : null),
      password: (v) => (v.length < 6 ? 'Минимум 6 символов' : null),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Логин"
          placeholder="your_login"
          {...form.getInputProps('login')}
        />
        <PasswordInput
          label="Пароль"
          placeholder="••••••••"
          {...form.getInputProps('password')}
        />
        <Button type="submit" loading={isPending} fullWidth>
          Войти
        </Button>
        <Text ta="center" size="sm">
          Нет аккаунта?{' '}
          <Anchor component={Link} to={ROUTES.register}>
            Зарегистрироваться
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}
