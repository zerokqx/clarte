import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Stack,
} from '@mantine/core';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  login: z.string().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { login, isLoading, error: authError } = useAuth();

  const form = useForm<LoginForm>({
    mode: 'uncontrolled',
    initialValues: {
      login: localStorage.getItem('clarte_saved_login') || '',
      password: '',
    },
    validate: {
      login: (value) => {
        const result = loginSchema.shape.login.safeParse(value);
        return result.success ? null : result.error.issues[0].message;
      },
      password: (value) => {
        const result = loginSchema.shape.password.safeParse(value);
        return result.success ? null : result.error.issues[0].message;
      },
    },
  });

  const handleSubmit = async (values: LoginForm) => {
    const success = await login(values.login, values.password);
    if (success) {
      localStorage.setItem('clarte_saved_login', values.login);
      window.location.href = '/';
    }
  };

  return (
    <Container size="xs" mt={100}>
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg">
          Вход
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Логин"
              placeholder="Введите логин"
              {...form.getInputProps('login')}
            />

            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              {...form.getInputProps('password')}
            />

            {authError && (
              <div
                style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}
              >
                {authError}
              </div>
            )}

            <Button type="submit" fullWidth loading={isLoading} mt="sm">
              Войти
            </Button>
          </Stack>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
            color: '#666',
          }}
        >
          Нет аккаунта?{' '}
          <a
            href="/register"
            style={{ color: '#1a73e8', textDecoration: 'none' }}
          >
            Зарегистрироваться
          </a>
        </div>
      </Paper>
    </Container>
  );
};
