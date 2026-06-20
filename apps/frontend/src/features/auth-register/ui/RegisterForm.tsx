import { TextInput, PasswordInput, Button, Stack, Anchor, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import type { RegisterFormValues } from '../model/use-register';

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void;
  isPending: boolean;
}

export function RegisterForm({ onSubmit, isPending }: RegisterFormProps) {
  const form = useForm<RegisterFormValues>({
    initialValues: { login: '', password: '' },
    validate: {
      login: (v) => (v.length < 1 || v.length > 30 ? 'От 1 до 30 символов' : null),
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
          Зарегистрироваться
        </Button>
        <Text ta="center" size="sm">
          Уже есть аккаунт?{' '}
          <Anchor component={Link} to={ROUTES.login}>
            Войти
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}
