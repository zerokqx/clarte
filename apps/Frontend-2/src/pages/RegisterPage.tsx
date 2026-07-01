import { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Stack,
  Alert,
} from '@mantine/core';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const registerSchema = z
  .object({
    login: z
      .string()
      .min(3, 'Логин должен быть минимум 3 символа')
      .max(20, 'Логин не должен превышать 20 символов')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Логин должен содержать только латинские буквы, цифры и _',
      ),
    password: z
      .string()
      .min(8, 'Пароль должен быть минимум 8 символов')
      .max(32, 'Пароль не должен превышать 32 символа'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const form = useForm<RegisterForm>({
    mode: 'uncontrolled',
    initialValues: {
      login: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      login: (value) => {
        const result = registerSchema.shape.login.safeParse(value);
        return result.success ? null : result.error.issues[0].message;
      },
      password: (value) => {
        const result = registerSchema.shape.password.safeParse(value);
        return result.success ? null : result.error.issues[0].message;
      },
      confirmPassword: (value, values) => {
        if (value !== values.password) {
          return 'Пароли не совпадают';
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: RegisterForm) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await register(values.login, values.password);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      console.error('Ошибка регистрации:', err);

      
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        err.response?.data?.details ||
        err.message;

      if (
        status === 409 ||
        message?.includes('already exists') ||
        message?.includes('существует')
      ) {
        setError('Пользователь с таким логином уже существует');
      } else if (status === 400) {
        setError('Неверный формат данных. Проверьте введённые данные.');
      } else if (status === 404) {
        setError('Сервис регистрации недоступен. Попробуйте позже.');
      } else if (status === 500) {
        setError('Внутренняя ошибка сервера. Попробуйте позже.');
      } else if (status === 503) {
        setError('Сервис временно недоступен. Попробуйте позже.');
      } else if (message) {
        setError(message);
      } else {
        setError(
          'Ошибка регистрации. Проверьте введённые данные и попробуйте снова.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" mt={100}>
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg">
          Регистрация
        </Title>

        {success ? (
          <Alert title="Успешно!" color="green" variant="light">
            Регистрация успешна! Перенаправление на страницу входа...
          </Alert>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Логин"
                placeholder="Введите логин (мин. 3 символа)"
                description="Латинские буквы, цифры и _"
                {...form.getInputProps('login')}
              />

              <PasswordInput
                label="Пароль"
                placeholder="Введите пароль"
                description="8+ символов, заглавная буква, спецсимвол"
                {...form.getInputProps('password')}
              />

              <PasswordInput
                label="Повторите пароль"
                placeholder="Повторите пароль"
                {...form.getInputProps('confirmPassword')}
              />

              {error && (
                <Alert title="Ошибка" color="red" variant="light">
                  {error}
                </Alert>
              )}

              <Button type="submit" fullWidth loading={isLoading}>
                Зарегистрироваться
              </Button>
            </Stack>
          </form>
        )}

        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
            color: '#666',
          }}
        >
          Уже есть аккаунт?{' '}
          <a href="/login" style={{ color: '#1a73e8', textDecoration: 'none' }}>
            Войти
          </a>
        </div>
      </Paper>
    </Container>
  );
};
